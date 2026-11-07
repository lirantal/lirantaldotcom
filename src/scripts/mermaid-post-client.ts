type Diagram = {
	element: HTMLElement;
	source: string;
	nearViewport: boolean;
	theme?: boolean;
	failed?: boolean;
};

const isDark = () => document.documentElement.classList.contains('dark');

// Keep the import behind the observer callback: visiting a diagram article must
// not download, evaluate, or render Mermaid below the initial viewport.
let mermaidPromise: ReturnType<typeof importMermaid> | undefined;
function importMermaid() {
	return import('mermaid').then(({ default: mermaid }) => mermaid);
}

function main(): void {
	const article = document.querySelector('article .prose');
	if (!article) return;
	const diagrams: Diagram[] = Array.from(article.querySelectorAll<HTMLElement>('pre'))
		.filter((pre) => pre.querySelector('code.language-mermaid'))
		.map((element) => ({
			element,
			source: element.querySelector('code')?.textContent ?? '',
			nearViewport: false,
		}));
	if (diagrams.length === 0) return;

	const pending = new Set<Diagram>();
	let rendering = false;
	let nextId = 0;
	let observer: IntersectionObserver | undefined;

	async function drain(): Promise<void> {
		if (rendering) return;
		rendering = true;
		try {
			while (pending.size > 0) {
				const diagram = pending.values().next().value!;
				pending.delete(diagram);
				if (!diagram.nearViewport || diagram.failed || diagram.theme === isDark()) continue;
				const dark = isDark();
				const container = document.createElement('div');
				// Mermaid needs connected DOM for SVG text measurement. Keep its work
				// invisible and outside flow; replace readable source only after success.
				container.style.cssText = 'position:fixed;top:0;left:0;visibility:hidden;pointer-events:none';
				container.setAttribute('aria-hidden', 'true');
				document.body.append(container);
				try {
					mermaidPromise ??= importMermaid().catch((error: unknown) => {
						mermaidPromise = undefined;
						throw error;
					});
					const mermaid = await mermaidPromise;
					mermaid.initialize({ startOnLoad: false, theme: dark ? 'dark' : 'default', securityLevel: 'strict' });
					const { svg, bindFunctions } = await mermaid.render(`article-diagram-${nextId++}`, diagram.source, container);
					// A theme change can arrive while the import/render is in flight.
					if (dark !== isDark()) {
						pending.add(diagram);
						continue;
					}
					const host = document.createElement('div');
					host.className = 'not-prose overflow-x-auto my-6 max-w-full';
					host.setAttribute('data-mermaid-host', '');
					host.innerHTML = svg;
					bindFunctions?.(host);
					observer?.unobserve(diagram.element);
					diagram.element.replaceWith(host);
					diagram.element = host;
					diagram.theme = dark;
					observer?.observe(host);
				} catch (error) {
					// One invalid diagram must not break the queue or destroy its source.
					diagram.failed = true;
					console.warn('Unable to render article diagram; keeping its readable fallback.', error);
				} finally {
					container.remove();
				}
			}
		} finally {
			rendering = false;
		}
	}

	function enqueue(diagram: Diagram): void {
		pending.add(diagram);
		void drain();
	}

	if ('IntersectionObserver' in window) {
		observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					const diagram = diagrams.find(({ element }) => element === entry.target);
					if (!diagram) continue;
					diagram.nearViewport = entry.isIntersecting;
					if (entry.isIntersecting) enqueue(diagram);
				}
			},
			{ rootMargin: '600px 0px' }
		);
		for (const { element } of diagrams) observer.observe(element);
	} else {
		// Older browsers render sequentially. Fences remain readable with JS off
		// or when an import/render fails.
		for (const diagram of diagrams) {
			diagram.nearViewport = true;
			enqueue(diagram);
		}
	}

	let currentTheme = isDark();
	new MutationObserver(() => {
		if (currentTheme === isDark()) return;
		currentTheme = isDark();
		for (const diagram of diagrams) {
			if (diagram.nearViewport) enqueue(diagram);
		}
	}).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', main, { once: true });
} else {
	main();
}
