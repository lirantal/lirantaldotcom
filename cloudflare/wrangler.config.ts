import { defineWranglerConfig } from 'wrangler/experimental-config';

// cf delegates bundling to Wrangler; all admin/deploy commands use cf.
export default defineWranglerConfig({
	assetsDirectory: './.cloudflare/assets',
	types: { generate: false },
	dev: { port: 8787 },
});
