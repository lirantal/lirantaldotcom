import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { SITE } from '../src/config.mjs';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const site = process.argv[2] ? path.resolve(process.argv[2]) : path.join(root, '.vercel/output/static');
const images = new Set();
let pages = 0;

async function checkDirectory(directory) {
	for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
		const file = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			await checkDirectory(file);
			continue;
		}
		if (!file.endsWith('.html')) continue;
		const html = await fs.readFile(file, 'utf8');
		const meta = new Map();
		for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
			const attrs = Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [match[1], match[2]]));
			meta.set(attrs.property || attrs.name, attrs.content);
		}
		const image = new URL(meta.get('og:image'));
		const route = `/${path
			.relative(site, file)
			.replace(/(?:\/)?index\.html$/, '')
			.replace(/\.html$/, '')}`;
		const expected =
			meta.get('og:type') === 'article'
				? '/og/blog/'
				: route.startsWith('/speaking/talks/')
					? '/og/talks/'
					: route.startsWith('/speaking/events/')
						? '/og/events/'
						: route === '/'
							? '/og/home-'
							: route === '/research/papers'
								? '/og/papers-'
								: '/og/';
		if (!image.pathname.startsWith(expected)) throw new Error(`${route}: wrong section card: ${image.pathname}`);
		if (image.origin !== new URL(SITE.origin).origin || !image.pathname.startsWith('/og/'))
			throw new Error(`${file}: expected generated OG image`);
		if (meta.get('twitter:image') !== image.href || meta.get('twitter:card') !== 'summary_large_image')
			throw new Error(`${file}: Twitter image does not match OpenGraph`);
		if (meta.get('og:image:width') !== '1200' || meta.get('og:image:height') !== '630')
			throw new Error(`${file}: missing OG dimensions`);
		if (!meta.get('twitter:image:alt')?.includes('Developer Relations'))
			throw new Error(`${file}: missing accessible image description`);
		images.add(path.join(site, decodeURI(image.pathname)));
		pages++;
	}
}

await checkDirectory(site);
if (!pages) throw new Error('No HTML found; run npm run build first');
for (const image of images) {
	const metadata = await sharp(image).metadata();
	if (metadata.format !== 'png' || metadata.width !== 1200 || metadata.height !== 630)
		throw new Error(`Invalid social image: ${image}`);
}
console.log(`social-cards: verified OG/Twitter metadata on ${pages} pages and ${images.size} deployed PNGs`);
