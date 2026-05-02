#!/usr/bin/env node
/**
 * Renders an Open Graph–sized blog cover (default 1200×630) from an SVG template
 * via Sharp. Run from repo root so paths like src/assets/images/blog/foo.png resolve.
 *
 * Usage:
 *   node scripts/generate-blog-cover.js --title "My title" --out src/assets/images/blog/slug.png
 *   node scripts/generate-blog-cover.js --title "Title" --subtitle "Optional line" --out path/to/cover.png
 *   npm run blog:cover -- --title 'Use single quotes if & appears' --out src/assets/images/blog/slug.png
 *
 * Style (random among ~28 curated presets by default):
 *   --list-styles              Print preset ids grouped by family and exit
 *   --style <id>               Force a specific preset (see --list-styles)
 *   --seed <string>            Deterministic preset from seed (e.g. post slug)
 *
 * Consecutive runs try not to repeat the same preset as last time (see .cache/); disabled when --seed or --style is set.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');
const {
	PRESETS,
	pickPresetIndex,
	getPresetById,
	listStylesGrouped,
	buildPresetLayers,
} = require('./blog-cover-presets');

const DEFAULTS = {
	width: 1200,
	height: 630,
	titleSize: 72,
	subtitleSize: 38,
	titleMaxChars: 22,
	subtitleMaxChars: 48,
	paddingX: 64,
	paddingTop: 200,
};

const CACHE_DIR = path.join(process.cwd(), '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'blog-cover-last-preset.json');

function usage() {
	console.error(`Usage:
  node scripts/generate-blog-cover.js --title <string> --out <path> [--subtitle <string>]

Options:
  --out            Output PNG path (required)
  --title          Main heading (required)
  --subtitle       Second line (optional)
  --width          Canvas width (default ${DEFAULTS.width})
  --height         Canvas height (default ${DEFAULTS.height})
  --title-size     Title font size in px (default ${DEFAULTS.titleSize})
  --subtitle-size  Subtitle font size in px (default ${DEFAULTS.subtitleSize})
  --title-wrap     Max characters per title line before wrap (default ${DEFAULTS.titleMaxChars})
  --subtitle-wrap  Max characters per subtitle line (default ${DEFAULTS.subtitleMaxChars})
  --list-styles    List preset ids and exit
  --style <id>     Use preset id (default: random)
  --seed <string>  Deterministic preset from seed
`);
}

function parseArgs(argv) {
	const opts = { ...DEFAULTS };
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		const next = () => {
			const v = argv[++i];
			if (v === undefined) throw new Error(`Missing value after ${a}`);
			return v;
		};
		if (a === '--help' || a === '-h') {
			opts.help = true;
		} else if (a === '--title') opts.title = next();
		else if (a === '--subtitle') opts.subtitle = next();
		else if (a === '--out') opts.out = next();
		else if (a === '--width') opts.width = parseInt(next(), 10);
		else if (a === '--height') opts.height = parseInt(next(), 10);
		else if (a === '--title-size') opts.titleSize = parseInt(next(), 10);
		else if (a === '--subtitle-size') opts.subtitleSize = parseInt(next(), 10);
		else if (a === '--title-wrap') opts.titleMaxChars = parseInt(next(), 10);
		else if (a === '--subtitle-wrap') opts.subtitleMaxChars = parseInt(next(), 10);
		else if (a === '--list-styles') opts.listStyles = true;
		else if (a === '--style') opts.styleId = next();
		else if (a === '--seed') opts.seed = next();
		else if (a.startsWith('-')) throw new Error(`Unknown option: ${a}`);
	}
	return opts;
}

function escapeXml(text) {
	return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Greedy word-wrap to lines of at most maxLen characters. */
function wrapLines(text, maxLen, maxLines) {
	const words = String(text).trim().split(/\s+/).filter(Boolean);
	const lines = [];
	let line = '';
	for (const w of words) {
		if (w.length > maxLen) {
			if (line) {
				lines.push(line);
				line = '';
			}
			lines.push(w.slice(0, Math.max(1, maxLen - 1)) + '…');
			continue;
		}
		const candidate = line ? `${line} ${w}` : w;
		if (candidate.length <= maxLen) {
			line = candidate;
		} else {
			if (line) lines.push(line);
			line = w;
		}
	}
	if (line) lines.push(line);

	if (lines.length <= maxLines) return lines;

	const out = lines.slice(0, maxLines);
	let last = out[maxLines - 1];
	if (!last.endsWith('…')) {
		last = last.slice(0, Math.max(1, maxLen - 1)) + '…';
	}
	out[maxLines - 1] = last;
	return out;
}

/**
 * @param {object} opts layout + content
 * @param {{ defs: string, body: string, titleFill: string, subtitleFill: string }} theme
 */
function buildSvg(opts, theme) {
	const {
		width,
		height,
		title,
		subtitle,
		titleSize,
		subtitleSize,
		titleMaxChars,
		subtitleMaxChars,
		paddingX,
		paddingTop,
	} = opts;

	const titleLines = wrapLines(title, titleMaxChars, 3);
	const subtitleLines = subtitle ? wrapLines(subtitle, subtitleMaxChars, 2) : [];

	const titleLineHeight = titleSize * 1.12;
	const subtitleLineHeight = subtitleSize * 1.2;
	const gapAfterTitle = subtitleLines.length ? 36 : 0;

	const titleTspans = titleLines
		.map((ln, i) => {
			const dy = i === 0 ? '0' : `${titleLineHeight}`;
			return `<tspan x="${paddingX}" dy="${dy}">${escapeXml(ln)}</tspan>`;
		})
		.join('\n    ');

	const titleBlockHeight = titleLines.length * titleLineHeight;
	const subtitleY = paddingTop + titleBlockHeight + gapAfterTitle;

	const subtitleTspans =
		subtitleLines.length > 0
			? subtitleLines
					.map((ln, i) => {
						const dy = i === 0 ? '0' : `${subtitleLineHeight}`;
						return `<tspan x="${paddingX}" dy="${dy}">${escapeXml(ln)}</tspan>`;
					})
					.join('\n    ')
			: '';

	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    ${theme.defs}
  </defs>
  ${theme.body}
  <text
    x="${paddingX}"
    y="${paddingTop}"
    font-family="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    font-size="${titleSize}"
    font-weight="700"
    fill="${theme.titleFill}"
  >${titleTspans}</text>
  ${
		subtitleTspans
			? `<text
    x="${paddingX}"
    y="${subtitleY}"
    font-family="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    font-size="${subtitleSize}"
    font-weight="500"
    fill="${theme.subtitleFill}"
  >${subtitleTspans}</text>`
			: ''
	}
</svg>`;
}

function readLastPresetId() {
	try {
		const raw = fs.readFileSync(CACHE_FILE, 'utf8');
		const j = JSON.parse(raw);
		return typeof j.presetId === 'string' ? j.presetId : null;
	} catch {
		return null;
	}
}

function writeLastPresetId(presetId) {
	try {
		fs.mkdirSync(CACHE_DIR, { recursive: true });
		fs.writeFileSync(CACHE_FILE, JSON.stringify({ presetId }, null, 0), 'utf8');
	} catch (e) {
		console.warn('Could not write preset cache:', e.message);
	}
}

function printListStyles() {
	const grouped = listStylesGrouped();
	console.log(`Blog cover presets (${PRESETS.length} total):\n`);
	const families = Object.keys(grouped).sort();
	for (const fam of families) {
		console.log(`  [${fam}]`);
		for (const id of grouped[fam].sort()) {
			console.log(`    ${id}`);
		}
		console.log('');
	}
}

function resolvePreset(cli) {
	if (cli.styleId) {
		const p = getPresetById(cli.styleId);
		if (!p) {
			console.error(`Unknown --style "${cli.styleId}". Use --list-styles for ids.\n`);
			printListStyles();
			process.exit(1);
		}
		return { preset: p, index: PRESETS.indexOf(p) };
	}

	const useDedupe = !cli.seed;
	const avoidId = useDedupe ? readLastPresetId() : null;
	const index = pickPresetIndex({ seed: cli.seed, avoidId });
	return { preset: PRESETS[index], index };
}

async function main() {
	let opts;
	try {
		opts = parseArgs(process.argv.slice(2));
	} catch (e) {
		console.error(e.message);
		usage();
		process.exit(1);
	}

	if (opts.help) {
		usage();
		process.exit(0);
	}

	if (opts.listStyles) {
		printListStyles();
		process.exit(0);
	}

	if (!opts.title || !opts.out) {
		console.error('Error: --title and --out are required.\n');
		usage();
		process.exit(1);
	}

	if (
		[opts.width, opts.height, opts.titleSize, opts.subtitleSize].some(
			(n) => typeof n !== 'number' || Number.isNaN(n) || n < 1
		)
	) {
		console.error('Error: numeric options must be positive integers.');
		process.exit(1);
	}

	const { preset } = resolvePreset(opts);
	const uid = crypto.randomBytes(4).toString('hex');
	const theme = buildPresetLayers(uid, opts.width, opts.height, preset);

	console.log(`Using style: ${preset.id} (${preset.family})`);

	const outAbs = path.resolve(process.cwd(), opts.out);
	const dir = path.dirname(outAbs);
	fs.mkdirSync(dir, { recursive: true });

	const svg = buildSvg(opts, theme);
	await sharp(Buffer.from(svg, 'utf8')).png().toFile(outAbs);

	writeLastPresetId(preset.id);

	console.log(`Wrote ${path.relative(process.cwd(), outAbs)} (${opts.width}×${opts.height})`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
