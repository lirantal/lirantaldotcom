/**
 * Recompress large blog raster images in place (same path/extension).
 * Skips GIF. Targets files >= minBytes; optionally downscales width > maxWidth.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const minBytes = Number(process.env.MIN_BYTES ?? 450 * 1024);
const maxWidth = Number(process.env.MAX_WIDTH ?? 1920);
const roots = [
	path.resolve('src/assets/images/blog'),
	path.resolve('public/images/blog'),
];

const exts = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function* walk(dir) {
	let entries;
	try {
		entries = await fs.readdir(dir, { withFileTypes: true });
	} catch {
		return;
	}
	for (const e of entries) {
		const p = path.join(dir, e.name);
		if (e.isDirectory()) {
			yield* walk(p);
		} else if (exts.has(path.extname(e.name).toLowerCase())) {
			yield p;
		}
	}
}

async function compressOne(file) {
	const st = await fs.stat(file);
	if (st.size < minBytes) return null;

	const ext = path.extname(file).toLowerCase();
	const img = sharp(file);
	const meta = await img.metadata();
	let pipeline = img;
	if (meta.width && meta.width > maxWidth) {
		pipeline = pipeline.resize(maxWidth, null, { withoutEnlargement: true, fit: 'inside' });
	}

	let out;
	if (ext === '.png') {
		out = await pipeline.png({ compressionLevel: 9, effort: 10 }).toBuffer();
	} else if (ext === '.webp') {
		out = await pipeline.webp({ quality: 82, effort: 6 }).toBuffer();
	} else {
		out = await pipeline.jpeg({ quality: 85, mozjpeg: true }).toBuffer();
	}

	if (out.length >= st.size) return null;
	await fs.writeFile(file, out);
	return { file, before: st.size, after: out.length };
}

const seen = new Set();
const results = [];
for (const root of roots) {
	for await (const file of walk(root)) {
		if (seen.has(file)) continue;
		seen.add(file);
		if (file.toLowerCase().endsWith('.gif')) continue;
		const r = await compressOne(file);
		if (r) results.push(r);
	}
}

if (results.length) {
	console.log(JSON.stringify(results, null, 2));
} else {
	console.log('No files met criteria or none became smaller.');
}
