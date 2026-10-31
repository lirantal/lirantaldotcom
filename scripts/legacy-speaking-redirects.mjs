import slugify from 'limax';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const redirect = (src, destination) => ({ src, headers: { Location: destination }, status: 308 });

// Recover only aliases emitted by the former speaking-page canonical bug.
export function legacySpeakingRedirects(paths) {
	const published = new Set(paths);
	const aliases = new Map();
	for (const destination of published) {
		if (!/^\/speaking\/(events|talks)(\/[^/]+)?$|^\/speaking\/(podcasts|recordings)$/.test(destination)) continue;
		const source = `/${slugify(destination)}`;
		if (published.has(source) || (aliases.has(source) && aliases.get(source) !== destination)) {
			throw new Error(`Legacy speaking redirect collides with another page: ${source}`);
		}
		aliases.set(source, destination);
	}
	const result = [];
	const groups = new Map();
	for (const [source, destination] of [...aliases].sort(([a], [b]) => a.localeCompare(b))) {
		const parts = destination.match(/^\/speaking\/(events|talks)\/([^/]+)$/);
		if (!parts || source !== `/speaking-${parts[1]}-${parts[2]}`) {
			result.push(redirect(`^${escapeRegex(source)}\\/?$`, destination));
			continue;
		}
		const family = parts[1];
		if (!groups.has(family)) groups.set(family, []);
		groups.get(family).push(escapeRegex(parts[2]));
	}
	// Batch exact slug allowlists to stay below Vercel's 2,048-route deployment limit.
	// Keep each regex short as well; the existing Markdown routes consume most of the route budget.
	for (const [family, slugs] of groups) {
		let batch = [];
		const emit = () =>
			result.push(redirect(`^/speaking-${family}-(${batch.join('|')})\\/?$`, `/speaking/${family}/$1`));
		for (const slug of slugs) {
			if (batch.length && batch.join('|').length + slug.length > 1500) {
				emit();
				batch = [];
			}
			batch.push(slug);
		}
		if (batch.length) emit();
	}
	return result;
}
