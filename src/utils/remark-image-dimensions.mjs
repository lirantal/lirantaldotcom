import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { visit } from 'unist-util-visit';

const defaultPublicDir = fileURLToPath(new URL('../../public/', import.meta.url));

// Public Markdown images bypass Astro's asset pipeline. Reserve their natural
// aspect ratio before they download, without fetching or rewriting remote images.
export function remarkImageDimensions({ publicDir = defaultPublicDir } = {}) {
	const metadata = new Map();
	return async (tree) => {
		const pending = [];
		visit(tree, 'image', (node) => {
			if (!node.url.startsWith('/') || node.url.startsWith('//')) return;
			let pathname;
			try {
				pathname = decodeURIComponent(node.url.split(/[?#]/, 1)[0]);
			} catch {
				return;
			}
			const filename = path.resolve(publicDir, `.${pathname}`);
			if (path.relative(publicDir, filename).startsWith('..')) return;
			if (!metadata.has(filename)) {
				// Leave missing or unsupported images to the existing rendering behavior.
				metadata.set(
					filename,
					sharp(filename)
						.metadata()
						.catch(() => null)
				);
			}
			pending.push(
				metadata.get(filename).then((image) => {
					if (!image?.width || !image?.height) return;
					const rotated = image.orientation >= 5 && image.orientation <= 8;
					node.data ??= {};
					node.data.hProperties ??= {};
					if (node.data.hProperties.width || node.data.hProperties.height) return;
					node.data.hProperties.width = rotated ? image.height : image.width;
					node.data.hProperties.height = rotated ? image.width : image.height;
				})
			);
		});
		await Promise.all(pending);
	};
}
