import fs from 'node:fs/promises';
import path from 'node:path';
import { SITE } from '../src/config.mjs';

// Check the actual deploy bundle, including postbuild Markdown and Pagefind files.
const root = path.resolve(new URL('..', import.meta.url).pathname);
const site = process.argv[2] ? path.resolve(process.argv[2]) : path.join(root, '.vercel/output/static');
const origin = new URL(SITE.origin);
const files = await collectFiles(site);
const deployed = new Set(files.map((file) => path.relative(site, file).split(path.sep).join('/')));
const { redirects = [] } = JSON.parse(await fs.readFile(path.join(root, 'vercel.json'), 'utf8'));
const redirected = new Set(
	redirects.filter((route) => !route.has && !route.source.includes(':')).map((route) => route.source)
);
const failures = new Set();
let pages = 0;

for (const file of files.filter((file) => file.endsWith('.html'))) {
	const relative = path.relative(site, file).split(path.sep).join('/');
	const route = `/${relative.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '')}`;
	const source = await fs.readFile(file, 'utf8');
	const body = source.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? '';
	const unprotected = body.replace(/<!--email_off-->[\s\S]*?<!--\/email_off-->/g, '');
	if (/[\w.%+-]+@[\w.-]+\.[a-z]{2,}/i.test(unprotected)) {
		failures.add(`${route} → email address outside Cloudflare email_off markers`);
	}
	const html = source.replace(/<!--[\s\S]*?-->/g, '');
	pages += 1;
	for (const tag of html.matchAll(/<(?:a|link|script|img|source)\b[^>]*>/gi)) {
		for (const attr of tag[0].matchAll(/\b(?:href|src)\s*=\s*(["'])(.*?)\1/gi)) {
			let target;
			try {
				target = new URL(attr[2].replace(/&amp;/g, '&'), new URL(route, origin));
			} catch {
				failures.add(`${route} → invalid URL: ${attr[2]}`);
				continue;
			}
			if (target.origin !== origin.origin && target.hostname !== `www.${origin.hostname}`) continue;
			const pathname = decodeURIComponent(target.pathname);
			const resource = pathname.replace(/^\//, '').replace(/\/$/, '');
			const candidates = [resource, `${resource}.html`, resource ? `${resource}/index.html` : 'index.html'];
			if (!candidates.some((candidate) => deployed.has(candidate)) && !redirected.has(pathname)) {
				failures.add(`${route} → ${target.pathname}`);
			}
		}
	}
}

if (pages === 0) throw new Error(`No HTML pages found in ${site}; run npm run build first`);
if (failures.size > 0) {
	console.error([...failures].sort().join('\n'));
	throw new Error(`Found ${failures.size} broken internal references across ${pages} pages`);
}
console.log(`internal-links: checked ${pages} HTML pages against ${deployed.size} deployed files`);

async function collectFiles(directory) {
	const files = [];
	for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
		const fullPath = path.join(directory, entry.name);
		if (entry.isDirectory()) files.push(...(await collectFiles(fullPath)));
		else if (entry.isFile()) files.push(fullPath);
	}
	return files;
}
