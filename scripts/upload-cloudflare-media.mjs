import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
const root = path.resolve(new URL('..', import.meta.url).pathname);
const local = process.argv.includes('--local');
if (!local && !/^[a-f0-9]{32}$/.test(process.env.CLOUDFLARE_ACCOUNT_ID || '')) {
	throw new Error('Set CLOUDFLARE_ACCOUNT_ID explicitly before uploading media to the selected account.');
}
const media = JSON.parse(await fs.readFile(path.join(root, 'cloudflare/.cloudflare/media.json'), 'utf8'));
for (const file of Object.values(media)) {
	const args = [
		'r2',
		'objects',
		'put',
		file.key,
		'--bucket-name',
		'lirantaldotcom-media',
		'--file',
		path.join(root, 'dist', file.key),
		'--content-type',
		file.contentType,
	];
	if (local) args.push('--local');
	await new Promise((resolve, reject) => {
		const child = spawn(path.join(root, 'cloudflare/node_modules/.bin/cf'), args, {
			cwd: path.join(root, 'cloudflare'),
			stdio: 'inherit',
		});
		child.on('error', reject);
		child.on('exit', (code) =>
			code === 0 ? resolve() : reject(new Error(`cf upload failed for ${file.key} (${code})`))
		);
	});
}
console.log(
	`cloudflare: uploaded ${Object.keys(media).length} media objects (${local ? 'local simulation' : 'selected account'})`
);
