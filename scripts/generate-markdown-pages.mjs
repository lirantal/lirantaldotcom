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
	const pageMarkdownFile = path.join(site, markdownPath);

	await fs.mkdir(path.dirname(outputFile), { recursive: true });
	await fs.writeFile(outputFile, `${markdown}\n`);
	await fs.mkdir(path.dirname(pageMarkdownFile), { recursive: true });
	await fs.writeFile(pageMarkdownFile, `${markdown}\n`);
	await syncMarkdownTwinToVercel(pageMarkdownFile, markdownPath);
	markdownRoutes.push({
		source: pageRoutePath(relativeHtmlPath),
		filePath: markdownPath,
		destination: `/_markdown/${markdownPath.split(path.sep).join('/')}`,
		tokens: estimateTokenCount(markdown),
	});
	generated += 1;
}

const postApiPath = path.join(site, 'api', 'posts.json');
try {
	const postApi = JSON.parse(await fs.readFile(postApiPath, 'utf8'));
	const apiMarkdown = apiJsonToMarkdown(postApi);
	const markdownPath = path.join('api', 'posts.json.md');
	const outputFile = path.join(outputRoot, markdownPath);
	const pageMarkdownFile = path.join(site, markdownPath);
	await fs.mkdir(path.dirname(outputFile), { recursive: true });
	await fs.writeFile(outputFile, `${apiMarkdown}\n`);
	await fs.mkdir(path.dirname(pageMarkdownFile), { recursive: true });
	await fs.writeFile(pageMarkdownFile, `${apiMarkdown}\n`);
	await syncMarkdownTwinToVercel(pageMarkdownFile, markdownPath);
	markdownRoutes.push({
		source: '/api/posts.json',
		filePath: markdownPath,
		destination: '/_markdown/api/posts.json.md',
		tokens: estimateTokenCount(apiMarkdown),
	});
	generated += 1;
} catch (error) {
	if (error.code !== 'ENOENT') throw error;
}

const notFoundMarkdown = `---\ntitle: Page not found — Liran Tal\ndescription: This URL does not match a published page on lirantal.com.\ncanonical: https://lirantal.com/404\n---\n\n# Page not found\n\nThis URL does not match a published page on lirantal.com. Browse the [site index](https://lirantal.com/llms.txt) or [developer resources](https://lirantal.com/developers).`;
const notFoundMarkdownFile = path.join(outputRoot, '404.md');
await fs.mkdir(path.dirname(notFoundMarkdownFile), { recursive: true });
await fs.writeFile(notFoundMarkdownFile, `${notFoundMarkdown}\n`);
await syncMarkdownTwinToVercel(notFoundMarkdownFile, path.join('_markdown', '404.md'));

console.log(`markdown-pages: generated ${generated} markdown files in ${path.relative(root, outputRoot)}`);
await configureVercelOutput(markdownRoutes);

async function syncMarkdownTwinToVercel(sourceFile, markdownPath) {
	const vercelStatic = path.join(root, '.vercel', 'output', 'static');
	const destination = path.join(vercelStatic, markdownPath);

	try {
		await fs.access(vercelStatic);
	} catch {
		return;
	}

	await fs.mkdir(path.dirname(destination), { recursive: true });
	await fs.copyFile(sourceFile, destination);
}

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
	const agentViewRoute = {
		src: '^/$',
		has: [{ type: 'query', key: 'mode', value: 'agent' }],
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
		dest: '/agent-view.json',
	};
	const markdownNegotiationRoutes = routes.flatMap((route) => [
		makeMarkdownRoute(route, {
			key: 'accept',
			value: '(.*)text/markdown(.*)',
			vary: 'Accept',
		}),
		makeMarkdownRoute(route, {
			key: 'user-agent',
			value: '(GPTBot|ClaudeBot|ChatGPT-User|PerplexityBot|Google-Extended|Applebot-Extended|ora-agent|DeepSeekBot)',
			vary: 'User-Agent',
		}),
	]);
	const notFoundRoutes = [
		{
			src: '^/api/.*$',
			headers: { 'Content-Type': 'application/problem+json; charset=utf-8' },
			dest: '/_errors/api-not-found.json',
			status: 404,
		},
		{
			src: '^/.*$',
			has: [{ type: 'header', key: 'accept', value: '(.*)text/markdown(.*)' }],
			headers: {
				'Content-Type': 'text/markdown; charset=utf-8',
				Vary: 'Accept',
				'x-markdown-tokens': String(estimateTokenCount(notFoundMarkdown)),
			},
			dest: '/_markdown/404.md',
			status: 404,
		},
		{
			src: '^/.*$',
			has: [
				{
					type: 'header',
					key: 'user-agent',
					value:
						'(GPTBot|ClaudeBot|ChatGPT-User|PerplexityBot|Google-Extended|Applebot-Extended|ora-agent|DeepSeekBot)',
				},
			],
			headers: {
				'Content-Type': 'text/markdown; charset=utf-8',
				Vary: 'User-Agent',
				'x-markdown-tokens': String(estimateTokenCount(notFoundMarkdown)),
			},
			dest: '/_markdown/404.md',
			status: 404,
		},
	];
	const routesWithoutOldMarkdownNegotiation = existingRoutes.filter(
		(route) =>
			!(route.dest?.startsWith('/_markdown/') && route.headers?.['x-markdown-tokens']) &&
			!(route.dest === '/_errors/api-not-found.json') &&
			!(
				route.dest === '/agent-view.json' &&
				route.has?.some(({ type, key, value }) => type === 'query' && key === 'mode' && value === 'agent')
			)
	);
	const filesystemRouteIndex = routesWithoutOldMarkdownNegotiation.findIndex((route) => route.handle === 'filesystem');
	const insertAt = filesystemRouteIndex === -1 ? routesWithoutOldMarkdownNegotiation.length : filesystemRouteIndex;
	const notFoundInsertAt =
		filesystemRouteIndex === -1 ? routesWithoutOldMarkdownNegotiation.length : filesystemRouteIndex + 1;

	config.routes = [
		...routesWithoutOldMarkdownNegotiation.slice(0, insertAt),
		agentViewRoute,
		...markdownNegotiationRoutes,
		...routesWithoutOldMarkdownNegotiation.slice(insertAt, notFoundInsertAt),
		...notFoundRoutes,
		...routesWithoutOldMarkdownNegotiation.slice(notFoundInsertAt),
	];
	config.overrides ??= {};
	for (const route of routes) {
		config.overrides[route.filePath] = {
			...config.overrides[route.filePath],
			contentType: 'text/markdown; charset=utf-8',
		};
	}
	config.overrides['_markdown/404.md'] = {
		...config.overrides['_markdown/404.md'],
		contentType: 'text/markdown; charset=utf-8',
	};

	await fs.writeFile(configFile, `${JSON.stringify(config, null, '\t')}\n`);
	console.log(`markdown-pages: configured ${markdownNegotiationRoutes.length} Vercel markdown negotiation routes`);
}

function htmlToMarkdown(html) {
	const metadata = extractMetadata(html);
	const jsonLd = extractJsonLd(html);
	const body = extractContentHtml(html);
	const markdownBody = normalizeMarkdown(turndown.turndown(body));
	const pageHeading = markdownBody.startsWith('# ') ? '' : `# ${metadata.title || 'Liran Tal'}\n\n`;
	const jsonLdBlock = jsonLd.length > 0 ? `\n\n\`\`\`json\n${jsonLd.join('\n')}\n\`\`\`` : '';
	const frontmatter = [
		'---',
		`title: ${JSON.stringify(metadata.title || 'Liran Tal')}`,
		...(metadata.description ? [`description: ${JSON.stringify(metadata.description)}`] : []),
		...(metadata.canonical ? [`canonical: ${JSON.stringify(metadata.canonical)}`] : []),
		'---',
	].join('\n');

	return `${frontmatter}\n\n${pageHeading}${markdownBody}${jsonLdBlock}`.trim();
}

function apiJsonToMarkdown(collection) {
	const frontmatter = [
		'---',
		'title: "Liran Tal published blog posts API"',
		'description: "Markdown representation of the public, read-only published post metadata API."',
		'canonical: "https://lirantal.com/api/posts.json"',
		'---',
	].join('\n');
	const records = Array.isArray(collection.items) ? collection.items.length : 0;

	return `${frontmatter}\n\n# Published blog posts API\n\n${collection.description || 'Published post metadata from lirantal.com.'}\n\nThis response contains ${records} published post records. For pagination, use [the first cursor page](https://lirantal.com/api/posts/cursor/0.json).\n\n## JSON response\n\n\`\`\`json\n${JSON.stringify(collection, null, 2)}\n\`\`\``;
}

function extractMetadata(html) {
	const metaTags = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => parseAttributes(match[0]));
	const linkTags = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => parseAttributes(match[0]));

	const byName = (name) =>
		metaTags.find((attrs) => attrs.name?.toLowerCase() === name || attrs.property?.toLowerCase() === name)?.content;

	return {
		title: textContent(matchFirst(html, /<title\b[^>]*>([\s\S]*?)<\/title>/i)) || decodeHtml(byName('og:title')),
		description: decodeHtml(byName('description') || byName('og:description')),
		image: decodeHtml(byName('og:image')),
		canonical: linkTags.find((attrs) => attrs.rel?.toLowerCase().split(/\s+/).includes('canonical'))?.href,
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

function normalizeMarkdown(markdown) {
	return markdown
		.replace(/\n{3,}/g, '\n\n')
		.replace(/[ \t]+\n/g, '\n')
		.trim();
}

function makeMarkdownRoute(route, { key, value, vary }) {
	return {
		src: `^${escapeRegex(route.source)}\\/?$`,
		has: [{ type: 'header', key, value }],
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			Vary: vary,
			'x-markdown-tokens': String(route.tokens),
		},
		dest: route.destination,
	};
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
