import assert from 'node:assert/strict';
import test from 'node:test';
import { getSocialShareLinks } from '../src/utils/social-share.mjs';

for (const title of ['Node.js security', 'R&D & C#? "quotes" + 100% = café 🔒']) {
	test(`share links preserve query values: ${title}`, () => {
		const url = new URL('https://lirantal.com/blog/example?topic=C%23&ref=a+b#part&two');
		const twitterHandle = 'liran_tal';
		const links = getSocialShareLinks(title, url, twitterHandle);
		const expected = [
			['https://twitter.com/share', { url: url.href, text: `"${title}"`, via: twitterHandle }],
			['https://www.facebook.com/sharer.php', { u: url.href }],
			['https://www.linkedin.com/shareArticle', { url: url.href, title }],
			['https://wa.me/', { text: `${title} ${url.href}` }],
		];

		assert.equal(links.length, expected.length);
		for (const [index, link] of links.entries()) {
			const actual = new URL(link.href);
			const [destination, params] = expected[index];
			assert.equal(actual.origin + actual.pathname, destination, link.label);
			assert.equal(actual.hash, '', link.label);
			assert.deepEqual([...actual.searchParams], Object.entries(params), link.label);
		}
	});
}
