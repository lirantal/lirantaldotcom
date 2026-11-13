import { parseFrontmatter } from '@astrojs/markdown-remark';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkGfm from 'remark-gfm';
import { toString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';

const markdown = unified().use(remarkParse).use(remarkGfm);
const mdx = unified().use(remarkParse).use(remarkGfm).use(remarkMdx);

// Parse source as data, never as a component import. Importing compiled MDX
// here makes Astro attach article embed styles to every metadata consumer,
// including the shared social-card lookup and the homepage.
export function getPostFrontmatter(source, filePath) {
	const { frontmatter, content } = parseFrontmatter(source);
	const tree = (filePath.endsWith('.mdx') ? mdx : markdown).parse(content);
	// Match the JSON serialization used by Astro's compiled frontmatter exports,
	// including YAML dates, so datetime attributes and metadata stay identical.
	return { ...JSON.parse(JSON.stringify(frontmatter)), readingTime: getReadingTime(toString(tree)).text };
}
