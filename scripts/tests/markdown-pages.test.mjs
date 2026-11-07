import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const exec = promisify(execFile);
const root = fileURLToPath(new URL('../../', import.meta.url));

test('postbuild emits heading-led twins for HTML, API pages, and llms indexes into both outputs', async () => {
	const fixture = await fs.mkdtemp(path.join(os.tmpdir(), 'markdown-pages-'));
	try {
		const write = async (name, content) => {
			const target = path.join(fixture, name);
			await fs.mkdir(path.dirname(target), { recursive: true });
			await fs.writeFile(target, content);
		};
		await fs.symlink(path.join(root, 'node_modules'), path.join(fixture, 'node_modules'), 'dir');
		await write(
			'scripts/generate-markdown-pages.mjs',
			await fs.readFile(path.join(root, 'scripts/generate-markdown-pages.mjs'))
		);
		await write(
			'scripts/legacy-speaking-redirects.mjs',
			await fs.readFile(path.join(root, 'scripts/legacy-speaking-redirects.mjs'))
		);
		await write('dist/index.html', '<title>Home</title><main><h1>Liran Tal</h1><p>Welcome</p></main>');
		await write('dist/speaking/events/index.html', '<title>Events</title><main>Events</main>');
		await write('dist/speaking/talks/example/index.html', '<title>Talk</title><main>Talk</main>');
		await write(
			'dist/blog/example/index.html',
			'<title>Example</title><link rel="canonical" href="https://lirantal.com/blog/example"><main><h2>Article</h2><p>Full text</p></main>'
		);
		const payload = { name: 'Posts', items: [{ title: 'Example' }], cursor: '0', nextCursor: '50' };
		await write('dist/api/posts.json', JSON.stringify(payload));
		await write('dist/api/posts/cursor/0.json', JSON.stringify(payload));
		await write('dist/api/posts/cursor/50.json', JSON.stringify({ ...payload, cursor: '50', nextCursor: null }));
		await write('dist/api/llms.txt', '# Public API\n\nRead-only resources.');
		await write('dist/speaking/llms.txt', 'Speaking resources.');
		await write('dist/_errors/api-not-found.json', '{"status":404}');
		const assetCacheRoute = {
			src: '^/_astro/(.*)$',
			headers: { 'cache-control': 'public, max-age=31536000, immutable' },
			continue: true,
		};
		await write(
			'.vercel/output/config.json',
			JSON.stringify({ version: 3, routes: [{ handle: 'filesystem' }, assetCacheRoute] })
		);
		await fs.mkdir(path.join(fixture, '.vercel/output/static'), { recursive: true });

		const generate = () => exec(process.execPath, [path.join(fixture, 'scripts/generate-markdown-pages.mjs')]);
		await generate();
		const twins = [
			'index.md',
			'blog/example.md',
			'api/posts.json.md',
			'api/posts/cursor/0.json.md',
			'api/posts/cursor/50.json.md',
			'api/llms.txt.md',
			'speaking/llms.txt.md',
		];
		const configPath = path.join(fixture, '.vercel/output/config.json');
		const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
		const cacheRoute = config.routes.find((route) => route.src === assetCacheRoute.src);
		assert.deepEqual(
			cacheRoute,
			{
				...assetCacheRoute,
				headers: { ...assetCacheRoute.headers, 'Cloudflare-CDN-Cache-Control': 'public, max-age=31536000, immutable' },
			},
			'postbuild must repair the adapter asset cache policy before filesystem handling'
		);
		assert.equal(config.routes.filter((route) => route.src === assetCacheRoute.src).length, 1);
		assert.ok(config.routes.indexOf(cacheRoute) < config.routes.findIndex((route) => route.handle === 'filesystem'));
		for (const [source, destination] of [
			['/speaking-events', '/speaking/events'],
			['/speaking-talks-example', '/speaking/talks/example'],
		]) {
			const redirect = config.routes.find((route) => route.status === 308 && new RegExp(route.src).test(source));
			assert.ok(redirect);
			assert.equal(redirect.headers.Location.replace('$1', source.match(new RegExp(redirect.src))[1]), destination);
			assert.ok(config.routes.indexOf(redirect) < config.routes.findIndex((route) => route.handle === 'filesystem'));
		}
		assert.ok(
			!config.routes.some((route) => route.status === 308 && new RegExp(route.src).test('/speaking-talks-unknown'))
		);
		for (const twin of twins) {
			const markdown = await fs.readFile(path.join(fixture, 'dist', twin), 'utf8');
			assert.match(markdown, /^# .+\n/);
			assert.equal(await fs.readFile(path.join(fixture, 'dist/_markdown', twin), 'utf8'), markdown);
			assert.equal(await fs.readFile(path.join(fixture, '.vercel/output/static', twin), 'utf8'), markdown);
			assert.equal(config.overrides[twin].contentType, 'text/markdown; charset=utf-8');
			const negotiation = config.routes.find((route) => route.dest === `/_markdown/${twin}`);
			assert.ok(negotiation);
			assert.ok(!Object.keys(negotiation.headers).some((key) => key.toLowerCase().includes('cache-control')));
			assert.equal(negotiation.headers.Vary, 'Accept');
			assert.ok(config.routes.indexOf(negotiation) < config.routes.findIndex((route) => route.handle === 'filesystem'));
		}
		const cursorMarkdown = await fs.readFile(path.join(fixture, 'dist/api/posts/cursor/0.json.md'), 'utf8');
		assert.deepEqual(JSON.parse(cursorMarkdown.match(/```json\n([\s\S]*?)\n```/)[1]), payload);
		assert.match(cursorMarkdown, /Canonical: https:\/\/lirantal.com\/api\/posts\/cursor\/0.json/);
		await assert.rejects(fs.access(path.join(fixture, 'dist/_errors/api-not-found.json.md')));
		await assert.rejects(fs.access(path.join(fixture, 'dist/api/posts/cursor/100.json.md')));
		await generate();
		assert.deepEqual(JSON.parse(await fs.readFile(configPath, 'utf8')), config, 'postbuild should be repeatable');
	} finally {
		await fs.rm(fixture, { recursive: true, force: true });
	}
});
