import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

// Keep exact URLs for images whose originals are still in the repository.
const images = {
	'_astro/tailscale-on-home-assistant-install.5S_wv0GE.png': 'tailscale-on-home-assistant-install.png',
	'assets/1__l2uYvct0tWWIaUw__SSJFIQ.4091eed6_Z152SL0.jpeg': '1__l2uYvct0tWWIaUw__SSJFIQ.jpeg',
	'assets/config-anti-patterns-nodejs-apps.46680222_ZINTze.png': 'config-anti-patterns-nodejs-apps.png',
	'assets/nodejs-poor-auth-express-conventions.b3a05a85.jpeg': 'nodejs-poor-auth-express-conventions.jpeg',
	'assets/of0bgqoc2ghd5dpsrj9a.2a92fcd3_SFCAs.jpeg': 'of0bgqoc2ghd5dpsrj9a.jpeg',
	'assets/photo-1578163677454-b3933804a354.5726778a_Z2aeIx2.jpeg': 'photo-1578163677454-b3933804a354.jpeg',
	'assets/photo-1638437447411-17a4005b2f56.b8e1dcaf.jpg': 'photo-1638437447411-17a4005b2f56.jpg',
	'assets/vue-3-fastify-deploy-to-heroku.7485d0a3.png': 'vue-3-fastify-deploy-to-heroku.png',
};

const output = process.argv[2];
for (const [legacyPath, original] of Object.entries(images)) {
	const source = new URL(`../src/assets/images/blog/${original}`, import.meta.url);
	const destination = path.join(output, legacyPath);
	await mkdir(path.dirname(destination), { recursive: true });
	await copyFile(source, destination);
}
