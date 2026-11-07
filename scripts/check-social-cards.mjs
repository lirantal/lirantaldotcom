import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { SITE } from '../src/config.mjs';
import { BLOG_BASE, POST_BASE, TAG_BASE, CATEGORY_BASE } from '../src/utils/permalinks.js';

export function expectedCardPrefix(route) {
	const sections = {
		'/': 'home',
		'/writing': 'blog',
		'/speaking': 'speaking',
		'/research': 'research',
		'/open-source': 'open-source',
		'/research/papers': 'papers',
		'/research/reports': 'reports',
		'/research/advisories': 'advisories',
		'/media': 'media',
		'/hire-me': 'hire-me',
		'/books/nodejs-secure-coding': 'books',
		'/recognitions': 'recognitions',
	};
	for (const slug of ['talks', 'events', 'recordings', 'podcasts', 'press-kit'])
		sections[`/speaking/${slug}`] = `speaking/${slug}`;
	for (const slug of ['projects', 'contributions', 'impact']) sections[`/open-source/${slug}`] = `open-source/${slug}`;
	if (sections[route]) return `/og/${sections[route]}-`;
	const blogPath = BLOG_BASE ? `/${BLOG_BASE}` : '';
	if (route === blogPath || new RegExp(`^${blogPath}/[0-9]+$`).test(route)) return '/og/blog-';
	if ([TAG_BASE, CATEGORY_BASE].some((base) => base && (route === `/${base}` || route.startsWith(`/${base}/`))))
		return '/og/blog-';
	if (POST_BASE && route.startsWith(`/${POST_BASE}/`)) return '/og/blog/';
	if (route.startsWith('/speaking/talks/')) return '/og/talks/';
	if (route.startsWith('/speaking/events/')) return '/og/events/';
	if (route.startsWith('/research/')) return '/og/research/';
	// These static pages keep the homepage fallback even when blog bases are empty.
	if (['/about', '/contact', '/developers', '/privacy', '/404'].includes(route) || route.startsWith('/games/'))
		return '/og/home-';
	if (!TAG_BASE || !CATEGORY_BASE) return '/og/blog-';
	if (!POST_BASE) return '/og/blog/';
	return '/og/home-';
}

export async function checkSocialCards(site) {
	const images = new Set();
	let pages = 0;

	async function checkDirectory(directory) {
		for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
			const file = path.join(directory, entry.name);
			if (entry.isDirectory()) {
				await checkDirectory(file);
				continue;
			}
			if (path.relative(site, file).split(path.sep).join('/').startsWith('og/') && file.endsWith('.png'))
				images.add(file);
			if (!file.endsWith('.html')) continue;
			const html = await fs.readFile(file, 'utf8');
			const meta = new Map();
			for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
				const attrs = Object.fromEntries(
					[...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [match[1], match[2]])
				);
				meta.set(attrs.property || attrs.name, attrs.content);
			}
			const value = meta.get('og:image');
			if (!value) throw new Error(`${file}: missing og:image`);
			let image;
			try {
				image = new URL(value);
			} catch {
				throw new Error(`${file}: og:image must be an absolute URL: ${value}`);
			}
			const route = `/${path
				.relative(site, file)
				.replace(/(?:\/)?index\.html$/, '')
				.replace(/\.html$/, '')}`;
			const expected = expectedCardPrefix(route);
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
		let metadata;
		try {
			metadata = await sharp(image).metadata();
		} catch {
			throw new Error(`Invalid social image: ${image}`);
		}
		if (metadata.format !== 'png' || metadata.width !== 1200 || metadata.height !== 630)
			throw new Error(`Invalid social image: ${image}`);
	}
	console.log(`social-cards: verified OG/Twitter metadata on ${pages} pages and ${images.size} deployed PNGs`);

	return { pages, images: images.size };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const root = fileURLToPath(new URL('..', import.meta.url));
	await checkSocialCards(process.argv[2] ? path.resolve(process.argv[2]) : path.join(root, '.vercel/output/static'));
}
