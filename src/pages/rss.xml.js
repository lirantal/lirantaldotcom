import { SITE, BLOG } from '~/config.mjs';
import rss from '@astrojs/rss';
import { fetchPosts } from '~/utils/posts';
import { getPermalink } from '~/utils/permalinks';

export const get = async () => {
	if (BLOG.disabled) {
		return new Response(null, {
			status: 404,
			statusText: 'Not found',
		});
	}

	const posts = await fetchPosts();

	const items = [];
	for (const [index, post] of posts.entries()) {
		const content = await post.Content();
		items.push({
			link: getPermalink(post.slug, 'post'),
			title: post.title,
			description: post.description,
			pubDate: post.pubDate,
			content: String(content.props.children),
		});
	}

	return rss({
		title: `${SITE.name}'s Blog`,
		description: SITE.description,
		site: import.meta.env.SITE,
		items,
	});
};
