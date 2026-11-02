import { readFile } from 'node:fs/promises';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import opentype from '@shuding/opentype.js';
import bidiFactory from 'bidi-js';
import type { SocialCard } from './social-cards';

const WIDTH = 1200;
const HEIGHT = 630;
const CONTENT_WIDTH = 730;
const INK = '#171717';
const MUTED = '#626262';
const bidi = bidiFactory();
const FONT_FAMILY = 'Inter, Hebrew';

let resourcesPromise: ReturnType<typeof loadResources>;
async function loadResources() {
	const root = process.cwd();
	const [regular, bold, hebrewRegular, hebrewBold, portrait] = await Promise.all([
		readFile(path.join(root, 'node_modules/@fontsource/inter/files/inter-latin-400-normal.woff')),
		readFile(path.join(root, 'node_modules/@fontsource/inter/files/inter-latin-700-normal.woff')),
		readFile(
			path.join(root, 'node_modules/@fontsource/noto-sans-hebrew/files/noto-sans-hebrew-hebrew-400-normal.woff')
		),
		readFile(
			path.join(root, 'node_modules/@fontsource/noto-sans-hebrew/files/noto-sans-hebrew-hebrew-700-normal.woff')
		),
		sharp(path.join(root, 'src/assets/images/liran-tal-portrait-cutout.png'))
			.resize(200, 200)
			.flatten({ background: '#eaeaea' })
			.composite([
				{
					input: Buffer.from('<svg width="200" height="200"><circle cx="100" cy="100" r="100" fill="white"/></svg>'),
					blend: 'dest-in',
				},
			])
			.png()
			.toBuffer(),
	]);
	const fonts = [
		{ name: 'Inter', data: regular, weight: 400 as const },
		{ name: 'Inter', data: bold, weight: 700 as const },
		{ name: 'Hebrew', data: hebrewRegular, weight: 400 as const },
		{ name: 'Hebrew', data: hebrewBold, weight: 700 as const },
	];
	return {
		fonts,
		metrics: fonts.map((font) => ({
			weight: font.weight,
			font: opentype.parse(font.data.buffer.slice(font.data.byteOffset, font.data.byteOffset + font.data.byteLength)),
		})),
		portrait: `data:image/png;base64,${portrait.toString('base64')}`,
	};
}

/** Satori lays out glyphs LTR. Wrap logical Hebrew text first, then apply Unicode bidi per line. */
export async function prepareSocialText(text: string, fontSize: number, weight: 400 | 700) {
	if (!/[\u0590-\u05ff]/u.test(text)) return text;
	const { metrics } = await (resourcesPromise ??= loadResources());
	const width = (value: string) =>
		[...value].reduce((sum, char) => {
			const { font } = metrics.find(({ weight: w, font }) => w === weight && font.charToGlyphIndex(char)) || metrics[0];
			return sum + font.getAdvanceWidth(char, fontSize);
		}, 0);
	const lines: string[] = [];
	for (const paragraph of text.split('\n')) {
		let line = '';
		for (const word of paragraph.split(/\s+/u)) {
			const next = line ? `${line} ${word}` : word;
			if (line && width(next) > CONTENT_WIDTH - 8) {
				lines.push(line);
				line = word;
			} else line = next;
		}
		lines.push(line);
	}
	return lines.map((line) => bidi.getReorderedString(line, bidi.getEmbeddingLevels(line))).join('\n');
}

const div = (style: Record<string, unknown>, children: unknown, props: Record<string, unknown> = {}) => ({
	type: 'div',
	props: { ...props, style: { display: 'flex', ...style }, children },
});

/** Real font metrics drive fitting; full titles and co-author credits are never truncated. */
export async function renderSocialCardSvg(card: SocialCard) {
	const resources = await (resourcesPromise ??= loadResources());
	async function measure(text: string, fontSize: number, weight: 400 | 700, lineHeight: number) {
		let height = 0;
		await satori(
			div(
				{
					width: CONTENT_WIDTH,
					fontFamily: FONT_FAMILY,
					fontSize,
					fontWeight: weight,
					lineHeight,
					whiteSpace: 'pre-wrap',
					wordBreak: 'break-word',
				},
				await prepareSocialText(text, fontSize, weight),
				{ id: 'measure' }
			),
			{
				width: CONTENT_WIDTH,
				fonts: resources.fonts,
				onNodeDetected: (node) => {
					if (node.props?.id === 'measure') height = node.height;
				},
			}
		);
		return height;
	}
	const creditHeight = card.credits ? await measure(card.credits, 21, 400, 1.35) : 0;
	const detailHeight = card.detail ? await measure(card.detail, card.key === 'home' ? 29 : 23, 400, 1.35) : 0;
	const gaps = (card.credits ? 22 : 0) + (card.detail ? 22 : 0);
	const titleBudget = 388 - creditHeight - detailHeight - gaps;
	let fontSize = card.key === 'home' ? 78 : 64;
	while (fontSize > 20 && (await measure(card.title, fontSize, 700, 1.08)) > titleBudget) fontSize -= 2;
	const titleHeight = await measure(card.title, fontSize, 700, 1.08);
	if (titleHeight > titleBudget) throw new Error(`Social card title cannot fit: ${card.key}`);
	const textStyle = { whiteSpace: 'pre-wrap', wordBreak: 'break-word' };
	const svg = await satori(
		div({ width: WIDTH, height: HEIGHT, background: '#fff', fontFamily: FONT_FAMILY, color: INK }, [
			div({ position: 'absolute', left: 56, top: 40, fontSize: 30, fontWeight: 700 }, 'Liran Tal'),
			...(card.section
				? [div({ position: 'absolute', left: 56, top: 87, fontSize: 23, color: MUTED }, card.section)]
				: []),
			div(
				{
					position: 'absolute',
					left: 56,
					top: 142,
					width: CONTENT_WIDTH,
					height: 388,
					flexDirection: 'column',
					justifyContent: 'center',
				},
				[
					div(
						{ ...textStyle, fontSize, fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.025em' },
						await prepareSocialText(card.title, fontSize, 700)
					),
					...(card.credits
						? [
								div(
									{ ...textStyle, fontSize: 21, lineHeight: 1.35, marginTop: 22 },
									await prepareSocialText(card.credits, 21, 400)
								),
							]
						: []),
					...(card.detail
						? [
								div(
									{
										...textStyle,
										fontSize: card.key === 'home' ? 29 : 23,
										lineHeight: 1.35,
										marginTop: 22,
										color: MUTED,
									},
									await prepareSocialText(card.detail, card.key === 'home' ? 29 : 23, 400)
								),
							]
						: []),
				]
			),
			div({ position: 'absolute', left: 56, top: 552, width: CONTENT_WIDTH, height: 1, background: '#dfdfdf' }, ''),
			div({ position: 'absolute', left: 56, top: 573, fontSize: 22, color: MUTED }, 'lirantal.com'),
			div(
				{
					position: 'absolute',
					left: 836,
					top: 0,
					width: 364,
					height: HEIGHT,
					background: '#f7f7f7',
					borderLeft: '1px solid #dfdfdf',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
				},
				[
					{ type: 'img', props: { src: resources.portrait, width: 200, height: 200, style: { borderRadius: 100 } } },
					div({ marginTop: 26, fontSize: 29, fontWeight: 700 }, 'Liran Tal'),
					div({ marginTop: 10, fontSize: 22, color: MUTED }, 'Developer Relations'),
					div({ marginTop: 4, fontSize: 22, color: MUTED }, '& Security Research'),
				]
			),
		]),
		{ width: WIDTH, height: HEIGHT, fonts: resources.fonts }
	);
	return { svg, fontSize, titleHeight, titleBudget };
}

export async function renderSocialCard(card: SocialCard) {
	const { svg } = await renderSocialCardSvg(card);
	return new Resvg(svg).render().asPng();
}
