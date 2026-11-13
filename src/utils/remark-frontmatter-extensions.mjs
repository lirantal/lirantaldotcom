import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

export function getReadingTimeText(tree) {
	return getReadingTime(toString(tree)).text;
}

export function remarkReadingTime() {
	return function (tree, file) {
		const astro = file?.data?.astro;
		if (astro?.frontmatter) {
			astro.frontmatter.readingTime = getReadingTimeText(tree);
		}
	};
}
