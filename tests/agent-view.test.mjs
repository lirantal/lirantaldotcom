import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const readJson = async (file) => JSON.parse(await fs.readFile(file, 'utf8'));

test('agent view describes public capabilities using documented API endpoints', async () => {
	const view = await readJson(path.join(root, 'public/agent-view.json'));
	const openapi = await readJson(path.join(root, 'public/openapi.json'));
	assert.equal(view.mode, 'agent');
	assert.equal(new URL(view.agentModeUrl).searchParams.get('mode'), 'agent');
	assert.equal(view.access.authentication, 'none');
	assert.equal(view.access.apiKeyRequired, false);
	assert.equal(view.access.readOnly, true);
	assert.equal(view.access.mcpServer, null);
	assert.deepEqual(view.access.methods, ['GET', 'HEAD']);
	assert.ok(view.capabilities.length > 0);
	for (const capability of view.capabilities) {
		assert.equal(capability.method, 'GET');
		assert.ok(capability.description);
		if (capability.url) {
			const url = new URL(capability.url);
			assert.equal(url.origin, view.url);
			const apiPath = url.pathname.replace('/cursor/0.json', '/cursor/{cursor}.json');
			assert.ok(openapi.paths[apiPath].get.responses['200'].content[capability.responseType]);
		} else {
			assert.equal(capability.urlSource, 'items[].markdownUrl');
		}
	}
});

test('production agent query precedes HTML and Markdown routing and survives repeated postbuilds', async (t) => {
	const fixture = await fs.mkdtemp(path.join(os.tmpdir(), 'agent-view-'));
	t.after(() => fs.rm(fixture, { recursive: true, force: true }));
	await fs.mkdir(path.join(fixture, 'scripts'));
	await fs.mkdir(path.join(fixture, 'dist'));
	await fs.mkdir(path.join(fixture, '.vercel/output/static'), { recursive: true });
	await fs.symlink(path.join(root, 'node_modules'), path.join(fixture, 'node_modules'), 'dir');
	await fs.copyFile(
		path.join(root, 'scripts/generate-markdown-pages.mjs'),
		path.join(fixture, 'scripts/generate-markdown-pages.mjs')
	);
	await fs.copyFile(
		path.join(root, 'scripts/legacy-speaking-redirects.mjs'),
		path.join(fixture, 'scripts/legacy-speaking-redirects.mjs')
	);
	await fs.writeFile(path.join(fixture, 'dist/index.html'), '<html><main><h1>Liran Tal</h1></main></html>');
	const configPath = path.join(fixture, '.vercel/output/config.json');
	await fs.writeFile(configPath, JSON.stringify({ version: 3, routes: [{ handle: 'filesystem' }] }));

	for (let run = 0; run < 2; run++) {
		execFileSync(process.execPath, [path.join(fixture, 'scripts/generate-markdown-pages.mjs')]);
		const { routes } = await readJson(configPath);
		const agentRoutes = routes.filter((route) => route.dest === '/agent-view.json');
		assert.equal(agentRoutes.length, 1);
		const agentRoute = agentRoutes[0];
		assert.equal(agentRoute.headers['Content-Type'], 'application/json; charset=utf-8');
		assert.equal(agentRoute.headers['Access-Control-Allow-Origin'], '*');
		assert.deepEqual(agentRoute.methods, ['GET', 'HEAD']);
		assert.deepEqual(agentRoute.has, [{ type: 'query', key: 'mode', value: 'agent' }]);
		assert.ok(new RegExp(agentRoute.src).test('/'));
		assert.ok(!new RegExp(agentRoute.src).test('/writing'));
		assert.ok(routes.indexOf(agentRoute) < routes.findIndex((route) => route.handle === 'filesystem'));
		for (const route of routes.filter((route) => route.dest === '/_markdown/index.md')) {
			assert.ok(routes.indexOf(agentRoute) < routes.indexOf(route));
		}
		// Only the explicit query enables agent mode; ordinary homepage requests
		// fall through to the existing HTML/Markdown handlers.
		for (const query of ['', '?mode=human', '?mode=agentic']) {
			assert.notEqual(new URL(`https://lirantal.com/${query}`).searchParams.get('mode'), agentRoute.has[0].value);
		}
	}
});
