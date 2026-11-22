// Start with the single-post archive identified in the Search Console audit.
export function isNoindexTagArchive(pathname) {
	return pathname.replace(/\/$/, '') === '/tag/xmlhttprequest';
}
