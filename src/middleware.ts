import { defineMiddleware } from 'astro:middleware';
// Browser build avoids Node-only @mixmark-io/domino (required for Vercel Edge).
import TurndownService from 'turndown/lib/turndown.browser.es.js';

/** Max HTML bytes before skipping conversion (aligns with Cloudflare Markdown for Agents). */
const MAX_HTML_BYTES = 2_097_152;

const turndown = new TurndownService({
	headingStyle: 'atx',
	codeBlockStyle: 'fenced',
});

function parseAcceptTypes(accept: string | null): Map<string, number> {
	const weights = new Map<string, number>();
	if (!accept) return weights;
	for (const segment of accept.split(',')) {
		const parts = segment
			.trim()
			.split(';')
			.map((s) => s.trim());
		const type = parts[0]?.toLowerCase();
		if (!type) continue;
		let q = 1;
		for (let i = 1; i < parts.length; i++) {
			const [key, rawVal] = parts[i].split('=').map((s) => s.trim());
			if (key === 'q' && rawVal !== undefined) {
				const n = parseFloat(rawVal);
				if (!Number.isNaN(n)) q = n;
			}
		}
		weights.set(type, Math.max(weights.get(type) ?? 0, q));
	}
	return weights;
}

function prefersMarkdown(accept: string | null): boolean {
	const w = parseAcceptTypes(accept);
	const mdQ = w.get('text/markdown');
	if (mdQ === undefined || mdQ <= 0) return false;
	const htmlQ = Math.max(w.get('text/html') ?? 0, w.get('application/xhtml+xml') ?? 0);
	return mdQ >= htmlQ;
}

function extractTitle(html: string): string | null {
	const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
	if (!m) return null;
	const text = m[1].replace(/\s+/g, ' ').trim();
	return text || null;
}

function yamlTitleBlock(title: string): string {
	return `---\ntitle: ${JSON.stringify(title)}\n---\n\n`;
}

function estimateMarkdownTokens(markdown: string): number {
	if (!markdown) return 0;
	return Math.max(1, Math.ceil(markdown.length / 4));
}

function buildMarkdownResponse(
	init: { status: number; statusText?: string; markdown: string; tokenEstimate: number },
	isHead: boolean,
): Response {
	const headers = new Headers();
	headers.set('Content-Type', 'text/markdown; charset=utf-8');
	headers.set('Vary', 'Accept');
	headers.set('Cache-Control', 'private, max-age=0, must-revalidate');
	headers.set('CDN-Cache-Control', 'private');
	headers.set('x-markdown-tokens', String(init.tokenEstimate));
	const byteLength = new TextEncoder().encode(init.markdown).byteLength;
	headers.set('Content-Length', String(byteLength));
	return new Response(isHead ? null : init.markdown, {
		status: init.status,
		statusText: init.statusText,
		headers,
	});
}

/** Skip negotiation for hashed bundles, search UI, images, etc. */
function shouldSkipPath(pathname: string): boolean {
	if (pathname.startsWith('/_astro/')) return true;
	if (pathname.startsWith('/_vercel/')) return true;
	if (pathname.startsWith('/pagefind/')) return true;
	if (pathname === '/favicon.ico' || pathname === '/robots.txt') return true;
	if (pathname === '/api/vercel-ssr-build-flag') return true;
	return /\.(?:ico|png|jpg|jpeg|gif|webp|avif|svg|css|js|mjs|map|woff2?|ttf|eot|json|xml|txt|pdf|webmanifest)$/i.test(
		pathname,
	);
}

export const onRequest = defineMiddleware(async (context, next) => {
	const request = context.request;
	const url = new URL(request.url);

	if (shouldSkipPath(url.pathname)) {
		return next();
	}

	const method = request.method;
	if (method !== 'GET' && method !== 'HEAD') {
		return next();
	}

	if (!prefersMarkdown(request.headers.get('accept'))) {
		return next();
	}

	const internalHeaders = new Headers(request.headers);
	internalHeaders.set('accept', 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8');

	const htmlRes = await fetch(request.url, {
		method: 'GET',
		headers: internalHeaders,
		redirect: 'follow',
		cache: 'no-store',
	});

	if (!htmlRes.ok) {
		return htmlRes;
	}

	const contentType = htmlRes.headers.get('content-type') || '';
	if (!contentType.includes('text/html')) {
		return htmlRes;
	}

	const htmlText = await htmlRes.text();
	if (htmlText.length > MAX_HTML_BYTES) {
		return next();
	}

	let markdown: string;
	try {
		const core = turndown.turndown(htmlText);
		const title = extractTitle(htmlText);
		markdown = title ? `${yamlTitleBlock(title)}${core}` : core;
	} catch {
		const title = extractTitle(htmlText);
		markdown = title
			? `${yamlTitleBlock(title)}_(HTML could not be converted to Markdown on this edge runtime.)_\n`
			: '_HTML could not be converted to Markdown on this edge runtime._\n';
	}

	const tokens = estimateMarkdownTokens(markdown);
	return buildMarkdownResponse(
		{
			status: htmlRes.status,
			statusText: htmlRes.statusText,
			markdown,
			tokenEstimate: tokens,
		},
		method === 'HEAD',
	);
});
