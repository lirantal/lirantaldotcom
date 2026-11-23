// The original audit pilot and verified single-post archives for tag aliases or a typo.
const noindexTagArchives = new Set([
	'/tag/dos', // denial-of-service
	'/tag/lfi', // local-file-inclusion
	'/tag/og', // opengraph
	'/tag/securiyy', // security
	'/tag/star', // github-star
	'/tag/xmlhttprequest',
]);

export function isNoindexTagArchive(pathname) {
	return noindexTagArchives.has(pathname.replace(/\/$/, ''));
}
