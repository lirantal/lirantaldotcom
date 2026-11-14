/* global document, window, innerWidth, scrollTo, getComputedStyle */
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
		// Playwright's route.fetch uses its own HTTP client and needs an explicit proxy.
		proxy: process.env.PLAYWRIGHT_PROXY_SERVER ? { server: process.env.PLAYWRIGHT_PROXY_SERVER } : undefined,
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

test('metadata-only pages exclude embed CSS while embedded articles retain it', async (t) => {
	for (const path of ['/', '/writing', '/blog/2019-10-04_jsconf-budapest-review']) {
		const page = await pageFor(t);
		assert.equal((await page.goto(base + path)).status(), 200);
		const css = await page.evaluate(async () => {
			const sheets = await Promise.all(
				[...document.querySelectorAll('link[rel="stylesheet"]')].map(async (link) => {
					const response = await fetch(link.href);
					if (!response.ok) throw new Error(`Stylesheet failed: ${link.href}`);
					return response.text();
				})
			);
			return sheets.join('\n');
		});
		assert.equal(css.includes('twitter-tweet'), path.startsWith('/blog/'), path);
		assert.equal(css.includes('lite-youtube'), path.startsWith('/blog/'), path);
		const cards = path.startsWith('/blog/') ? '.editorial-row h3 a' : '.forma-blog-card';
		assert.ok((await page.locator(cards).count()) > 0, 'Recent-post metadata still renders');
		if (path === '/') {
			const link = page.locator('a[href="/recognitions#milestones-heading"]');
			assert.ok((await link.getAttribute('aria-label')).includes((await link.innerText()).trim()));
		}
		await page.close();
	}
});

test('homepage blocking CSS stays within the shared stylesheet budget', async (t) => {
	const page = await pageFor(t);
	await page.goto(base);
	const bytes = await page.evaluate(async () => {
		const sheets = await Promise.all(
			[...document.querySelectorAll('link[rel="stylesheet"]')].map(async (link) => {
				const response = await fetch(link.href);
				if (!response.ok) throw new Error(`Stylesheet failed: ${link.href}`);
				return (await response.arrayBuffer()).byteLength;
			})
		);
		return sheets.reduce((total, size) => total + size, 0);
	});
	// The pre-optimization bundle was 157,725 bytes. Leave room for site styles
	// while catching accidental package-wide utility generation again.
	assert.ok(bytes > 0 && bytes < 140_000, `Homepage blocking CSS: ${bytes} bytes`);
});

test('search and filter controls retain form styling and work in both themes', async (t) => {
	for (const theme of ['light', 'dark']) {
		const page = await pageFor(t);
		await page.addInitScript((value) => localStorage.setItem('theme', value), theme);
		await page.goto(base + '/blog');
		const search = page.locator('.pagefind-ui__search-input');
		await search.fill('security');
		await page.locator('.pagefind-ui__result-link').first().waitFor();
		assert.notEqual(await search.evaluate((node) => getComputedStyle(node).outlineStyle), 'none');
		await page.goto(base + '/research/advisories');
		const severity = page.locator('#advisory-severity');
		assert.equal(await severity.evaluate((node) => getComputedStyle(node).appearance), 'none');
		await severity.selectOption('Critical');
		assert.ok((await page.locator('[data-advisory]:visible').count()) > 0);
		assert.equal(await page.locator('[data-advisory]:visible:not([data-severity="Critical"])').count(), 0);
		await page.locator('#advisory-query').fill('nonexistent-package-xyz');
		assert.equal(await page.locator('#advisory-empty').isVisible(), true);
		await page.locator('button[type="reset"]').click();
		assert.equal(await page.locator('#advisory-empty').isVisible(), false);
		await page.goto(base + '/speaking/events');
		const recording = page.locator('input[data-filter="video"]');
		await recording.check();
		assert.equal(await recording.isChecked(), true);
		assert.ok((await page.locator('[data-filter-item]:visible').count()) > 0);
		assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
		await page.close();
	}
});

test('homepage and writing page register one usable WebMCP search without eagerly fetching posts', async (t) => {
	for (const path of ['/', '/writing']) {
		const page = await pageFor(t);
		const indexRequests = [];
		page.on('request', (request) => {
			if (new URL(request.url()).pathname === '/api/posts.json') indexRequests.push(request.url());
		});
		await page.addInitScript(() => {
			window.__blogSearchTools = [];
			Object.defineProperty(document, 'modelContext', {
				configurable: true,
				value: {
					registerTool: (tool) => {
						window.__blogSearchTools.push(tool);
					},
				},
			});
		});
		assert.equal((await page.goto(base + path)).status(), 200);
		await page.waitForFunction(() => window.__blogSearchTools.length === 1);
		assert.equal(indexRequests.length, 0);
		const search = await page.evaluate(async () => {
			const tool = window.__blogSearchTools[0];
			return { name: tool.name, result: await tool.execute({ query: 'security' }) };
		});
		assert.equal(search.name, 'search_blog_posts');
		assert.ok(search.result.results.length > 0);
		assert.equal(indexRequests.length, 1);
		if (path === '/writing') {
			await page.locator('#blog-search-query').fill('security');
			await page.locator('#blog-agent-search button').click();
			await page.locator('#blog-search-results li').first().waitFor();
			assert.equal(indexRequests.length, 1, 'The form reuses the index fetched by the tool');
		}
		await page.close();
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

test('article covers choose a fitting source while preserving eager loading and layout', async (t) => {
	for (const [width, dpr, expected] of [
		[390, 1, 360],
		[390, 1.75, 640],
		[412, 1.75, 768],
		[1000, 1, 960],
		[1440, 1, 960],
	]) {
		const page = await pageFor(t, { viewport: { width, height: 900 }, deviceScaleFactor: dpr });
		await page.goto(base + plainPath);
		const cover = page.locator('.forma-article-cover');
		await cover.evaluate((img) => img.decode());
		const data = await cover.evaluate(async (img) => {
			const bitmap = await window.createImageBitmap(await (await fetch(img.currentSrc)).blob());
			const selectedWidth = bitmap.width;
			bitmap.close();
			return {
				selectedWidth,
				width: img.getBoundingClientRect().width,
				height: img.getBoundingClientRect().height,
				loading: img.loading,
				priority: img.fetchPriority,
				sizes: img.sizes,
				sourceSizes: [...img.closest('picture').querySelectorAll('source')].map((source) => source.sizes),
			};
		});
		assert.equal(data.selectedWidth, expected);
		assert.equal(data.width, Math.min(960, width - (width <= 760 ? 40 : width <= 1050 ? 56 : 80)));
		assert.equal(data.height, data.width / 2);
		assert.equal(data.loading, 'eager');
		assert.equal(data.priority, 'high');
		assert.ok(data.sourceSizes.every((sizes) => sizes === data.sizes));
		await page.close();
	}
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
