const DEFAULT_BASE_URL = 'https://lirantal.com';

export class LirantalSiteClient {
	constructor({ baseUrl = DEFAULT_BASE_URL, fetchImpl = globalThis.fetch } = {}) {
		if (typeof fetchImpl !== 'function') {
			throw new TypeError('A Fetch API implementation is required.');
		}

		this.baseUrl = baseUrl.replace(/\/$/, '');
		this.fetch = fetchImpl;
	}

	async listPosts({ signal } = {}) {
		const response = await this.fetch(`${this.baseUrl}/api/posts.json`, {
			headers: { Accept: 'application/json' },
			signal,
		});
		if (!response.ok) throw new Error(`Could not fetch posts: HTTP ${response.status}`);
		return response.json();
	}

	async searchPosts(query, { limit = 10, signal } = {}) {
		const terms = String(query ?? '')
			.toLocaleLowerCase()
			.trim()
			.split(/\s+/)
			.filter(Boolean);
		if (terms.length === 0) return [];

		const { items } = await this.listPosts({ signal });
		return items
			.filter((post) => {
				const text = [post.title, post.description, post.category, ...(post.tags ?? [])]
					.filter(Boolean)
					.join(' ')
					.toLocaleLowerCase();
				return terms.every((term) => text.includes(term));
			})
			.slice(0, Math.max(0, limit));
	}
}
