export function getSocialShareLinks(title, url, twitterHandle) {
	return [
		{
			label: 'Share on X',
			icon: 'tabler:brand-x',
			href: `https://twitter.com/share?${new URLSearchParams({ url, text: `"${title}"`, via: twitterHandle })}`,
		},
		{
			label: 'Share on Facebook',
			icon: 'tabler:brand-facebook',
			href: `https://www.facebook.com/sharer.php?${new URLSearchParams({ u: url })}`,
		},
		{
			label: 'Share on LinkedIn',
			icon: 'tabler:brand-linkedin',
			href: `https://www.linkedin.com/shareArticle?${new URLSearchParams({ url, title })}`,
		},
		{
			label: 'Share on WhatsApp',
			icon: 'tabler:brand-whatsapp',
			href: `https://wa.me/?${new URLSearchParams({ text: `${title} ${url}` })}`,
		},
	];
}
