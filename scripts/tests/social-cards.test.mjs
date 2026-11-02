import assert from 'node:assert/strict';
import test from 'node:test';
import sharp from 'sharp';
import { prepareSocialText, renderSocialCard, renderSocialCardSvg } from '../../src/utils/render-social-card.ts';

test('Hebrew text uses visual glyph order while embedded English stays LTR', async () => {
	assert.equal(await prepareSocialText('שלום עולם AI', 32, 700), 'AI םלוע םולש');
});

test('real long titles and full co-author lists fit without truncation', async () => {
	const cards = [
		{
			key: 'blog',
			section: 'Blog / Article',
			title: 'Hacking your infra from the outside by exploiting npm Dependency Confusion attacks',
		},
		{
			key: 'talk',
			section: 'Speaking / Talk',
			title: 'Your AI Agent Installed Malware Because a SKILL.md Told It To',
			detail: 'AGNTCon + MCPCon North America 2026',
		},
		{
			key: 'paper',
			section: 'Research / Preprint',
			title:
				'How Deterministic SAST and AI Security Agents Divide the Work: Coverage, Harness Policy and Cost in Snyk VulnBench 2.0',
			credits: 'Liran Tal, Chris Liu, Charlotte Fereday, Sebastian Roth, and Brian Clark',
			detail: 'arXiv:2610.38617 · October 2026',
		},
		{
			key: 'paper',
			section: 'Research / Preprint',
			title: 'Technical Report: Exploring the Emerging Threats of the Agent Skill Ecosystem',
			credits:
				'Luca Beurer-Kellner, Aleksei Kudrinskii, Marco Milanta, Kristian Bonde Nielsen, Hemang Sarkar, and Liran Tal',
			detail: 'arXiv:2605.28588 · May 2026',
		},
		{
			key: 'unicode',
			section: 'Speaking / Talk',
			title: 'אבטחת קוד פתוח: AI, Node.js & “untrusted” <dependencies>',
			detail: 'Developer advocacy & security',
		},
	];
	for (const card of cards) {
		const { svg, fontSize, titleHeight, titleBudget } = await renderSocialCardSvg(card);
		assert.ok(titleHeight <= titleBudget, card.title);
		assert.ok(fontSize >= 28, `Title must remain readable: ${card.title}`);
		assert.ok(svg.startsWith('<svg'));
	}
});

test('cards are 1200 × 630 PNGs with a circular, smaller original portrait', async () => {
	const png = await renderSocialCard({
		key: 'home',
		section: '',
		title: 'Securing the\nagentic future.',
		detail: 'Developer advocacy, open source,\nand security research.',
	});
	const metadata = await sharp(png).metadata();
	assert.equal(metadata.format, 'png');
	assert.equal(metadata.width, 1200);
	assert.equal(metadata.height, 630);
	const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
	const pixel = (x, y) => [...data.subarray((y * info.width + x) * 3, (y * info.width + x) * 3 + 3)];
	assert.deepEqual(pixel(60, 10), [255, 255, 255]);
	assert.deepEqual(pixel(1190, 10), [247, 247, 247]);
	// Corner of the 200px avatar bounding box remains the rail, not a rectangular photo.
	assert.deepEqual(pixel(919, 151), [247, 247, 247]);
	assert.notDeepEqual(pixel(1018, 250), [247, 247, 247]);
});
