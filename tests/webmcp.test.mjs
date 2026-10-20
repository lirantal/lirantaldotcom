import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('../src/scripts/register-blog-search.js', import.meta.url), 'utf8');

async function load({ documentContext, navigatorContext, fetch = () => assert.fail('Unexpected fetch') } = {}) {
	const listeners = {};
	const warnings = [];
	vm.runInNewContext(source, {
		document: { modelContext: documentContext, querySelector: () => null },
		navigator: { modelContext: navigatorContext },
		window: {
			addEventListener: (name, handler) => {
				listeners[name] = handler;
			},
		},
		AbortController,
		fetch,
		console: { warn: (...args) => warnings.push(args) },
	});
	await new Promise((resolve) => setImmediate(resolve));
	return { listeners, warnings };
}

test('homepage registers without a form, prefers document, and executes metadata search', async () => {
	let tool;
	let options;
	let requests = 0;
	const post = {
		title: 'MCP tools',
		description: 'Agent integrations',
		category: 'Security',
		tags: ['node'],
		url: 'https://lirantal.com/blog/example',
		markdownUrl: 'https://lirantal.com/blog/example.md',
	};
	const { listeners, warnings } = await load({
		documentContext: {
			registerTool(value, config) {
				tool = value;
				options = config;
			},
		},
		navigatorContext: {
			registerTool() {
				assert.fail('Document API must take precedence');
			},
		},
		fetch: async (url, init) => {
			requests++;
			assert.equal(url, '/api/posts.json');
			assert.equal(init.headers.Accept, 'application/json');
			return { ok: true, json: async () => ({ items: [post, { title: 'Unrelated' }] }) };
		},
	});
	assert.equal(tool.name, 'search_blog_posts');
	assert.equal(requests, 0, 'Index is fetched only when a tool is called');
	assert.equal((await tool.execute({ query: 'MCP security node' })).results[0].markdownUrl, post.markdownUrl);
	assert.equal((await tool.execute({ query: 'missing' })).results.length, 0);
	assert.equal(requests, 1, 'Subsequent searches reuse the index');
	await assert.rejects(tool.execute({ query: ' ' }), /non-empty string/);
	assert.equal(warnings.length, 0, 'Synchronous registration must succeed');
	listeners.pagehide({ persisted: true });
	assert.equal(options.signal.aborted, false);
	listeners.pagehide({ persisted: false });
	assert.equal(options.signal.aborted, true);
});

test('navigator is a trailing fallback for absent or incomplete document APIs', async () => {
	for (const documentContext of [undefined, {}]) {
		let registered = false;
		await load({
			documentContext,
			navigatorContext: {
				registerTool() {
					registered = true;
					return Promise.resolve();
				},
			},
		});
		assert.equal(registered, true);
	}
});

test('unsupported browsers do nothing and registration failures are handled', async () => {
	assert.equal((await load()).warnings.length, 0);
	for (const registerTool of [
		() => {
			throw new Error('Unavailable');
		},
		() => Promise.reject(new Error('Unavailable')),
	]) {
		assert.equal((await load({ documentContext: { registerTool } })).warnings.length, 1);
	}
});

test('tool propagates index failures and cancellation', async () => {
	for (const failure of ['http', 'abort']) {
		let tool;
		const controller = new AbortController();
		controller.abort();
		await load({
			documentContext: {
				registerTool(value) {
					tool = value;
				},
			},
			fetch: async (_url, { signal }) => {
				if (failure === 'abort') signal.throwIfAborted();
				return { ok: false };
			},
		});
		await assert.rejects(
			tool.execute({ query: 'security' }, { signal: controller.signal }),
			failure === 'abort' ? { name: 'AbortError' } : /could not be loaded/
		);
	}
});
