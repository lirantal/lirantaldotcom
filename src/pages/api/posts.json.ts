import { SITE } from '~/config.mjs';
import { getPermalink } from '~/utils/permalinks';
import { fetchPosts } from '~/utils/posts';

export async function GET() {
	const posts = await fetchPosts();
	const items = posts.map((post) => {
		const url = new URL(getPermalink(post.slug, 'post'), SITE.origin).toString();
		const publishedAt = post.pubDate ? new Date(post.pubDate) : null;
		return {
			slug: post.slug,
			title: post.title,
			description: post.description,
			publishedAt: publishedAt && !Number.isNaN(publishedAt.valueOf()) ? publishedAt.toISOString() : null,
			category: post.category ?? null,
			tags: Array.isArray(post.tags) ? post.tags : [],
			url,
			markdownUrl: `${url}.md`,
		};
	});

	return new Response(
		JSON.stringify({
			name: `${SITE.name} blog posts`,
			description: 'Published post metadata for the public lirantal.com blog.',
			count: items.length,
			items,
		}),
		{
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'Cache-Control': 'public, max-age=3600, s-maxage=3600',
				'Access-Control-Allow-Origin': '*',
			},
		}
	);
}
