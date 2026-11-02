// Historical captures, not live rankings or an exhaustive appearance count.
// Keep exact dates, list filters, and immutable source links when adding evidence.
const repositoryArchive = 'https://github.com/bonfy/github-trending/blob/33ce0bd78355c07760a68b5f67461d46727c09f3';
const trendingArchive =
	'https://github.com/antonkomarev/github-trending-archive/blob/c969523e046a6b604fef64a4733813740fe3f9f5/archive';

export const trendingAppearances = [
	{
		date: '2018-04-16',
		kind: 'Repository',
		name: 'dockly',
		scope: 'JavaScript',
		rank: 19,
		source: `${repositoryArchive}/2018/2018-04-16.md#javascript`,
	},
	{
		date: '2018-04-17',
		kind: 'Repository',
		name: 'dockly',
		scope: 'JavaScript',
		rank: 12,
		source: `${repositoryArchive}/2018/2018-04-17.md#javascript`,
	},
	{
		date: '2020-02-17',
		kind: 'Repository',
		name: 'Node.js CLI Apps Best Practices',
		scope: 'Weekly roundup',
		rank: null,
		note: 'Included in a roundup of that week’s GitHub Trending projects, published February 17. No exact rank recorded.',
		source: 'https://www.cnblogs.com/xueweihan/p/12322498.html',
	},
	{
		date: '2024-12-15',
		kind: 'Developer',
		name: 'lirantal',
		scope: 'PHP',
		rank: 2,
		source: `${trendingArchive}/developer/2024/2024-12-15/php.json`,
	},
	{
		date: '2025-03-15',
		kind: 'Developer',
		name: 'lirantal',
		scope: 'PHP',
		rank: 1,
		featured: true,
		source: `${trendingArchive}/developer/2025/2025-03-15/php.json`,
	},
	{
		date: '2025-08-17',
		kind: 'Repository',
		name: 'daloRADIUS',
		scope: 'PHP',
		rank: 5,
		source: `${trendingArchive}/repository/2025/2025-08-17/php.json`,
	},
	{
		date: '2025-09-04',
		kind: 'Developer',
		name: 'lirantal',
		scope: 'All languages',
		rank: 4,
		featured: true,
		source: `${trendingArchive}/developer/2025/2025-09-04/%28null%29.json`,
	},
];
