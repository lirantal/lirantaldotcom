import { visit } from 'unist-util-visit';

// Article body images should not compete with the title, font, or cover at
// navigation time. Native lazy loading still fetches images near the viewport.
// Covers and component-authored images are outside this Markdown transform.
export function remarkImageLoading() {
	return (tree) => {
		visit(tree, 'image', (node) => {
			node.data ??= {};
			node.data.hProperties ??= {};
			const properties = node.data.hProperties;
			properties.loading ??= properties.fetchPriority === 'high' ? 'eager' : 'lazy';
			properties.decoding ??= 'async';
		});
	};
}
