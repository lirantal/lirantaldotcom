export const PROFILE = {
	githubURL: 'https://github.com/lirantal',
	twitterURL: 'https://twitter.com/liran_tal',
	linkedinURL: 'https://www.linkedin.com/in/lirantal'
}

export const FOOTER = {
	column1: {
		title: 'Projects',
		items: {
			item1: 'dockly',
			item1_url: 'https://github.com/lirantal/dockly',
			item2: 'lockfile-lint',
			item2_url: 'https://github.com/lirantal/lockfile-lint',
			item3: 'is-website-vulnerable',
			item3_url: 'https://github.com/lirantal/is-website-vulnerable',
			item4: 'npq',
			item4_url: 'https://github.com/lirantal/npq',
			item5: 'Node.js CLI apps best practices',
			item5_url: 'https://github.com/lirantal/nodejs-cli-apps-best-practices',
			item6: 'awesome-nodejs-security',
			item6_url: 'https://github.com/lirantal/awesome-nodejs-security'
		}
	},
	column2: {
		title: 'Books',
		items: {
			item1: 'Essential Node.js Security',
			item1_url: 'https://leanpub.com/nodejssecurity',
			item2: 'O\'Reilly Serverless Security',
			item2_url: 'https://www.oreilly.com/library/view/serverless-security/9781492082538/'
		}
	}
}

export const SITE = {
	name: 'Liran Tal',

	origin: 'https://lirantal.com',
	basePathname: '/',

	title: 'Liran Tal',
	description: 'Open Source developer, author, speaker.',

	googleAnalyticsId: false, // or "G-XXXXXXXXXX",
	googleSiteVerificationId: 'orcPxI47GSa-cRvY11tUe6iGg2IO_RPvnA1q95iEM3M',
};

export const BLOG = {
	disabled: false,
	postsPerPage: 2,

	blog: {
		disabled: false,
		pathname: 'blog', // blog main path, you can change this to "articles" (/articles)
	},

	post: {
		disabled: false,
		pathname: '', // empty for /some-post, value for /pathname/some-post 
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
