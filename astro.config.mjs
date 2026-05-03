import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import { SITE } from './src/config.mjs';
import mdx from '@astrojs/mdx';
import solid from '@astrojs/solid-js';
import icon from 'astro-icon';
import embed from 'astro-embed/integration';

import { remarkReadingTime } from './src/utils/remark-frontmatter-extensions.mjs';
import { remarkPreserveMermaidCodeBlocks } from './src/utils/remark-preserve-mermaid.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Fail fast if nothing is on-demand (Vercel would ship static-only: no _render, edge middleware next() → errors for SSR paths). */
function enforceServerBuildForVercel() {
	return {
		name: 'enforce-server-build-for-vercel',
		hooks: {
			'astro:routes:resolved'({ routes }) {
				const hasOnDemand = routes.some(
					(r) =>
						(r.type === 'endpoint' || r.type === 'page') &&
						r.origin === 'project' &&
						!r.isPrerendered,
				);
				if (!hasOnDemand) {
					throw new Error(
						'[enforce-server-build-for-vercel] No on-demand routes found. Add an endpoint with `export const prerender = false` (see src/pages/api/vercel-ssr-build-flag.ts).',
					);
				}
			},
		},
	};
}

// https://astro.build/config
export default defineConfig({
	site: SITE.origin,
	base: SITE.basePathname,
	server: {
		port: 3001,
	},
	// `output: "hybrid"` was removed in Astro 6; `static` is the default and supports the same
	// mix of prerendered pages + on-demand routes. One `prerender: false` route forces server
	// build output so @astrojs/vercel emits edge middleware (see `api/vercel-ssr-build-flag.ts`).
	output: 'static',
	adapter: vercel({ middlewareMode: 'edge' }),
	trailingSlash: 'never',
	integrations: [
		enforceServerBuildForVercel(),
		tailwind({
			config: {
				applyBaseStyles: false,
			},
		}),
		sitemap({
			changefreq: 'daily',
			lastmod: new Date(),
		}),
		partytown({
			config: {
				forward: ['dataLayer.push'],
			},
		}),
		embed(),
		mdx(),
		solid(),
		icon(),
	],
	vite: {
		resolve: {
			alias: {
				'~': path.resolve(__dirname, './src'),
			},
		},
	},
	image: {
		service: {
			entrypoint: 'astro/assets/services/sharp',
		},
	},
	markdown: {
		remarkPlugins: [remarkReadingTime, remarkPreserveMermaidCodeBlocks],
		shikiConfig: {
			theme: 'github-dark',
			langs: [],
			wrap: true,
		},
	},
});
