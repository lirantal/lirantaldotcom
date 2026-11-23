export const blogRedirects = {
	'/blog/2023-01-01_advanced_usage_patterns_for_taking_element_screenshots_with_playwright':
		'/blog/advanced-usage-patterns-for-taking-page-element-screenshots-with-playwright',
	'/blog/malicious-modules-what-you-need-to-know-when-installing-':
		'/blog/malicious-modules-what-you-need-to-know-when-installing-npm-packages-12b2f56d3685',
	'/blog/mcp-server-security-evaluation-framework': '/blog/evaluation-framework-for-mcp-security-threats-and-risks',
	'/tag/model-context-protocol': '/tag/mcp',
};

export function legacyBlogRedirects(paths) {
	const published = new Set(paths);
	return Object.entries(blogRedirects).map(([source, destination]) => {
		if (published.has(source) || !published.has(destination)) {
			throw new Error(`Legacy blog redirect requires an unpublished source and a published destination: ${source} → ${destination}`);
		}
		return { src: `^${source}/?$`, headers: { Location: destination }, status: 301 };
	});
}
