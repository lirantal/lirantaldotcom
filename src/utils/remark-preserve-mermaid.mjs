import { visit } from 'unist-util-visit';

function escapeHtml(text) {
	return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Turn ```mermaid fences into raw HTML before Shiki runs. Shiki has no mermaid grammar,
 * so it would otherwise fall back to plaintext and drop language-mermaid from output.
 */
export function remarkPreserveMermaidCodeBlocks() {
	return function (tree) {
		visit(tree, 'code', (node) => {
			if (node.lang !== 'mermaid') return;
			node.type = 'html';
			node.value = `<pre class="mermaid-source-block"><code class="language-mermaid">${escapeHtml(
				node.value
			)}</code></pre>`;
			delete node.lang;
			delete node.meta;
			if (node.children) {
				node.children = [];
			}
		});
	};
}
