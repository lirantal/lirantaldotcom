import { bindings, defineConfig } from 'cf/config';

// Custom domains apply to parent deployments; preview uploads retain preview URLs.
export default defineConfig(({ isPreview }) => ({
	accountId: '72bac654168b15b354744bf1e8b6762f', // Account: default
	worker: {
		name: 'lirantaldotcom',
		entrypoint: './worker.mjs',
		compatibilityDate: '2026-11-12',
		workersDev: false,
		domains: ['lirantal.com', 'www.lirantal.com'],
		previewUrls: true,
		env: {
			ASSETS: bindings.assets(),
			MEDIA: bindings.r2({ name: 'lirantaldotcom-media' }),
			IS_PREVIEW: bindings.text(isPreview ? 'true' : 'false'),
		},
		assets: {
			htmlHandling: 'drop-trailing-slash',
			notFoundHandling: 'none',
			// Existing HTML must reach negotiation; hashed assets bypass the Worker.
			runWorkerFirst: ['/*', '!/_astro/*', '!/pagefind/*', '!/og/*'],
		},
	},
}));
