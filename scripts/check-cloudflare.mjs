import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

// Runs against cf dev or the actual Cloudflare preview; no authentication/token in URLs.
const base = process.argv.slice(2).find((value) => !value.startsWith('--')) || 'http://127.0.0.1:8787';
const manifest = JSON.parse(
	await fs.readFile(new URL('../cloudflare/.cloudflare/routes.json', import.meta.url), 'utf8')
);
const media = JSON.parse(await fs.readFile(new URL('../cloudflare/.cloudflare/media.json', import.meta.url), 'utf8'));
async function get(path, options = {}) {
	return fetch(new URL(path, base), { redirect: 'manual', ...options });
}
const paths = [
	'/',
	'/writing',
	'/speaking',
	'/research',
	'/open-source',
	'/api/posts.json',
	'/api/posts/cursor/0.json',
];
for (const path of paths) {
	// Alternating representations catches cache contamination at a shared URL.
	for (const accept of ['text/html', 'text/markdown', 'text/html', 'text/markdown']) {
		const response = await get(path, { headers: { Accept: accept } });
		assert.equal(response.status, 200, `${path} ${accept}`);
		assert.match(response.headers.get('vary') || '', /Accept/);
		assert.match(response.headers.get('vary') || '', /User-Agent/i);
		assert.equal(response.headers.get('cloudflare-cdn-cache-control'), 'no-store');
		if (accept === 'text/markdown') {
			assert.match(response.headers.get('content-type'), /text\/markdown/);
			assert.match(await response.text(), /^# /);
		} else if (path.startsWith('/api/')) await response.json();
		else assert.match(await response.text(), /<!doctype html>/i);
	}
}
const agent = await get('/?mode=agent', { headers: { Accept: 'text/markdown' } });
assert.equal((await agent.json()).mode, 'agent');
assert.equal(agent.headers.get('cache-control'), 'no-store');
for (const query of ['/?mode=human', '/?mode=agentic', '/']) {
	assert.match((await get(query)).headers.get('content-type'), /text\/html/);
}
assert.ok((await get('/')).headers.get('link').includes('rel="api-catalog"'));
const catalog = await get('/.well-known/api-catalog');
assert.match(catalog.headers.get('content-type'), /application\/linkset\+json/);
assert.ok(Array.isArray((await catalog.json()).linkset));
assert.equal((await get('/.well-known/ai-catalog.json')).headers.get('access-control-allow-origin'), '*');
assert.match((await get('/openapi.json')).headers.get('content-type'), /application\/vnd.oai.openapi\+json/);
assert.match(await (await get('/robots.txt')).text(), /Content-Signal: ai-train=no, search=yes, ai-input=yes/);
for (const path of ['/index.md', '/api/posts.json.md', '/skills/lirantal-blog-research/SKILL.md']) {
	assert.match((await get(path)).headers.get('content-type'), /text\/markdown/);
}
for (const path of [
	'/pagefind/pagefind-ui.js',
	'/pagefind/pagefind-ui.css',
	'/rss.xml',
	'/sitemap-index.xml',
	'/health.json',
]) {
	assert.equal((await get(path)).status, 200, path);
}
const post = Object.keys(manifest.markdown).find((path) => path.startsWith('/blog/') && !/\/\d+$/.test(path));
assert.match(
	(await get(post, { headers: { 'User-Agent': 'ChatGPT-User' } })).headers.get('content-type'),
	/text\/markdown/
);
const head = await get(post, { method: 'HEAD', headers: { Accept: 'text/markdown' } });
assert.equal(head.status, 200);
assert.equal(await head.text(), '');
const plain404 = await get('/this-page-does-not-exist');
assert.equal(plain404.status, 404);
assert.match(plain404.headers.get('content-type'), /text\/html/);
const md404 = await get('/this-page-does-not-exist', { headers: { Accept: 'text/markdown' } });
assert.equal(md404.status, 404);
assert.match(await md404.text(), /^# Page not found/);
const api404 = await get('/api/not-real', { headers: { Accept: 'text/markdown' } });
assert.equal(api404.status, 404);
assert.match(api404.headers.get('content-type'), /application\/problem\+json/);
await api404.json();
const redirect = await get('/speaking-events');
assert.equal(redirect.status, 308);
assert.equal(new URL(redirect.headers.get('location'), base).pathname, '/speaking/events');
assert.equal((await get('/speaking-talks-this-is-not-a-published-talk')).status, 404);
assert.equal((await get('/games-chatgpt-chat-meme-generator')).status, 308);
for (const [path, file] of Object.entries(media)) {
	const response = await get(path, { headers: { Range: 'bytes=0-15' } });
	assert.equal(response.status, 206, path);
	assert.equal(response.headers.get('content-range'), `bytes 0-15/${file.size}`);
	assert.equal((await response.arrayBuffer()).byteLength, 16);
	const head = await get(path, { method: 'HEAD' });
	assert.equal(head.status, 200);
	assert.equal(Number(head.headers.get('content-length')), file.size);
}
console.log(
	`cloudflare: request checks passed against ${base}; ${Object.keys(media).length} videos support byte ranges`
);

if (process.argv.includes('--all')) {
	const routes = Object.keys(manifest.markdown);
	for (let index = 0; index < routes.length; index += 12) {
		await Promise.all(
			routes.slice(index, index + 12).map(async (path) => {
				for (const accept of ['text/html', 'text/markdown']) {
					const response = await get(path, { method: 'HEAD', headers: { Accept: accept } });
					assert.equal(response.status, 200, `${path} ${accept}`);
					if (accept === 'text/markdown') assert.match(response.headers.get('content-type'), /text\/markdown/);
				}
			})
		);
	}
	console.log(`cloudflare: all ${routes.length} negotiated resource routes passed HTML/JSON and Markdown HEAD checks`);
}
