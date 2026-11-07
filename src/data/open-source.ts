import { projects } from './portfolio';
import impact from './open-source-impact.json';
import ranks from './gitranks.json';

export const openSourcePages = [
	{ href: '/open-source', label: 'Overview' },
	{ href: '/open-source/projects', label: 'Projects & resources' },
	{ href: '/open-source/contributions', label: 'Ecosystem contributions' },
	{ href: '/open-source/impact', label: 'Impact & rankings' },
];

export const gitRanks = {
	profile: ranks.source,
	methodology: ranks.methodology,
};

export const dateLabel = (date: string) =>
	new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
		timeZone: 'UTC',
	});

export const contributionCount = (repository: string) =>
	impact.mergedPullRequests.selectedRepositories.find((entry) => entry.name === repository)?.mergedPullRequests;

type Project = {
	name: string;
	url: string;
	npm?: string;
	kind: string;
	description: string;
	role: string;
};

const existing = (name: string, role = 'Creator & maintainer'): Project => {
	const project = projects.find((project) => project.name === name);
	if (!project) throw new Error(`Missing curated project: ${name}`);
	return { ...project, role };
};

// Curated projects grouped by purpose.
export const projectGroups: { id: string; title: string; description: string; projects: Project[] }[] = [
	{
		id: 'security',
		title: 'Security tools',
		description: 'Tools for checking package installs, lockfiles, website dependencies, and source code.',
		projects: [
			existing('lockfile-lint'),
			existing('npq'),
			existing('anti-trojan-source'),
			{
				name: 'is-website-vulnerable',
				url: 'https://github.com/lirantal/is-website-vulnerable',
				npm: 'is-website-vulnerable',
				kind: 'Web security',
				role: 'Creator & maintainer',
				description: 'Find publicly known vulnerabilities in the frontend JavaScript libraries a website loads.',
			},
			{
				name: 'ESLint plugin for anti-trojan-source',
				url: 'https://github.com/lirantal/eslint-plugin-anti-trojan-source',
				npm: 'eslint-plugin-anti-trojan-source',
				kind: 'Editor & CI integration',
				role: 'Creator & maintainer',
				description:
					'Bring bidirectional Unicode checks into ESLint so disguised code can be caught during development and review.',
			},
		],
	},
	{
		id: 'tools',
		title: 'Developer tools & infrastructure',
		description: 'Tools for Docker, FreeRADIUS deployments, terminal dashboards, and MCP configuration.',
		projects: [
			existing('dockly'),
			{
				name: 'daloRADIUS',
				url: 'https://github.com/lirantal/daloradius',
				kind: 'Network management',
				role: 'Original creator',
				description:
					'A web management application for FreeRADIUS deployments, covering users, accounting, reporting, and billing.',
			},
			{
				name: 'blessed-contrib',
				url: 'https://github.com/yaronn/blessed-contrib',
				npm: 'blessed-contrib',
				kind: 'Terminal dashboards',
				role: 'Contributor & maintainer',
				description:
					'Charts, maps, tables, and other terminal widgets for Node.js dashboards. Originally created by Yaron Naveh.',
			},
			{
				name: 'ls-mcp',
				url: 'https://github.com/lirantal/ls-mcp',
				npm: 'ls-mcp',
				kind: 'AI developer tooling',
				role: 'Creator & maintainer',
				description:
					'Discover MCP server configurations used by applications such as Cursor, Claude Desktop, and VS Code.',
			},
		],
	},
	{
		id: 'practices',
		title: 'Security guides & CLI best practices',
		description: 'Community guides covering Node.js command-line apps, npm security, and MCP servers and clients.',
		projects: [
			existing('Node.js CLI Apps Best Practices'),
			{
				name: 'npm Security Best Practices',
				url: 'https://github.com/lirantal/npm-security-best-practices',
				kind: 'Supply chain guidance',
				role: 'Co-author with Juan Picado',
				description:
					'Practical npm security guidance that became the original basis of OWASP’s NPM Security Cheat Sheet.',
			},
			existing('Awesome Node.js Security'),
			{
				name: 'Awesome MCP Best Practices',
				url: 'https://github.com/lirantal/awesome-mcp-best-practices',
				kind: 'MCP guidance',
				role: 'Creator & maintainer',
				description: 'A shared collection of practices for building MCP servers and clients.',
			},
		],
	},
];

export const contributionStories = [
	{
		id: 'nodejs-core',
		title: 'Node.js core security hardening',
		repository: 'nodejs/node',
		role: 'Upstream contributor',
		description:
			'Added a regression test and a fix for incomplete prototype-pollution hardening in child_process. The change covered process-spawning paths missed by earlier hardening.',
		context: 'Merged July 21, 2024.',
		sources: [
			{ label: 'The hardening fix · #53781', url: 'https://github.com/nodejs/node/pull/53781' },
			{ label: 'Build troubleshooting documentation · #53808', url: 'https://github.com/nodejs/node/pull/53808' },
		],
	},
	{
		id: 'security-wg',
		title: 'Node.js Ecosystem Security Working Group',
		repository: 'nodejs/security-wg',
		role: 'Working-group member & vulnerability triage contributor',
		description:
			'I contributed vulnerability records, disclosure processes, bug-bounty guidance, and meeting documentation to the Node.js Foundation’s Ecosystem Security Working Group.',
		context: 'The working-group repository records my addition to the vulnerability triage team on January 5, 2018.',
		sources: [
			{ label: 'Joining the vulnerability triage team · #78', url: 'https://github.com/nodejs/security-wg/pull/78' },
			{ label: 'Responsible disclosure policy template · #99', url: 'https://github.com/nodejs/security-wg/pull/99' },
		],
	},
	{
		id: 'owasp',
		title: 'OWASP NodeGoat & CWE project leadership',
		repository: 'OWASP/NodeGoat',
		role: 'NodeGoat project co-lead · CWE project lead',
		description:
			'I co-lead OWASP NodeGoat and lead OWASP’s CWE command-line tool and JavaScript SDK projects. My NodeGoat contributions include NoSQL injection and regular-expression denial-of-service examples, alongside fixes and documentation.',
		context:
			'The npm security guidance I co-authored with Juan Picado became the original basis of the evolving OWASP NPM Security Cheat Sheet.',
		sources: [
			{ label: 'NodeGoat NoSQL injection example · #81', url: 'https://github.com/OWASP/NodeGoat/pull/81' },
			{ label: 'npm cheat sheet contribution · #705', url: 'https://github.com/OWASP/CheatSheetSeries/pull/705' },
			{ label: 'CWE tool', url: 'https://github.com/OWASP/cwe-tool' },
			{ label: 'CWE JavaScript SDK', url: 'https://github.com/OWASP/cwe-sdk-javascript' },
		],
	},
	{
		id: 'cncf',
		title: 'CNCF supply chain security guidance',
		repository: 'cncf/tag-security',
		role: 'Contributor & supply chain section reviewer',
		description:
			'I contributed to CNCF TAG Security’s supply chain guidance and documented incidents involving Packagist and Ruby.',
		context: 'The repository records my addition as a reviewer for the supply chain security section in 2022.',
		sources: [
			{ label: 'Reviewer contribution · #973', url: 'https://github.com/cncf/tag-security/pull/973' },
			{ label: 'Packagist incident · #1069', url: 'https://github.com/cncf/tag-security/pull/1069' },
		],
	},
	{
		id: 'frameworks',
		title: 'Fastify, Yarn, Pact & Trigger.dev contributions',
		repository: 'fastify/fastify',
		role: 'Upstream contributor',
		description:
			'I contributed a Firebase Functions guide for Fastify, expanded Yarn plugin tutorials, added Pact contract-testing examples, and built an Astro integration for Trigger.dev.',
		sources: [
			{ label: 'Fastify Firebase Functions guide · #5318', url: 'https://github.com/fastify/fastify/pull/5318' },
			{ label: 'Yarn plugin tutorial · #1846', url: 'https://github.com/yarnpkg/berry/pull/1846' },
			{ label: 'Pact matching example · #211', url: 'https://github.com/pact-foundation/pact-js/pull/211' },
			{ label: 'Trigger.dev Astro integration · #354', url: 'https://github.com/triggerdotdev/trigger.dev/pull/354' },
		],
	},
	{
		id: 'maintenance',
		title: 'Co-leading MEAN.js',
		repository: 'meanjs/mean',
		role: 'MEAN.js project co-lead',
		description:
			'I joined MEAN.js as a co-lead, helping maintain a full-stack JavaScript framework that served as a foundation for projects at work and across the open-source community. My contributions included dependency upgrades and Docker development setup.',
		sources: [{ label: 'MEAN.js Docker setup · #1249', url: 'https://github.com/meanjs/mean/pull/1249' }],
	},
	{
		id: 'blessed-contrib',
		title: 'Maintaining blessed-contrib',
		repository: 'yaronn/blessed-contrib',
		role: 'Maintainer & contributor',
		description:
			'I help maintain blessed-contrib, the Node.js terminal dashboard toolkit created by Yaron Naveh. My contributions include dependency fixes, terminal widget behavior, and Node.js version guidance.',
		sources: [
			{ label: 'blessed-contrib widget enhancement · #214', url: 'https://github.com/yaronn/blessed-contrib/pull/214' },
			{ label: 'Supported Node.js version · #233', url: 'https://github.com/yaronn/blessed-contrib/pull/233' },
		],
	},
	{
		id: 'ai',
		title: 'Developer Relations & DX for AI tooling',
		repository: 'snyk/agent-scan',
		role: 'Developer Relations at Snyk · upstream contributor',
		description:
			'Through my Developer Relations work at Snyk, I improved Agent Scan’s support for OpenClaw skills and the Amp client. I also build MCP configuration inspection tools and publish guidance to help developers build and debug MCP servers and clients.',
		sources: [
			{ label: 'Agent Scan client support · #175', url: 'https://github.com/snyk/agent-scan/pull/175' },
			{ label: 'MCP configuration inspection with ls-mcp', url: 'https://github.com/lirantal/ls-mcp' },
			{ label: 'MCP best practices', url: 'https://github.com/lirantal/awesome-mcp-best-practices' },
		],
	},
];

type OpenSourceHighlight = {
	title: string;
	text: string;
	href: string;
	icon?: string;
	textIcon?: string;
	projectURL?: string;
	items?: { text: string; href?: string; icon?: string }[];
};

export const openSourceHighlights: OpenSourceHighlight[] = [
	{
		title: 'Node.js contributions',
		icon: 'mdi:nodejs',
		text: 'A merged fix for child_process prototype-pollution hardening.',
		textIcon: 'tabler:git-merge',
		href: '/open-source/contributions#nodejs-core',
		items: [
			{
				text: 'Member of the Node.js Foundation’s Ecosystem Security Working Group (2018).',
				href: '/open-source/contributions#security-wg',
				icon: 'tabler:users-group',
			},
		],
	},
	{
		title: 'OWASP leadership & guidance',
		icon: 'owasp',
		text: 'Co-authored npm security practices that became the basis of an OWASP cheat sheet.',
		textIcon: 'tabler:book-2',
		href: '/open-source/contributions#owasp',
		items: [
			{
				text: 'Co-lead of the OWASP NodeGoat project.',
				href: '/open-source/contributions#owasp',
				icon: 'tabler:users-group',
			},
		],
	},
	{
		title: 'JavaScript & PHP rankings in Israel',
		icon: 'mdi:language-javascript',
		text:
			ranks.languages
				.filter((language) => ['JavaScript', 'PHP'].includes(language.name))
				.map((language) => `#${language.israel.position} for ${language.name}`)
				.join(' and ') + ` on GitRanks. Profile updated ${dateLabel(ranks.profileUpdatedAt)}.`,
		href: '/open-source/impact#languages',
	},
];

export const openSourceProjectHighlights: OpenSourceHighlight[] = [
	{
		title: 'npq',
		text: 'Check package health and security signals before installing npm dependencies.',
		href: '/open-source/projects#npq',
		projectURL: 'https://github.com/lirantal/npq',
	},
	{
		title: 'dockly',
		text: 'Manage Docker containers, images, networks, and services from an interactive terminal interface.',
		href: '/open-source/projects#dockly',
		projectURL: 'https://github.com/lirantal/dockly',
	},
	{
		title: 'Node.js CLI Apps Best Practices',
		text: 'A shared reference for making command-line applications more reliable and easier to use.',
		href: '/open-source/projects#nodejs-cli-apps-best-practices',
		projectURL: 'https://github.com/lirantal/nodejs-cli-apps-best-practices',
	},
];
