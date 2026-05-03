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

// https://astro.build/config
export default defineConfig({
	site: SITE.origin,
	base: SITE.basePathname,
	server: {
		port: 3001,
	},
	// Hybrid + one `prerender: false` route forces server build output so @astrojs/vercel
	// emits edge middleware (`buildMiddlewareFolder` only runs when buildOutput === "server").
	// All other routes stay prerendered by default.
	output: 'hybrid',
	adapter: vercel({ middlewareMode: 'edge' }),
	trailingSlash: 'never',
	integrations: [
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
