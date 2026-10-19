import { SITE } from '~/config.mjs';
import { fetchPosts } from '~/utils/posts';
import { publicPostsHeaders, toPublicPost } from '~/utils/public-posts';

export async function GET() {
	const posts = await fetchPosts();
	const items = posts.map(toPublicPost);

	return new Response(
		JSON.stringify({
			name: `${SITE.name} blog posts`,
			description: 'Published post metadata for the public lirantal.com blog.',
			count: items.length,
			items,
		}),
		{ headers: publicPostsHeaders() }
	);
}
