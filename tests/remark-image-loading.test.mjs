import assert from 'node:assert/strict';
import test from 'node:test';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { remarkImageLoading } from '../src/utils/remark-image-loading.mjs';

test('renders lazy, asynchronously decoded Markdown images for local and remote URLs', async () => {
	const processor = await createMarkdownProcessor({ remarkPlugins: [remarkImageLoading] });
	for (const url of ['/images/blog/example.png', 'https://example.com/image.png', './image.png']) {
		const { code } = await processor.render(`![Screenshot](${url})`);
		assert.match(code, /loading="lazy"/);
		assert.match(code, /decoding="async"/);
		assert.ok(code.includes(`src="${url}"`));
		assert.match(code, /alt="Screenshot"/);
	}
});

test('preserves author-supplied loading, decoding, dimensions, and priority', () => {
	const properties = { loading: 'eager', decoding: 'sync', width: 40, height: 20, fetchPriority: 'high' };
	const node = { type: 'image', url: '/example.png', data: { hProperties: { ...properties } } };
	remarkImageLoading()({ type: 'root', children: [node] });
	assert.deepEqual(node.data.hProperties, properties);
});

test('keeps explicitly high-priority images eager and leaves authored HTML alone', async () => {
	const node = { type: 'image', url: '/example.png', data: { hProperties: { fetchPriority: 'high' } } };
	remarkImageLoading()({ type: 'root', children: [node] });
	assert.equal(node.data.hProperties.loading, 'eager');
	const processor = await createMarkdownProcessor({ remarkPlugins: [remarkImageLoading] });
	const { code } = await processor.render(
		'<img src="/hero.png" loading="eager" decoding="sync" width="40" height="20">'
	);
	assert.match(code, /loading="eager"/);
	assert.match(code, /decoding="sync"/);
	assert.doesNotMatch(code, /loading="lazy"/);
});
