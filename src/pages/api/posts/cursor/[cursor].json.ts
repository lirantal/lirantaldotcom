import { SITE } from '~/config.mjs';
import { fetchPosts } from '~/utils/posts';
import { PUBLIC_POSTS_PAGE_SIZE, publicPostsHeaders, toPublicPost } from '~/utils/public-posts';

export async function getStaticPaths() {
	const posts = await fetchPosts();
	const pageCount = Math.max(1, Math.ceil(posts.length / PUBLIC_POSTS_PAGE_SIZE));

	return Array.from({ length: pageCount }, (_, page) => {
		const offset = page * PUBLIC_POSTS_PAGE_SIZE;
		const items = posts.slice(offset, offset + PUBLIC_POSTS_PAGE_SIZE).map(toPublicPost);
		const nextCursor = offset + PUBLIC_POSTS_PAGE_SIZE < posts.length ? String(offset + PUBLIC_POSTS_PAGE_SIZE) : null;

		return {
			params: { cursor: String(offset) },
			props: {
				payload: {
					name: `${SITE.name} blog posts`,
					description: 'A page of published post metadata from the public lirantal.com blog.',
					count: items.length,
					totalCount: posts.length,
					pageSize: PUBLIC_POSTS_PAGE_SIZE,
					cursor: String(offset),
					nextCursor,
					items,
				},
			},
		};
	});
}

export function GET({ props }) {
	return new Response(JSON.stringify(props.payload), { headers: publicPostsHeaders() });
}
