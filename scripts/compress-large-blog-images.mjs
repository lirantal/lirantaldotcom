/**
 * Recompress large blog raster images in place (same path/extension).
 * Uses Sharp: PNG/JPEG/WebP/GIF (animated GIF preserved when Sharp supports it).
 *
 * Usage:
 *   node scripts/compress-large-blog-images.mjs
 *   node scripts/compress-large-blog-images.mjs path/to/ahrefs-export.csv
 *
 * Env:
 *   MIN_BYTES (default 400000) — only process files at least this large
 *   MAX_WIDTH (default 1920) — max width; height scales down
 *   JPEG_QUALITY (default 82)
 *   WEBP_QUALITY (default 82)
 *   GIF_MAX_COLORS (default 200) — lower = smaller GIF, more banding
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const minBytes = Number(process.env.MIN_BYTES ?? 400 * 1024);
const maxWidth = Number(process.env.MAX_WIDTH ?? 1920);
const jpegQuality = Number(process.env.JPEG_QUALITY ?? 82);
const webpQuality = Number(process.env.WEBP_QUALITY ?? 82);
const gifMaxColors = Number(process.env.GIF_MAX_COLORS ?? 200);
const gifDither = Number(process.env.GIF_DITHER ?? 1);
const gifInterFrameMaxError = Number(process.env.GIF_INTERFRAME_MAX_ERROR ?? 6);
const gifInterPaletteMaxError = Number(process.env.GIF_INTERPALETTE_MAX_ERROR ?? 3);

const defaultRoots = [
	path.join(repoRoot, 'src/assets/images/blog'),
	path.join(repoRoot, 'src/assets/images'),
	path.join(repoRoot, 'public/images/blog'),
];

const rasterExts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

/** @param {string} csvPath */
async function pathsFromAhrefsCsv(csvPath) {
	let buf = await fs.readFile(csvPath);
	// Ahrefs often exports UTF-16 LE tab files (BOM FF FE).
	let text =
		buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe
			? buf.slice(2).toString('utf16le')
			: buf.toString('utf8');
	const lines = text.split(/\r?\n/).slice(1);
	const out = new Set();
	for (const line of lines) {
		if (!line.trim()) continue;
		const cols = line.split('\t');
		const raw = cols[1]?.replace(/^"|"$/g, '') ?? '';
		let pathname;
		try {
			pathname = new URL(raw).pathname;
		} catch {
			continue;
		}
		if (pathname.startsWith('/images/blog/')) {
			const base = path.basename(pathname);
			out.add(path.join(repoRoot, 'public/images/blog', base));
		}
	}
	return [...out];
}

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
		} else if (rasterExts.has(path.extname(e.name).toLowerCase())) {
			yield p;
		}
	}
}

/**
 * @param {string} file
 * @param {import('node:fs').Stats} st
 */
async function compressRaster(file, st) {
	const ext = path.extname(file).toLowerCase();
	const inputOptions =
		ext === '.gif' ? { animated: true, limitInputPixels: false } : {};
	let pipeline = sharp(file, inputOptions);
	const meta = await pipeline.metadata();

	if (meta.width && meta.width > maxWidth) {
		pipeline = pipeline.resize(maxWidth, null, {
			withoutEnlargement: true,
			fit: 'inside',
		});
	}

	let out;
	if (ext === '.png') {
		out = await pipeline.png({ compressionLevel: 9, effort: 10 }).toBuffer();
	} else if (ext === '.webp') {
		out = await pipeline.webp({ quality: webpQuality, effort: 6 }).toBuffer();
	} else if (ext === '.gif') {
		out = await pipeline
			.gif({
				colours: gifMaxColors,
				effort: 10,
				reuse: true,
				dither: gifDither,
				interFrameMaxError: gifInterFrameMaxError,
				interPaletteMaxError: gifInterPaletteMaxError,
			})
			.toBuffer();
	} else {
		out = await pipeline
			.jpeg({ quality: jpegQuality, mozjpeg: true })
			.toBuffer();
	}

	if (out.length >= st.size) return null;
	await fs.writeFile(file, out);
	return { file, before: st.size, after: out.length };
}

async function compressOne(file) {
	try {
		const st = await fs.stat(file);
		if (st.size < minBytes) return null;
		return await compressRaster(file, st);
	} catch (err) {
		console.error(`skip ${file}: ${err instanceof Error ? err.message : err}`);
		return null;
	}
}

const csvArg = process.argv[2];
let filesToProcess;

if (csvArg) {
	const csvPath = path.isAbsolute(csvArg) ? csvArg : path.join(repoRoot, csvArg);
	const listed = await pathsFromAhrefsCsv(csvPath);
	filesToProcess = [];
	for (const f of listed) {
		try {
			await fs.access(f);
			filesToProcess.push(f);
		} catch {
			console.error(`CSV listed missing file: ${f}`);
		}
	}
	console.error(
		`CSV mode: ${filesToProcess.length} existing files under public/images/blog (re-run full scan for src/assets; _astro/* URLs refresh on next build).`,
	);
} else {
	filesToProcess = null;
}

const seen = new Set();
const results = [];

if (filesToProcess) {
	for (const file of filesToProcess) {
		if (seen.has(file)) continue;
		seen.add(file);
		const r = await compressOne(file);
		if (r) results.push(r);
	}
} else {
	for (const root of defaultRoots) {
		for await (const file of walk(root)) {
			if (seen.has(file)) continue;
			seen.add(file);
			const r = await compressOne(file);
			if (r) results.push(r);
		}
	}
}

if (results.length) {
	console.log(JSON.stringify(results, null, 2));
} else {
	console.log('No files met criteria or none became smaller.');
}
