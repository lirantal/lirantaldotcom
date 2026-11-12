import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import policy from '../cloudflare/http-policy.json' with { type: 'json' };

const root = path.resolve(new URL('..', import.meta.url).pathname);
const generated = path.join(root, 'cloudflare/.cloudflare');
const source = path.join(root, 'dist');
const assets = path.join(generated, 'assets');
const media = {};
await fs.rm(assets, { recursive: true, force: true });
await fs.mkdir(assets, { recursive: true });
let count = 0;
async function copy(directory) {
	for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
		const file = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			await copy(file);
			continue;
		}
		const relative = path.relative(source, file).split(path.sep).join('/');
		const stat = await fs.stat(file);
		if (/\.(mp4|webm|mov)$/i.test(relative)) {
			media[`/${relative}`] = {
				key: relative,
				size: stat.size,
				sha256: createHash('sha256')
					.update(await fs.readFile(file))
					.digest('hex'),
				contentType: relative.endsWith('.webm') ? 'video/webm' : 'video/mp4',
			};
			continue;
		}
		if (stat.size > 25 * 1024 * 1024) throw new Error(`Asset exceeds Cloudflare 25 MiB limit: ${relative}`);
		const destination = path.join(assets, relative);
		await fs.mkdir(path.dirname(destination), { recursive: true });
		await fs.copyFile(file, destination);
		count++;
	}
}
await copy(source);
if (count > 20000) throw new Error(`Asset count ${count} exceeds free tier limit`);
await fs.writeFile(path.join(generated, 'media.json'), JSON.stringify(media, null, 2) + '\n');
// Only static-asset responses use _headers. Worker responses apply the same policy in code.
const headerRules = policy.headers.filter(({ source }) => source === '/_astro/(.*)' || source === '/(.*)');
const headers = headerRules
	.map(
		({ source, headers }) =>
			`${source.replace('(.*)', '*')}\n${headers.map(({ key, value }) => `  ${key}: ${value}`).join('\n')}`
	)
	.join('\n\n');
await fs.writeFile(
	path.join(assets, '_headers'),
	`${headers}\n\nhttps://:preview.workers.dev/*\n  X-Robots-Tag: noindex, nofollow\n`
);
console.log(`cloudflare: prepared ${count} static assets; ${Object.keys(media).length} media objects for R2`);
