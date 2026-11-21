import assert from 'node:assert/strict';
import test from 'node:test';
import vercel from '../../vercel.json' with { type: 'json' };
import cloudflare from '../../cloudflare/http-policy.json' with { type: 'json' };
import { createHandler } from '../../cloudflare/handler.mjs';

const paths = ['/speaking/events/2026-06-01-ai-native-dev-2026', '/speaking/talks/example', '/blog/example'];

test('deployment headers allow third-party players on speaking and blog pages', async () => {
	for (const [target, policy] of [
		['Vercel', vercel],
		['Cloudflare', cloudflare],
	]) {
		for (const path of paths) {
			const headers = new Headers();
			for (const rule of policy.headers) {
				if (new RegExp(`^${rule.source}$`).test(path)) {
					for (const { key, value } of rule.headers) headers.set(key, value);
				}
			}
			assert.ok(
				[null, 'unsafe-none'].includes(headers.get('Cross-Origin-Embedder-Policy')),
				`${target}: ${path} must allow frames without their own COEP opt-in`
			);
			assert.equal(headers.get('Cross-Origin-Opener-Policy'), 'same-origin');
			assert.equal(headers.get('Cross-Origin-Resource-Policy'), 'cross-origin');
		}
	}
});

test('Cloudflare routed HTML permits third-party embeds', async () => {
	const fetch = createHandler({ markdown: {}, redirects: [], media: {}, policy: cloudflare });
	for (const path of paths) {
		const response = await fetch(new Request(`https://lirantal.com${path}`), {
			ASSETS: {
				fetch: async () => new Response('<html>Player page</html>', { headers: { 'Content-Type': 'text/html' } }),
			},
		});
		assert.equal(response.status, 200);
		assert.equal(response.headers.get('Cross-Origin-Embedder-Policy'), null);
		assert.equal(response.headers.get('Cross-Origin-Opener-Policy'), 'same-origin');
	}
});
