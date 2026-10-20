const form = document.querySelector('#blog-agent-search');
const input = document.querySelector('#blog-search-query');
const status = document.querySelector('#blog-search-status');
const resultsList = document.querySelector('#blog-search-results');

if (form && input && status && resultsList) {
	form.hidden = false;
	let postItems;
	let latestSearchId = 0;
	const unavailableMessage = 'Article search is temporarily unavailable. Try the RSS feed or complete blog archive.';

	const fetchPosts = async (signal) => {
		if (!postItems) {
			const response = await fetch('/api/posts.json', { headers: { Accept: 'application/json' }, signal });
			if (!response.ok) throw new Error('The published post index could not be loaded.');
			const data = await response.json();
			postItems = data.items;
		}
		return postItems;
	};

	const findPosts = async (query, signal) => {
		const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
		if (terms.length === 0) return [];

		const posts = await fetchPosts(signal);
		return posts
			.filter((post) => {
				const searchableText = [post.title, post.description, post.category, ...(post.tags ?? [])]
					.filter(Boolean)
					.join(' ')
					.toLocaleLowerCase();
				return terms.every((term) => searchableText.includes(term));
			})
			.slice(0, 10)
			.map(({ title, description, publishedAt, url, markdownUrl, tags }) => ({
				title,
				description,
				publishedAt,
				url,
				markdownUrl,
				tags,
			}));
	};

	const renderResults = (query, results) => {
		resultsList.replaceChildren();
		resultsList.hidden = false;
		status.hidden = false;
		status.textContent = results.length
			? `${results.length} matching article${results.length === 1 ? '' : 's'} for “${query}”.`
			: `No articles matched “${query}”.`;

		for (const result of results) {
			const item = document.createElement('li');
			const title = document.createElement('a');
			const summary = document.createElement('p');
			const date = document.createElement('p');
			title.href = result.url;
			title.textContent = result.title;
			title.className = 'font-semibold underline underline-offset-4';
			summary.textContent = result.description;
			summary.className = 'muted mt-1 text-sm';
			const dateLabel = result.publishedAt ? new Date(result.publishedAt).toLocaleDateString() : 'Date unavailable';
			date.textContent = `${dateLabel} · Markdown: ${result.markdownUrl}`;
			date.className = 'muted mt-1 text-xs';
			item.append(title, summary, date);
			resultsList.append(item);
		}
	};

	const runSearch = async (query) => {
		const searchId = ++latestSearchId;
		status.hidden = false;
		status.textContent = 'Searching published articles…';

		try {
			const results = await findPosts(query);
			if (searchId === latestSearchId) renderResults(query, results);
		} catch {
			if (searchId !== latestSearchId) return;
			status.hidden = false;
			status.textContent = unavailableMessage;
		}
	};

	form.addEventListener('submit', (event) => {
		event.preventDefault();
		const query = input.value.trim();
		if (!query) return;
		const url = new URL(window.location.href);
		url.searchParams.set('q', query);
		window.history.replaceState(null, '', url);
		void runSearch(query);
	});

	const initialQuery = new URLSearchParams(window.location.search).get('q');
	if (initialQuery) {
		input.value = initialQuery;
		void runSearch(initialQuery);
	}

	const modelContext = document.modelContext ?? navigator.modelContext;
	if (modelContext && typeof modelContext.registerTool === 'function') {
		const registrationController = new AbortController();
		window.addEventListener('pagehide', (event) => {
			if (!event.persisted) registrationController.abort();
		});
		void modelContext
			.registerTool(
				{
					name: 'search_blog_posts',
					description:
						"Search Liran Tal's published blog posts by topic. Returns matching article titles, summaries, dates, canonical URLs, and Markdown URLs.",
					inputSchema: {
						type: 'object',
						properties: {
							query: {
								type: 'string',
								description: 'A topic, keyword, project, or technology to find in article metadata.',
							},
						},
						required: ['query'],
					},
					annotations: { readOnlyHint: true, untrustedContentHint: true },
					execute: async ({ query }, { signal } = {}) => ({
						query,
						results: await findPosts(query, signal),
					}),
				},
				{ signal: registrationController.signal }
			)
			.catch((error) => console.warn('Could not register the blog search WebMCP tool.', error));
	}
}
