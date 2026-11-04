import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const config = JSON.parse(await readFile(new URL('../../vercel.json', import.meta.url), 'utf8'));

test('year-long browser and Cloudflare caching applies only to build-fingerprinted assets', () => {
	const longLivedRules = config.headers.filter((rule) => rule.headers.some(({ value }) => value.includes('immutable')));
	assert.ok(longLivedRules.length > 0);
	const headersFor = (url) =>
		longLivedRules.filter(({ source }) => new RegExp(`^${source}$`).test(url)).flatMap(({ headers }) => headers);
	for (const asset of [
		'/_astro/portrait.Abc12345.avif',
		'/_astro/app.Abc12345.js',
		'/_astro/style.Abc12345.css',
		'/_astro/inter.Abc12345.woff2',
	]) {
		const headers = headersFor(asset);
		for (const name of ['cache-control', 'cloudflare-cdn-cache-control']) {
			const value = headers.find(({ key }) => key.toLowerCase() === name)?.value;
			assert.match(value, /(?:^|,\s*)max-age=31536000(?:,|$)/);
			assert.match(value, /(?:^|,\s*)immutable(?:,|$)/);
		}
	}
	for (const mutable of [
		'/',
		'/blog/example',
		'/index.md',
		'/blog/example.md',
		'/_markdown/index.md',
		'/?mode=agent',
		'/agent-view.json',
		'/api/posts.json',
		'/api/posts/cursor/0.json',
		'/pagefind/pagefind.js',
		'/images/blog/example.png',
		'/robots.txt',
		'/.well-known/api-catalog',
		'/_image',
		'/404',
	]) {
		assert.deepEqual(headersFor(mutable), [], `${mutable} must not inherit immutable asset caching`);
	}
});
