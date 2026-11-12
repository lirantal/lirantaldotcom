const aiCrawler =
	/GPTBot|ClaudeBot|ChatGPT-User|PerplexityBot|Google-Extended|Applebot-Extended|ora-agent|DeepSeekBot/i;
const markdownType = 'text/markdown; charset=utf-8';

export function createHandler({ markdown, redirects, media, policy, notFoundTokens = 0 }) {
	const headerRules = policy.headers.map((rule) => ({ ...rule, pattern: new RegExp(`^${rule.source}$`) }));
	const legacyRedirects = redirects.map((rule) => ({ ...rule, pattern: new RegExp(rule.src) }));
	return async function fetch(request, env) {
		const url = new URL(request.url);
		const pathname = url.pathname;
		const route = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
		const isRead = request.method === 'GET' || request.method === 'HEAD';
		const wantsMarkdown =
			/text\/markdown/i.test(request.headers.get('Accept') || '') ||
			aiCrawler.test(request.headers.get('User-Agent') || '');
		const preview = env.IS_PREVIEW === 'true' || url.hostname.endsWith('.workers.dev');

		function finish(response, overrides = {}) {
			const headers = new Headers(response.headers);
			for (const rule of headerRules) {
				if (rule.pattern.test(pathname)) for (const { key, value } of rule.headers) headers.set(key, value);
			}
			for (const [key, value] of Object.entries(overrides)) headers.set(key, value);
			if (preview) headers.set('X-Robots-Tag', 'noindex, nofollow');
			// Shared edge caches must never mix HTML, Markdown or query-selected JSON.
			// ASSETS caches the source files independently; this only disables caching of the routed response.
			headers.set('Cloudflare-CDN-Cache-Control', 'no-store');
			headers.set('CDN-Cache-Control', 'no-store');
			if (!headers.has('Cache-Control')) headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
			return new Response(request.method === 'HEAD' ? null : response.body, {
				status: response.status,
				statusText: response.statusText,
				headers,
			});
		}

		function redirect(destination, status = 308) {
			return finish(new Response(null, { status, headers: { Location: destination } }));
		}

		async function asset(destination, headers = {}, status) {
			const target = new URL(destination, url);
			target.search = '';
			const response = await env.ASSETS.fetch(
				new Request(target, {
					method: request.method,
					headers: request.headers,
				})
			);
			const result = status ? new Response(response.body, { status, headers: response.headers }) : response;
			return finish(result, headers);
		}

		// These host-specific redirects must precede page negotiation and canonicalization.
		for (const rule of policy.redirects) {
			if (rule.has?.some(({ type, value }) => type === 'host' && url.hostname !== value)) continue;
			const matches = rule.source.endsWith('/:path*')
				? route === rule.source.slice(0, -7) || route.startsWith(`${rule.source.slice(0, -7)}/`)
				: route === rule.source;
			if (matches) return redirect(rule.destination);
		}
		if (url.hostname === 'www.lirantal.com') return redirect(`https://lirantal.com${pathname}${url.search}`);
		for (const rule of legacyRedirects) {
			if (rule.pattern.test(pathname)) return redirect(pathname.replace(rule.pattern, rule.headers.Location));
		}
		if (!isRead) {
			if (
				request.method === 'OPTIONS' &&
				(route.startsWith('/api/') ||
					route.startsWith('/.well-known/') ||
					route === '/openapi.json' ||
					route.startsWith('/skills/'))
			) {
				return finish(new Response(null, { status: 204 }), {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
				});
			}
			return finish(new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD, OPTIONS' } }));
		}
		if (route === '/' && url.searchParams.get('mode') === 'agent') {
			return asset('/agent-view.json', {
				'Content-Type': 'application/json; charset=utf-8',
				'Cache-Control': 'no-store',
				'Access-Control-Allow-Origin': '*',
			});
		}
		if (Object.hasOwn(media, pathname)) return serveMedia(request, env, media[pathname], finish);
		// These are implementation files, not public resources.
		if (route.startsWith('/_markdown/') || route.startsWith('/_errors/')) return notFound();
		if (Object.hasOwn(markdown, route)) {
			if (wantsMarkdown)
				return asset(markdown[route].destination, {
					'Content-Type': markdownType,
					Vary: 'Accept, User-Agent',
					'x-markdown-tokens': String(markdown[route].tokens),
					'Cache-Control': 'public, max-age=0, must-revalidate',
				});
			const response = await asset(pathname, { Vary: 'Accept, User-Agent' });
			return response;
		}
		const response = await env.ASSETS.fetch(request);
		if (response.status !== 404)
			return finish(response, pathname.endsWith('.md') ? { 'Content-Type': markdownType } : {});
		return notFound();

		async function notFound() {
			if (route.startsWith('/api/'))
				return asset(
					'/_errors/api-not-found.json',
					{
						'Content-Type': 'application/problem+json; charset=utf-8',
						'Access-Control-Allow-Origin': '*',
						'Cache-Control': 'no-store',
					},
					404
				);
			if (wantsMarkdown)
				return asset(
					'/_markdown/404.md',
					{
						'Content-Type': markdownType,
						Vary: 'Accept, User-Agent',
						'Cache-Control': 'no-store',
						'x-markdown-tokens': String(notFoundTokens),
					},
					404
				);
			return asset('/404', { Vary: 'Accept, User-Agent', 'Cache-Control': 'no-store' }, 404);
		}
	};
}

async function serveMedia(request, env, file, finish) {
	const headers = new Headers({
		'Content-Type': file.contentType,
		'Accept-Ranges': 'bytes',
		'Cache-Control': 'public, max-age=3600',
	});
	if (!env.MEDIA) return finish(new Response('Media storage unavailable', { status: 503 }));
	const options = { onlyIf: request.headers };
	// If-Range requires a strong validator match before returning a partial body.
	let range = request.headers.get('Range');
	if (range && request.headers.has('If-Range')) {
		const metadata = await env.MEDIA.head(file.key);
		const validator = request.headers.get('If-Range');
		if (
			!metadata ||
			(validator !== metadata.httpEtag &&
				Date.parse(validator) < Math.floor(metadata.uploaded.getTime() / 1000) * 1000) ||
			(!validator.startsWith('"') && !Number.isFinite(Date.parse(validator)))
		)
			range = null;
		if (validator.startsWith('"') && validator !== metadata?.httpEtag) range = null;
	}
	if (range) {
		// A single byte range covers browser media playback; reject malformed/multipart ranges.
		const match = /^bytes=(\d*)-(\d*)$/.exec(range);
		const start = match?.[1] ? Number(match[1]) : null;
		const end = match?.[2] ? Number(match[2]) : null;
		if (
			!match ||
			(start === null && end === null) ||
			start >= file.size ||
			(start !== null && end !== null && start > end) ||
			(start === null && end === 0)
		) {
			headers.set('Content-Range', `bytes */${file.size}`);
			return finish(new Response(null, { status: 416, headers }));
		}
		options.range = new Headers({ Range: range });
	}
	const object = request.method === 'HEAD' ? await env.MEDIA.head(file.key) : await env.MEDIA.get(file.key, options);
	if (!object) return finish(new Response('Media not found', { status: 404 }));
	object.writeHttpMetadata(headers);
	// Range support and validators come from R2 rather than buffering videos in the Worker.
	headers.set('ETag', object.httpEtag);
	headers.set('Last-Modified', object.uploaded.toUTCString());
	if (request.method !== 'HEAD' && !('body' in object)) {
		const failedMatch = request.headers.has('If-Match') || request.headers.has('If-Unmodified-Since');
		return finish(new Response(null, { status: failedMatch ? 412 : 304, headers }));
	}
	let status = 200;
	if (object.range && request.method !== 'HEAD') {
		const offset = object.range.offset ?? Math.max(0, object.size - object.range.suffix);
		const length = object.range.length ?? Math.min(object.range.suffix, object.size);
		headers.set('Content-Range', `bytes ${offset}-${offset + length - 1}/${object.size}`);
		headers.set('Content-Length', String(length));
		status = 206;
	} else headers.set('Content-Length', String(object.size));
	return finish(new Response(request.method === 'HEAD' ? null : object.body, { status, headers }));
}
