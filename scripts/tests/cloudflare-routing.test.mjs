import assert from 'node:assert/strict';
import test from 'node:test';
import { createHandler } from '../../cloudflare/handler.mjs';
import policy from '../../cloudflare/http-policy.json' with { type: 'json' };

const fetch = createHandler({
	markdown: {
		'/': { destination: '/_markdown/index.md', tokens: 4 },
		'/api/posts.json': { destination: '/_markdown/api/posts.json.md', tokens: 3 },
		'/writing': { destination: '/_markdown/writing.md', tokens: 5 },
	},
	redirects: [{ src: '^/speaking-events/?$', status: 308, headers: { Location: '/speaking/events' } }],
	media: { '/video.mp4': { key: 'video.mp4', size: 10, contentType: 'video/mp4' } },
	policy,
});
const files = {
	'/': ['<html>Home</html>', 'text/html'],
	'/writing': ['<html>Writing</html>', 'text/html'],
	'/_markdown/index.md': ['# Home', 'text/plain'],
	'/_markdown/writing.md': ['# Writing', 'text/plain'],
	'/_markdown/404.md': ['# Page not found', 'text/plain'],
	'/404': ['<html>Not found</html>', 'text/html'],
	'/api/posts.json': ['{"items":[]}', 'application/json'],
	'/_markdown/api/posts.json.md': ['# Posts', 'text/plain'],
	'/_errors/api-not-found.json': ['{"status":404}', 'application/json'],
	'/agent-view.json': ['{"mode":"agent"}', 'application/json'],
	'/index.md': ['# Home', 'text/plain'],
	'/.well-known/api-catalog': ['{"linkset":[]}', 'application/octet-stream'],
};
const env = {
	ASSETS: {
		async fetch(request) {
			const value = files[new URL(request.url).pathname];
			return new Response(value?.[0] || 'not found', {
				status: value ? 200 : 404,
				headers: { 'Content-Type': value?.[1] || 'text/plain' },
			});
		},
	},
};
const request = (path, options) => new Request(new URL(path, 'https://example.workers.dev'), options);

test('Cloudflare alternates HTML, agent JSON, and Markdown without sharing response caches', async () => {
	for (const [path, options, type, body] of [
		['/', {}, 'text/html', '<html>Home'],
		['/', { headers: { Accept: 'text/markdown' } }, 'text/markdown', '# Home'],
		['/?mode=agent', { headers: { Accept: 'text/markdown' } }, 'application/json', '{"mode":"agent"}'],
		['/?mode=human', {}, 'text/html', '<html>Home'],
		['/', { headers: { 'User-Agent': 'ChatGPT-User' } }, 'text/markdown', '# Home'],
		['/', {}, 'text/html', '<html>Home'],
	]) {
		const response = await fetch(request(path, options), env);
		assert.equal(response.status, 200);
		assert.ok(response.headers.get('content-type').startsWith(type));
		assert.ok((await response.text()).startsWith(body));
		assert.equal(response.headers.get('cloudflare-cdn-cache-control'), 'no-store');
		assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
	}
});

test('Cloudflare preserves public discovery headers and direct Markdown MIME types', async () => {
	assert.match((await fetch(request('/'), env)).headers.get('link'), /rel="api-catalog"/);
	const catalog = await fetch(request('/.well-known/api-catalog'), env);
	assert.match(catalog.headers.get('content-type'), /application\/linkset\+json; profile=/);
	assert.equal(catalog.headers.get('access-control-allow-origin'), '*');
	assert.match((await fetch(request('/index.md'), env)).headers.get('content-type'), /text\/markdown/);
	const api = await fetch(request('/api/posts.json', { headers: { Accept: 'text/markdown' } }), env);
	assert.match(api.headers.get('content-type'), /text\/markdown/);
	assert.equal(api.headers.get('access-control-allow-origin'), '*');
	assert.equal(api.headers.get('vary'), 'Accept, User-Agent');
});

test('Cloudflare gives unknown APIs structured errors and unknown pages representation-specific 404s', async () => {
	for (const [path, type] of [
		['/unknown', 'text/markdown'],
		['/api/unknown', 'application/problem+json'],
		['/_markdown/index.md', 'text/markdown'],
	]) {
		const response = await fetch(request(path, { headers: { Accept: 'text/markdown' } }), env);
		assert.equal(response.status, 404);
		assert.ok(response.headers.get('content-type').startsWith(type));
	}
	const response = await fetch(request('/unknown'), env);
	assert.equal(response.status, 404);
	assert.match(await response.text(), /<html>/);
});

test('Cloudflare handles HEAD, CORS preflight and unsupported methods', async () => {
	const head = await fetch(request('/', { method: 'HEAD', headers: { Accept: 'text/markdown' } }), env);
	assert.equal(head.status, 200);
	assert.equal(await head.text(), '');
	assert.match(head.headers.get('content-type'), /text\/markdown/);
	const preflight = await fetch(request('/api/posts.json', { method: 'OPTIONS' }), env);
	assert.equal(preflight.status, 204);
	assert.equal(preflight.headers.get('access-control-allow-origin'), '*');
	assert.equal((await fetch(request('/', { method: 'POST' }), env)).status, 405);
});

test('Cloudflare preserves host and exact legacy redirects', async () => {
	for (const [url, location] of [
		['https://www.lirantal.com/writing?a=1', 'https://lirantal.com/writing?a=1'],
		['https://example.workers.dev/speaking-events/', '/speaking/events'],
	]) {
		const response = await fetch(new Request(url), env);
		assert.equal(response.status, 308, url);
		assert.equal(response.headers.get('location'), location);
	}
	assert.equal((await fetch(request('/speaking-events-unknown'), env)).status, 404);
});

test('Cloudflare streams video ranges and rejects unsatisfiable ranges', async () => {
	let lastOptions;
	const metadata = { size: 10, httpEtag: '"video"', uploaded: new Date('2026-01-01'), writeHttpMetadata() {} };
	const localEnv = {
		...env,
		MEDIA: {
			async head() {
				return metadata;
			},
			async get(key, options) {
				lastOptions = options;
				assert.equal(key, 'video.mp4');
				return { ...metadata, range: { offset: 2, length: 3 }, body: new Uint8Array([2, 3, 4]) };
			},
		},
	};
	const response = await fetch(request('/video.mp4', { headers: { Range: 'bytes=2-4' } }), localEnv);
	assert.equal(lastOptions.range.get('range'), 'bytes=2-4');
	assert.equal(response.status, 206);
	assert.equal(response.headers.get('content-range'), 'bytes 2-4/10');
	assert.equal((await response.arrayBuffer()).byteLength, 3);
	for (const range of ['bytes=10-', 'bytes=4-2', 'bytes=-0', 'bytes=0-1,4-5']) {
		const invalid = await fetch(request('/video.mp4', { headers: { Range: range } }), localEnv);
		assert.equal(invalid.status, 416, range);
		assert.equal(invalid.headers.get('content-range'), 'bytes */10');
	}
	const head = await fetch(request('/video.mp4', { method: 'HEAD' }), localEnv);
	assert.equal(head.status, 200);
	assert.equal(head.headers.get('content-length'), '10');
	assert.equal(await head.text(), '');
});
