import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { SITE } from './src/config.mjs';
import { canonicalSitemap } from './scripts/canonical-sitemap.mjs';
import mdx from '@astrojs/mdx';
import solid from '@astrojs/solid-js';
import icon from 'astro-icon';
import embed from 'astro-embed/integration';

import { remarkReadingTime } from './src/utils/remark-frontmatter-extensions.mjs';
import { remarkPreserveMermaidCodeBlocks } from './src/utils/remark-preserve-mermaid.mjs';
import { remarkImageDimensions } from './src/utils/remark-image-dimensions.mjs';
import { remarkImageLoading } from './src/utils/remark-image-loading.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
	site: SITE.origin,
	base: SITE.basePathname,
	server: {
		port: 3001,
	},
	output: 'static',
	adapter: process.env.ASTRO_DEPLOY_TARGET === 'cloudflare' ? undefined : vercel(),
	trailingSlash: 'never',
	integrations: [
		canonicalSitemap(),
		embed(),
		mdx(),
		solid(),
		icon(),
	],
	vite: {
		plugins: [tailwindcss()],
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
		remarkPlugins: [remarkReadingTime, remarkPreserveMermaidCodeBlocks, remarkImageDimensions, remarkImageLoading],
		shikiConfig: {
			theme: 'github-dark',
			langs: [],
			wrap: true,
		},
	},
});
