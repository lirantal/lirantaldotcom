import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import sharp from 'sharp';
import { checkSocialCards } from '../check-social-cards.mjs';
import { blogArchivePaths, isPrefixedBlogArchive } from '../../src/utils/social-card-archives.mjs';

const root = fileURLToPath(new URL('../..', import.meta.url));
const png = sharp({ create: { width: 1200, height: 630, channels: 3, background: '#fff' } })
	.png()
	.toBuffer();

async function fixture(t) {
	const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'social checks résumé '));
	t.after(() => fs.rm(directory, { recursive: true, force: true }));
	const write = async (name, content) => {
		const file = path.join(directory, name);
		await fs.mkdir(path.dirname(file), { recursive: true });
		await fs.writeFile(file, content);
		return file;
	};
	await write('og/home-test.png', await png);
	return { directory, write };
}

function html(image = 'https://lirantal.com/og/home-test.png', type = 'website') {
	return `<meta property="og:image" content="${image}">
		<meta property="og:type" content="${type}">
		<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
		<meta name="twitter:image" content="${image}"><meta name="twitter:card" content="summary_large_image">
		<meta name="twitter:image:alt" content="Liran Tal, Developer Relations &amp; Security Research">`;
}

test('validates unreferenced paper PNGs, including malformed and wrong-sized files', async (t) => {
	const { directory, write } = await fixture(t);
	await write('index.html', html());
	await write('og/papers/paper-test.png', await png);
	assert.deepEqual(await checkSocialCards(directory), { pages: 1, images: 2 });
	await write(
		'og/papers/paper-test.png',
		await sharp({ create: { width: 10, height: 10, channels: 3, background: '#fff' } })
			.png()
			.toBuffer()
	);
	await assert.rejects(checkSocialCards(directory), /Invalid social image:.*paper-test\.png/);
	await write('og/papers/paper-test.png', 'not a PNG');
	await assert.rejects(checkSocialCards(directory), /Invalid social image:.*paper-test\.png/);
});

test('rejects the wrong section card independently of og:type', async (t) => {
	const { directory, write } = await fixture(t);
	for (const route of [
		'research/reports',
		'research/advisories',
		'media',
		'speaking/talks',
		'speaking/podcasts',
		'blog/example',
		'blog/2',
		'tag/nodejs',
	]) {
		const file = await write(`${route}/index.html`, html());
		await assert.rejects(checkSocialCards(directory), /wrong section card/);
		await fs.rm(file);
	}
});

test('missing, relative and malformed og:image errors name the offending page', async (t) => {
	const { directory, write } = await fixture(t);
	for (const image of ['', '/og/home-test.png', 'https://[invalid']) {
		await write('index.html', html(image));
		await assert.rejects(
			checkSocialCards(directory),
			/index\.html: (missing og:image|og:image must be an absolute URL)/
		);
	}
});

test('configured and empty archive bases keep paginated archives without swallowing unrelated pages', () => {
	const posts = [
		{ tags: ['Node.js'], category: 'Security' },
		{ tags: ['Node.js'], category: 'Security' },
	];
	const paths = blogArchivePaths(posts, {
		bases: { blog: 'articles', tag: 'topics', category: 'subjects' },
		pageSize: 1,
		basePath: '',
	});
	for (const route of ['/articles', '/articles/2', '/topics/node-js', '/topics/node-js/2', '/subjects/security/2'])
		assert.ok(paths.includes(route), route);
	const rootPaths = blogArchivePaths(posts, { bases: { blog: '', tag: '', category: '' }, pageSize: 1, basePath: '' });
	for (const route of ['/', '/2', '/node-js', '/node-js/2', '/security/2']) assert.ok(rootPaths.includes(route), route);
	assert.ok(!rootPaths.includes('/privacy'));
	assert.equal(isPrefixedBlogArchive('/privacy', { blog: '', tag: '', category: '' }), false);
	assert.equal(isPrefixedBlogArchive('/articles/2', { blog: 'articles' }), true);
	assert.equal(isPrefixedBlogArchive('/articles-other', { blog: 'articles' }), false);
});

test('CLI locates its default deploy directory in a checkout with spaces and Unicode', async (t) => {
	const { directory, write } = await fixture(t);
	for (const name of ['scripts/check-social-cards.mjs', 'src/config.mjs', 'src/utils/permalinks.js']) {
		await write(name, await fs.readFile(path.join(root, name)));
	}
	await fs.symlink(path.join(root, 'node_modules'), path.join(directory, 'node_modules'), 'dir');
	await write('.vercel/output/static/index.html', html());
	await write('.vercel/output/static/og/home-test.png', await png);
	const result = spawnSync(process.execPath, [path.join(directory, 'scripts/check-social-cards.mjs')], {
		encoding: 'utf8',
	});
	assert.equal(result.status, 0, result.stderr);
	assert.match(result.stdout, /1 pages and 1 deployed PNGs/);
});
