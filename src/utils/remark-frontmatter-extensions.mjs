import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

export function remarkReadingTime() {
	return function (tree, file) {
		const textOnPage = toString(tree);
		const readingTime = getReadingTime(textOnPage);
		const astro = file?.data?.astro;
		if (astro?.frontmatter) {
			astro.frontmatter.readingTime = readingTime.text;
		}
	};
}
