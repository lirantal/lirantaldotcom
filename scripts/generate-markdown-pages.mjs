import fs from 'node:fs/promises';
import path from 'node:path';
import TurndownService from 'turndown';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const site = await getSiteDirectory();
const outputRoot = path.join(site, '_markdown');
const markdownRoutes = [];

const turndown = new TurndownService({
	codeBlockStyle: 'fenced',
	emDelimiter: '*',
	headingStyle: 'atx',
});

turndown.remove(['script', 'style', 'noscript', 'svg']);

await fs.rm(outputRoot, { recursive: true, force: true });

const htmlFiles = await collectHtmlFiles(site);
let generated = 0;

for (const htmlFile of htmlFiles) {
	const relativeHtmlPath = path.relative(site, htmlFile);
	if (relativeHtmlPath.startsWith(`_markdown${path.sep}`)) {
		continue;
	}

	const html = await fs.readFile(htmlFile, 'utf8');
	const markdown = htmlToMarkdown(html);
	const markdownPath = markdownOutputPath(relativeHtmlPath);
	const outputFile = path.join(outputRoot, markdownPath);

	await fs.mkdir(path.dirname(outputFile), { recursive: true });
	await fs.writeFile(outputFile, `${markdown}\n`);
	markdownRoutes.push({
		source: pageRoutePath(relativeHtmlPath),
		destination: `/_markdown/${markdownPath.split(path.sep).join('/')}`,
		tokens: estimateTokenCount(markdown),
	});
	generated += 1;
}

console.log(`markdown-pages: generated ${generated} markdown files in ${path.relative(root, outputRoot)}`);
await configureVercelOutput(markdownRoutes);

async function getSiteDirectory() {
	const clientDir = path.join(root, 'dist', 'client');
	try {
		const stat = await fs.stat(clientDir);
		if (stat.isDirectory()) {
			return clientDir;
		}
	} catch {
		// Static Astro builds use dist/ without a client subdirectory.
	}

	return path.join(root, 'dist');
}

async function collectHtmlFiles(directory) {
	const entries = await fs.readdir(directory, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const fullPath = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await collectHtmlFiles(fullPath)));
		} else if (entry.isFile() && entry.name.endsWith('.html')) {
			files.push(fullPath);
		}
	}

	return files;
}

function markdownOutputPath(relativeHtmlPath) {
	const normalized = relativeHtmlPath.split(path.sep).join('/');

	if (normalized === 'index.html') {
		return 'index.md';
	}

	if (normalized.endsWith('/index.html')) {
		return `${normalized.slice(0, -'/index.html'.length)}.md`;
	}

	return normalized.replace(/\.html$/, '.md');
}

function pageRoutePath(relativeHtmlPath) {
	const normalized = relativeHtmlPath.split(path.sep).join('/');

	if (normalized === 'index.html') {
		return '/';
	}

	if (normalized.endsWith('/index.html')) {
		return `/${normalized.slice(0, -'/index.html'.length)}`;
	}

	return `/${normalized.replace(/\.html$/, '')}`;
}

async function configureVercelOutput(routes) {
	const configFile = path.join(root, '.vercel', 'output', 'config.json');

	try {
		await fs.access(configFile);
	} catch {
		return;
	}

	const config = JSON.parse(await fs.readFile(configFile, 'utf8'));
	const existingRoutes = Array.isArray(config.routes) ? config.routes : [];
	const markdownNegotiationRoutes = routes.map((route) => ({
		src: `^${escapeRegex(route.source)}\\/?$`,
		has: [
			{
				type: 'header',
				key: 'accept',
				value: '(.*)text/markdown(.*)',
			},
		],
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			Vary: 'Accept',
			'x-markdown-tokens': String(route.tokens),
		},
		dest: route.destination,
	}));
	const routesWithoutOldMarkdownNegotiation = existingRoutes.filter(
		(route) => !(route.dest?.startsWith('/_markdown/') && route.headers?.['x-markdown-tokens'])
	);
	const filesystemRouteIndex = routesWithoutOldMarkdownNegotiation.findIndex((route) => route.handle === 'filesystem');
	const insertAt = filesystemRouteIndex === -1 ? routesWithoutOldMarkdownNegotiation.length : filesystemRouteIndex;

	config.routes = [
		...routesWithoutOldMarkdownNegotiation.slice(0, insertAt),
		...markdownNegotiationRoutes,
		...routesWithoutOldMarkdownNegotiation.slice(insertAt),
	];

	await fs.writeFile(configFile, `${JSON.stringify(config, null, '\t')}\n`);
	console.log(`markdown-pages: configured ${markdownNegotiationRoutes.length} Vercel markdown negotiation routes`);
}

function htmlToMarkdown(html) {
	const metadata = extractMetadata(html);
	const jsonLd = extractJsonLd(html);
	const body = extractContentHtml(html);
	const markdownBody = normalizeMarkdown(turndown.turndown(body));
	const frontmatter = renderFrontmatter(metadata);
	const jsonLdBlock = jsonLd.length > 0 ? `\n\n\`\`\`json\n${jsonLd.join('\n')}\n\`\`\`` : '';

	return `${frontmatter}${markdownBody}${jsonLdBlock}`.trim();
}

function extractMetadata(html) {
	const metaTags = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => parseAttributes(match[0]));

	const byName = (name) =>
		metaTags.find((attrs) => attrs.name?.toLowerCase() === name || attrs.property?.toLowerCase() === name)?.content;

	return {
		title: textContent(matchFirst(html, /<title\b[^>]*>([\s\S]*?)<\/title>/i)) || decodeHtml(byName('og:title')),
		description: decodeHtml(byName('description') || byName('og:description')),
		image: decodeHtml(byName('og:image')),
	};
}

function extractJsonLd(html) {
	return [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
		.map((match) => match[1].trim())
		.filter(Boolean);
}

function extractContentHtml(html) {
	const main = matchFirst(html, /<main\b[^>]*>([\s\S]*?)<\/main>/i);
	const body = main || matchFirst(html, /<body\b[^>]*>([\s\S]*?)<\/body>/i) || html;

	return body
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/<header\b[\s\S]*?<\/header>/gi, '')
		.replace(/<footer\b[\s\S]*?<\/footer>/gi, '')
		.replace(/<nav\b[\s\S]*?<\/nav>/gi, '')
		.replace(/<script\b[\s\S]*?<\/script>/gi, '')
		.replace(/<style\b[\s\S]*?<\/style>/gi, '');
}

function renderFrontmatter(metadata) {
	const entries = Object.entries(metadata).filter(([, value]) => Boolean(value));

	if (entries.length === 0) {
		return '';
	}

	const lines = entries.map(([key, value]) => `${key}: ${JSON.stringify(value)}`);
	return `---\n${lines.join('\n')}\n---\n\n`;
}

function normalizeMarkdown(markdown) {
	return markdown
		.replace(/\n{3,}/g, '\n\n')
		.replace(/[ \t]+\n/g, '\n')
		.trim();
}

function estimateTokenCount(markdown) {
	const trimmed = markdown.trim();

	if (!trimmed) {
		return 0;
	}

	return Math.ceil(trimmed.length / 4);
}

function escapeRegex(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function matchFirst(value, pattern) {
	return value.match(pattern)?.[1] ?? '';
}

function parseAttributes(tag) {
	const attrs = {};

	for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/g)) {
		attrs[match[1].toLowerCase()] = decodeHtml(match[3]);
	}

	return attrs;
}

function textContent(value) {
	return decodeHtml(value.replace(/<[^>]+>/g, '').trim());
}

function decodeHtml(value = '') {
	return value
		.replace(/&nbsp;/g, ' ')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&')
		.trim();
}
