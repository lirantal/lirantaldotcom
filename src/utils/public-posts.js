import { SITE } from '~/config.mjs';
import { getPermalink } from '~/utils/permalinks';

export const PUBLIC_POSTS_PAGE_SIZE = 50;

export function toPublicPost(post) {
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
}

export function publicPostsHeaders() {
	return {
		'Content-Type': 'application/json; charset=utf-8',
		'Cache-Control': 'public, max-age=3600, s-maxage=3600',
		'Access-Control-Allow-Origin': '*',
	};
}
