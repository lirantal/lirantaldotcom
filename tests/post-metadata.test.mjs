import assert from 'node:assert/strict';
import test from 'node:test';
import { getPostFrontmatter } from '../src/utils/post-metadata.mjs';
import { remarkReadingTime } from '../src/utils/remark-frontmatter-extensions.mjs';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';

test('metadata preserves YAML values and computes reading time from the body', () => {
	const metadata = getPostFrontmatter(
		`---
title: "Security: tools"
slug: custom-route
pubDate: 2026-11-13
draft: false
tags: [node, security]
image: ~/assets/images/cover.png
readingTime: obsolete
---
# Heading
${'word '.repeat(450)}`,
		'post.md'
	);
	assert.equal(metadata.title, 'Security: tools');
	assert.equal(metadata.slug, 'custom-route');
	assert.equal(metadata.draft, false);
	assert.deepEqual(metadata.tags, ['node', 'security']);
	assert.equal(metadata.image, '~/assets/images/cover.png');
	assert.equal(metadata.pubDate, '2026-11-13T00:00:00.000Z');
	assert.equal(metadata.readingTime, '3 min read');
});

test('MDX metadata does not execute article imports or components', () => {
	const metadata = getPostFrontmatter(
		`---
title: Embedded article
---
import { Missing } from './does-not-exist.astro';

<Missing dangerous={(() => { throw new Error('Must not execute'); })()} />

Article text.`,
		'article.mdx'
	);
	assert.equal(metadata.title, 'Embedded article');
	assert.equal(metadata.readingTime, '1 min read');
});

test("metadata preserves the article pipeline's existing GFM table reading time", () => {
	const source = '| Name | Value |\n| --- | --- |\n' + '| alpha | beta |\n'.repeat(250);
	const tree = unified().use(remarkParse).use(remarkGfm).parse(source);
	const file = { data: { astro: { frontmatter: {} } } };
	remarkReadingTime()(tree, file);
	// This PR preserves existing article labels, including their table-cell
	// undercount. A counting correction must update both consumers together.
	assert.equal(getPostFrontmatter(source, 'table.md').readingTime, file.data.astro.frontmatter.readingTime);
});
