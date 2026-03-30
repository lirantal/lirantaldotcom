import mermaid from 'mermaid';

const HOST_ATTR = 'data-mermaid-host';
const ENCODED_ATTR = 'data-mermaid-encoded';

function isDarkDocument(): boolean {
	return document.documentElement.classList.contains('dark');
}

function getDiagramSource(code: Element): string {
	return code.textContent ?? '';
}

function wrapHost(encoded: string): HTMLDivElement {
	const host = document.createElement('div');
	host.className = 'not-prose overflow-x-auto my-6 max-w-full';
	host.setAttribute(HOST_ATTR, '');
	host.setAttribute(ENCODED_ATTR, encoded);

	const inner = document.createElement('div');
	inner.className = 'mermaid';
	inner.textContent = decodeURIComponent(encoded);
	host.appendChild(inner);
	return host;
}

function encodeSource(source: string): string {
	return encodeURIComponent(source);
}

function resetHostsForRerender(hosts: HTMLElement[]): void {
	for (const host of hosts) {
		const encoded = host.getAttribute(ENCODED_ATTR);
		if (!encoded) continue;
		const inner = document.createElement('div');
		inner.className = 'mermaid';
		inner.textContent = decodeURIComponent(encoded);
		host.replaceChildren(inner);
	}
}

function collectMermaidSelectors(root: ParentNode): HTMLElement[] {
	const blocks: HTMLElement[] = [];

	const preservedPres = Array.from(root.querySelectorAll('pre.mermaid-source-block'));
	for (const pre of preservedPres) {
		const code = pre.querySelector('code.language-mermaid');
		if (!code) continue;
		const source = getDiagramSource(code);
		const host = wrapHost(encodeSource(source));
		pre.replaceWith(host);
		blocks.push(host);
	}

	const fallbackCodes = Array.from(root.querySelectorAll('pre code.language-mermaid'));
	for (const code of fallbackCodes) {
		const pre = code.parentElement;
		if (!pre || pre.closest(`[${HOST_ATTR}]`)) continue;
		if (pre.classList.contains('mermaid-source-block')) continue;
		const source = getDiagramSource(code);
		const host = wrapHost(encodeSource(source));
		pre.replaceWith(host);
		blocks.push(host);
	}

	return blocks;
}

async function renderMermaidInArticle(article: Element): Promise<void> {
	const hosts = collectMermaidSelectors(article);
	if (hosts.length === 0) return;

	mermaid.initialize({
		startOnLoad: false,
		theme: isDarkDocument() ? 'dark' : 'default',
		securityLevel: 'strict',
	});

	const nodes = hosts.map((h) => h.querySelector('.mermaid')).filter(Boolean) as HTMLElement[];
	await mermaid.run({ nodes });
}

async function rerenderAllInArticle(article: Element): Promise<void> {
	const hosts = Array.from(article.querySelectorAll<HTMLElement>(`[${HOST_ATTR}]`));
	if (hosts.length === 0) return;
	resetHostsForRerender(hosts);
	mermaid.initialize({
		startOnLoad: false,
		theme: isDarkDocument() ? 'dark' : 'default',
		securityLevel: 'strict',
	});
	const nodes = hosts.map((h) => h.querySelector('.mermaid')).filter(Boolean) as HTMLElement[];
	await mermaid.run({ nodes });
}

function main(): void {
	const article = document.querySelector('article .prose');
	if (!article) return;

	void renderMermaidInArticle(article);

	document.querySelectorAll('[data-aw-toggle-color-scheme]').forEach((btn) => {
		btn.addEventListener('click', () => {
			requestAnimationFrame(() => {
				void rerenderAllInArticle(article);
			});
		});
	});
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', main, { once: true });
} else {
	main();
}
