import { access, readFile } from 'node:fs/promises';
import sitemap from '@astrojs/sitemap';

export function canonicalSitemap() {
	let outputDirectory;
	const integration = sitemap({
		async serialize(entry) {
			const url = new URL(entry.url);
			const pathname = url.pathname.replace(/\/$/, '');
			const html = await readFile(new URL(`.${pathname}/index.html`, outputDirectory), 'utf8');
			const head = html.slice(0, html.indexOf('</head>'));
			const canonical = head.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
			const robots = head.match(/<meta name="robots" content="([^"]+)"/i)?.[1];
			if (canonical !== entry.url || /\bnoindex\b/i.test(robots ?? '')) return undefined;
			return entry;
		},
	});
	const generate = integration.hooks['astro:build:done'];
	integration.hooks['astro:build:done'] = async (options) => {
		outputDirectory = options.dir;
		await generate(options);
		await access(new URL('sitemap-index.xml', outputDirectory));
	};
	return integration;
}
