import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

const script = new URL('../check-internal-links.mjs', import.meta.url).pathname;

async function check(t, files) {
	const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'internal-links-'));
	t.after(() => fs.rm(directory, { recursive: true, force: true }));
	for (const [file, content] of Object.entries(files)) {
		const target = path.join(directory, file);
		await fs.mkdir(path.dirname(target), { recursive: true });
		await fs.writeFile(target, content);
	}
	return spawnSync(process.execPath, [script, directory], { encoding: 'utf8' });
}

test('rejects a canonical URL flattened into a nonexistent route', async (t) => {
	const result = await check(t, {
		'speaking/talks/example/index.html': '<link rel="canonical" href="https://lirantal.com/speaking-talks-example">',
	});
	assert.equal(result.status, 1);
	assert.match(result.stderr, /speaking-talks-example/);
});

test('resolves nested pages, relative assets, Markdown twins, fragments, and redirects', async (t) => {
	const result = await check(t, {
		'speaking/talks/example/index.html': `
			<link rel="canonical" href="https://lirantal.com/speaking/talks/example">
			<link rel="alternate" href="/speaking/talks/example.md">
			<a href="#details">Details</a><img src="../../../portrait.png">
			<a href="/games-chatgpt-chat-meme-generator">Game</a>
			<a href="https://example.org/external">External</a>`,
		'speaking/talks/example.md': '# Example',
		'portrait.png': '',
	});
	assert.equal(result.status, 0, result.stderr);
});

test('rejects missing postbuild assets and malformed URLs', async (t) => {
	const result = await check(t, {
		'index.html': '<script src="/pagefind/pagefind-ui.js"></script><a href="http://www.e107.org%5D(">Broken</a>',
	});
	assert.equal(result.status, 1);
	assert.match(result.stderr, /pagefind-ui\.js/);
	assert.match(result.stderr, /invalid URL/);
});

test('requires email obfuscation opt-out around email links and code examples', async (t) => {
	const content = '<a href="mailto:author@example.com">Contact</a><pre>admin@im.example.com</pre>';
	const unprotected = await check(t, { 'index.html': `<body>${content}</body>` });
	assert.equal(unprotected.status, 1);
	assert.match(unprotected.stderr, /outside Cloudflare email_off markers/);
	const protectedResult = await check(t, {
		'index.html': `<body><!--email_off-->${content}<!--/email_off--></body>`,
	});
	assert.equal(protectedResult.status, 0, protectedResult.stderr);
});
