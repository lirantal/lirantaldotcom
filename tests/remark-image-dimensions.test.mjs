import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import sharp from 'sharp';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { remarkImageDimensions } from '../src/utils/remark-image-dimensions.mjs';

async function fixture(t) {
	const publicDir = await mkdtemp(path.join(os.tmpdir(), 'image-dimensions-'));
	t.after(() => rm(publicDir, { recursive: true, force: true }));
	await sharp({ create: { width: 40, height: 20, channels: 3, background: 'white' } })
		.png()
		.toFile(path.join(publicDir, 'sample image.png'));
	return publicDir;
}

test('renders dimensions for public Markdown images, including encoded URLs and queries', async (t) => {
	const publicDir = await fixture(t);
	const processor = await createMarkdownProcessor({ remarkPlugins: [[remarkImageDimensions, { publicDir }]] });
	const { code } = await processor.render('![Example](/sample%20image.png?v=1#example)');
	assert.match(code, /width="40"/);
	assert.match(code, /height="20"/);
	assert.match(code, /src="\/sample%20image.png\?v=1#example"/);
});

test('leaves remote, missing, malformed, and out-of-directory images unchanged', async (t) => {
	const publicDir = await fixture(t);
	const nodes = [
		'https://example.com/image.png',
		'//example.com/image.png',
		'/missing.png',
		'/%invalid.png',
		'/../sample%20image.png',
	].map((url) => ({ type: 'image', url }));
	await remarkImageDimensions({ publicDir })({ type: 'root', children: nodes });
	assert.ok(nodes.every((node) => !node.data));
});

test('preserves explicitly supplied image dimensions', async (t) => {
	const publicDir = await fixture(t);
	const node = { type: 'image', url: '/sample%20image.png', data: { hProperties: { width: 10, height: 5 } } };
	await remarkImageDimensions({ publicDir })({ type: 'root', children: [node] });
	assert.deepEqual(node.data.hProperties, { width: 10, height: 5 });
});

test('reserves the displayed aspect ratio for EXIF-rotated photos', async (t) => {
	const publicDir = await fixture(t);
	await sharp(path.join(publicDir, 'sample image.png'))
		.jpeg()
		.withMetadata({ orientation: 6 })
		.toFile(path.join(publicDir, 'rotated.jpg'));
	const node = { type: 'image', url: '/rotated.jpg' };
	await remarkImageDimensions({ publicDir })({ type: 'root', children: [node] });
	assert.deepEqual(node.data.hProperties, { width: 20, height: 40 });
});
