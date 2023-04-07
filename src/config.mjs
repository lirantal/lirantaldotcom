export const PROFILE = {
	githubURL: 'https://github.com/lirantal',
	twitterURL: 'https://twitter.com/liran_tal',
	twitterHandle: 'liran_tal',
	linkedinURL: 'https://www.linkedin.com/in/lirantal',
	mastodonURL: 'https://infosec.exchange/@lirantal',
};

export const FOOTER = {
	columns: [
		{
			title: 'Open Source Projects',
			items: [
				{
					title: 'dockly',
					link: 'https://github.com/lirantal/dockly',
				},
				{
					title: 'lockfile-lint',
					link: 'https://github.com/lirantal/lockfile-lint',
				},
				{
					title: 'is-website-vulnerable',
					link: 'https://github.com/lirantal/is-website-vulnerable',
				},
				{
					title: 'npq',
					link: 'https://github.com/lirantal/npq',
				},
				{
					title: 'Node.js CLI apps best practices',
					link: 'https://github.com/lirantal/nodejs-cli-apps-best-practices',
				},
				{
					title: 'awesome-nodejs-security',
					link: 'https://github.com/lirantal/awesome-nodejs-security',
				},
			],
		},
		{
			title: 'Published Author',
			items: [
				{
					title: 'Essential Node.js Security',
					link: 'https://nodejs-security.lemonsqueezy.com/checkout/buy/5d5975e1-4481-40a5-b180-de154cc865b0',
				},

				{
					title: "O'Reilly Serverless Security",
					link: 'https://www.oreilly.com/library/view/serverless-security/9781492082538/',
				},
				{
					title: 'Web Security: Learning HTTP Security Headers',
					link: 'https://nodejs-security.lemonsqueezy.com/checkout/buy/3e91088f-cbb8-41a0-9c3a-5d60233f6f7b',
				},
			],
		},
		{
			title: 'Awards',
			items: [
				{
					title: 'GitHub Star 2023',
					link: 'https://stars.github.com/profiles/lirantal/',
					icon: 'emojione:glowing-star',
				},
				{
					title: 'Pathfinder Award for Security',
					link: 'https://openjsf.org/announcement/2022/06/07/',
					icon: 'logos:openjs-foundation-icon',
				},
				{
					title: 'GitHub Star 2022',
					link: 'https://stars.github.com/profiles/lirantal/',
					icon: 'emojione:glowing-star',
				},
				{
					title: 'GitHub Star 2021',
					link: 'https://stars.github.com/profiles/lirantal/',
					icon: 'emojione:glowing-star',
				},
			],
		},
	],
};

export const SITE = {
	name: 'Liran Tal',

	origin: 'https://lirantal.com',
	basePathname: '/',

	title: 'Liran Tal',
	description: 'Developer Advocate | GitHub Star | OpenJS Security Pathfinder Award',

	// deprecated_googleAnalyticsId: false, // or "G-XXXXXXXXXX",
	// deprecated_googleSiteVerificationId: 'orcPxI47GSa-cRvY11tUe6iGg2IO_RPvnA1q95iEM3M',

	// splitbeeAnalytics: {
	// 	enabled: true,
	// 	doNotTrack: true,
	// 	noCookieMode: false,
	// },
};

export const BLOG = {
	disabled: false,
	postsPerPage: 25,

	blog: {
		disabled: false,
		pathname: 'blog', // blog main path, you can change this to "articles" (/articles)
	},

	post: {
		disabled: false,
		pathname: 'blog', // empty for /some-post, value for /pathname/some-post
	},

	category: {
		disabled: false,
		pathname: 'category', // set empty to change from /category/some-category to /some-category
	},

	tag: {
		disabled: false,
		pathname: 'tag', // set empty to change from /tag/some-tag to /some-tag
	},
};
