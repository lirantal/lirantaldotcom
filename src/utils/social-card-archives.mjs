import { BLOG, SITE } from '../config.mjs';
import { BLOG_BASE, CATEGORY_BASE, TAG_BASE, cleanSlug } from './permalinks.js';

export const blogArchiveBases = { blog: BLOG_BASE, tag: TAG_BASE, category: CATEGORY_BASE };

const join = (...parts) =>
	'/' +
	parts
		.filter(Boolean)
		.map((part) => String(part).replace(/^\/|\/$/g, ''))
		.filter(Boolean)
		.join('/');

/** Enumerate root-level archives explicitly: an empty base must never match every site page. */
export function blogArchivePaths(
	posts,
	{ bases = blogArchiveBases, pageSize = BLOG.postsPerPage, basePath = SITE.basePathname } = {}
) {
	const paths = new Set();
	const addPages = (base, count) => {
		for (let page = 1; page <= Math.max(1, Math.ceil(count / pageSize)); page++) {
			paths.add(page === 1 ? base : join(base, page));
		}
	};
	addPages(join(basePath, bases.blog), posts.length);
	for (const type of ['tag', 'category']) {
		const counts = new Map();
		for (const post of posts) {
			const values =
				type === 'tag'
					? Array.isArray(post.tags)
						? post.tags
						: []
					: typeof post.category === 'string'
						? [post.category]
						: [];
			for (const value of new Set(values.map((value) => String(value).toLowerCase())))
				counts.set(value, (counts.get(value) || 0) + 1);
		}
		for (const [value, count] of counts) addPages(join(basePath, bases[type], cleanSlug(value)), count);
	}
	return [...paths];
}

export function isPrefixedBlogArchive(path, bases = blogArchiveBases) {
	return Object.values(bases).some((base) => base && (path === `/${base}` || path.startsWith(`/${base}/`)));
}
