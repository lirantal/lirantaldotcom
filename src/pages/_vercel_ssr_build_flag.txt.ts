import type { APIRoute } from 'astro';

/** Not user-facing: exists so the Vercel adapter emits edge middleware (see astro.config.mjs). */
export const prerender = false;

export const GET: APIRoute = () =>
	new Response('ok\n', {
		status: 200,
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'private, no-store',
		},
	});
