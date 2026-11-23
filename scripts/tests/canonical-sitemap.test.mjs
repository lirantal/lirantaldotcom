import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { pathToFileURL } from 'node:url';
import { canonicalSitemap } from '../canonical-sitemap.mjs';

test('sitemap advertises only published indexable canonical HTML', async (t) => {
	const output = await mkdtemp(path.join(tmpdir(), 'lirantal-sitemap-'));
	t.after(() => rm(output, { recursive: true, force: true }));
	const site = 'https://lirantal.com';
	const pages = [
		['/', `${site}/`, 'index,follow'],
		['/article', `${site}/article`, 'index,follow'],
		['/syndicated', 'https://publisher.example/article', 'index,follow'],
		['/alias', `${site}/article`, 'index,follow'],
		['/tag/alias', `${site}/tag/alias`, 'noindex,follow'],
	];
	for (const [pathname, canonical, robots] of pages) {
		const directory = path.join(output, pathname);
		await mkdir(directory, { recursive: true });
		await writeFile(path.join(directory, 'index.html'), `<head><link rel="canonical" href="${canonical}"><meta name="robots" content="${robots}"></head>`);
	}

	const { hooks } = canonicalSitemap();
	await hooks['astro:routes:resolved']({ routes: [] });
	await hooks['astro:config:done']({ config: { site, base: '/', trailingSlash: 'never' } });
	await hooks['astro:build:done']({
		dir: pathToFileURL(output + path.sep),
		pages: pages.map(([pathname]) => ({ pathname })),
		logger: { info() {}, warn: assert.fail, error: assert.fail },
	});

	const xml = await readFile(path.join(output, 'sitemap-0.xml'), 'utf8');
	const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
	assert.deepEqual(locations, [`${site}/`, `${site}/article`]);
	assert.doesNotMatch(xml, /<lastmod>|<changefreq>/);
});
