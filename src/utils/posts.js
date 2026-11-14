import { getPostFrontmatter } from './post-metadata.mjs';

const getNormalizedPost = (frontmatter, filePath) => {
	const ID = filePath
		.split('/')
		.pop()
		.replace(/\.(md|mdx)$/i, '');

	return {
		id: ID,

		pubDate: frontmatter.pubDate,
		draft: frontmatter.draft,

		canonical: frontmatter.canonical,
		slug: frontmatter.slug || ID,

		title: frontmatter.title,
		description: frontmatter.description,
		image: frontmatter.image,

		excerpt: frontmatter.excerpt,
		authors: frontmatter.authors,
		category: frontmatter.category,
		tags: frontmatter.tags,
		readingTime: frontmatter.readingTime,
	};
};

const load = async function () {
	const posts = import.meta.glob('../../data/blog/**/*.{md,mdx}', {
		eager: true,
		query: '?raw',
		import: 'default',
	});

	const normalizedPosts = Object.entries(posts).map(([key, mod]) =>
		getNormalizedPost(getPostFrontmatter(mod, key), key)
	);

	const results = normalizedPosts
		.sort((a, b) => new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf())
		.filter((post) => !post.draft);
	return results;
};

let _posts;

/** */
export const fetchPosts = async () => {
	_posts = _posts || load();

	return await _posts;
};

/** */
export const findPostsByIds = async (ids) => {
	if (!Array.isArray(ids)) return [];

	const posts = await fetchPosts();

	return ids.reduce(function (r, id) {
		posts.some(function (post) {
			return id === post.id && r.push(post);
		});
		return r;
	}, []);
};

export const findPostsBySlugs = async (slugs) => {
	if (!Array.isArray(slugs)) return [];

	const posts = await fetchPosts();

	return slugs.reduce(function (r, slug) {
		posts.some(function (post) {
			return slug === post.slug && r.push(post);
		});
		return r;
	}, []);
};
