/* global document, window, innerWidth, scrollTo */
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { chromium } from 'playwright';

// Run against a completed production build, or the PR's Vercel preview. The
// caller owns the server; static serving cannot verify Vercel cache/negotiation.
const base = process.env.PERFORMANCE_BASE_URL || 'http://127.0.0.1:4321';
const diagramPath = '/blog/practical-second-brain-llm-markdown-knowledge-graph';
const plainPath = '/blog/self-host-hermes-agent-matrix-e2ee-proxmox';
let browser;

before(async () => {
	browser = await chromium.launch({
		executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
		args: ['--no-sandbox'],
	});
});
after(async () => browser?.close());

async function pageFor(t, options = {}) {
	const context = await browser.newContext({ viewport: { width: 390, height: 844 }, ...options });
	t.after(() => context.close());
	return context.newPage();
}

const mermaidRequests = (page) => {
	const urls = [];
	page.on('request', (request) => {
		if (/\/mermaid\.core[^/]*\.js/.test(request.url())) urls.push(request.url());
	});
	return urls;
};

test('portrait preserves responsive geometry, priority, and themes', async (t) => {
	for (const width of [390, 1000, 1440]) {
		for (const theme of ['light', 'dark']) {
			const page = await pageFor(t, { viewport: { width, height: 900 }, deviceScaleFactor: 1.75 });
			await page.addInitScript((value) => localStorage.setItem('theme', value), theme);
			assert.equal((await page.goto(base)).status(), 200);
			await page.locator('.refined-portrait').evaluate((img) => img.decode());
			const data = await page.locator('.refined-portrait').evaluate((img) => ({
				width: img.getBoundingClientRect().width,
				height: img.getBoundingClientRect().height,
				src: img.currentSrc,
				loading: img.loading,
				priority: img.fetchPriority,
				dark: document.documentElement.classList.contains('dark'),
				overflow: document.documentElement.scrollWidth > innerWidth,
			}));
			assert.equal(data.width, width <= 760 ? 220 : width <= 1050 ? 280 : 320);
			assert.equal(data.height, data.width);
			assert.ok(data.src.endsWith('.avif'));
			assert.equal(data.loading, 'eager');
			assert.equal(data.priority, 'high');
			assert.equal(data.dark, theme === 'dark');
			assert.equal(data.overflow, false);
			await page.close();
		}
	}
});

test('Mermaid stays off the initial load and renders near the viewport in both themes', async (t) => {
	const page = await pageFor(t);
	const requests = mermaidRequests(page);
	assert.equal((await page.goto(base + diagramPath)).status(), 200);
	await page.waitForTimeout(500);
	assert.equal(requests.length, 0);
	assert.equal(await page.locator('[data-mermaid-host]').count(), 0);
	const source = page.locator('pre:has(code.language-mermaid)').first();
	assert.ok((await source.textContent()).length > 0);
	await source.scrollIntoViewIfNeeded();
	await page.locator('[data-mermaid-host] svg').first().waitFor();
	assert.equal(requests.length, 1);
	const host = page.locator('[data-mermaid-host]').first();
	const originalId = await host.locator('svg').getAttribute('id');
	const originalFill = await host
		.locator('.node rect')
		.first()
		.evaluate((rect) => window.getComputedStyle(rect).fill);
	await page.locator('[data-aw-toggle-color-scheme]').first().click();
	await host.scrollIntoViewIfNeeded();
	await page.waitForFunction((id) => {
		const svg = document.querySelector('[data-mermaid-host] svg');
		return document.documentElement.classList.contains('dark') && svg?.id !== id;
	}, originalId);
	assert.equal(requests.length, 1);
	assert.notEqual(
		await host
			.locator('.node rect')
			.first()
			.evaluate((rect) => window.getComputedStyle(rect).fill),
		originalFill
	);
	assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
});

test('ordinary articles never load Mermaid', async (t) => {
	const page = await pageFor(t);
	const requests = mermaidRequests(page);
	assert.equal((await page.goto(base + plainPath)).status(), 200);
	await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
	await page.waitForTimeout(500);
	assert.equal(requests.length, 0);
});

test('a failed Mermaid download preserves readable diagram source', async (t) => {
	const page = await pageFor(t);
	await page.route('**/mermaid.core*.js', (route) => route.abort());
	await page.goto(base + diagramPath);
	const source = page.locator('pre:has(code.language-mermaid)').first();
	const text = await source.textContent();
	const warning = page.waitForEvent('console', {
		predicate: (message) => message.text().includes('keeping its readable fallback'),
	});
	await source.scrollIntoViewIfNeeded();
	await warning;
	assert.equal(await source.textContent(), text);
	assert.ok(await source.isVisible());
});

test('missing IntersectionObserver falls back to sequential diagram rendering', async (t) => {
	const page = await pageFor(t);
	await page.addInitScript(() => {
		delete window.IntersectionObserver;
	});
	await page.goto(base + diagramPath);
	await page.locator('[data-mermaid-host] svg').first().waitFor();
});

test('an invalid diagram keeps its source and does not stop later diagrams', async (t) => {
	const page = await pageFor(t);
	await page.route('**/blog/practical-second-brain-llm-markdown-knowledge-graph*', async (route) => {
		const response = await route.fetch();
		const html = await response.text();
		const body = html.replace(/(<code class="language-mermaid">)[\s\S]*?(<\/code>)/, '$1invalid diagram syntax$2');
		assert.notEqual(body, html);
		await route.fulfill({ response, body });
	});
	await page.goto(base + diagramPath);
	const source = page.locator('pre:has(code.language-mermaid)').first();
	const warning = page.waitForEvent('console', {
		predicate: (message) => message.text().includes('keeping its readable fallback'),
	});
	await source.scrollIntoViewIfNeeded();
	await warning;
	assert.match(await source.textContent(), /invalid diagram syntax/);
	assert.ok(await source.isVisible());
	await page.locator('pre:has(code.language-mermaid)').nth(1).scrollIntoViewIfNeeded();
	await page.locator('[data-mermaid-host] svg').first().waitFor();
});

test('a theme change during a delayed Mermaid import uses the final theme', async (t) => {
	const page = await pageFor(t);
	await page.route('**/mermaid.core*.js', async (route) => {
		await new Promise((resolve) => setTimeout(resolve, 300));
		await route.continue();
	});
	await page.goto(base + diagramPath);
	const loading = page.waitForRequest((request) => /\/mermaid\.core[^/]*\.js/.test(request.url()));
	await page.locator('pre:has(code.language-mermaid)').first().scrollIntoViewIfNeeded();
	await loading;
	await page.evaluate(() => document.documentElement.classList.add('dark'));
	await page.locator('[data-mermaid-host] svg').first().waitFor();
	assert.equal(await page.evaluate(() => document.documentElement.classList.contains('dark')), true);
	assert.ok(await page.locator('[data-mermaid-host] svg').first().isVisible());
});
