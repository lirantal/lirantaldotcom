import rss from '@astrojs/rss';
import { SITE, BLOG } from '~/config.mjs';
import { fetchPosts } from '~/utils/posts';
import { getPermalink } from '~/utils/permalinks';

export async function GET(context) {
	if (BLOG.disabled) {
		return new Response(null, {
			status: 404,
			statusText: 'Not found',
		});
	}

	const posts = await fetchPosts();

	const toPubDate = (d) => {
		if (!d) return undefined;
		const date = d instanceof Date ? d : new Date(d);
		return Number.isNaN(date.getTime()) ? undefined : date;
	};

	return rss({
		title: `${SITE.name}'s Blog`,
		description: SITE.description,
		site: context.site ?? SITE.origin,
		trailingSlash: false,
		items: posts.map((post) => ({
			link: getPermalink(post.slug, 'post'),
			title: post.title,
			description: post.description,
			pubDate: toPubDate(post.pubDate),
		})),
	});
}
