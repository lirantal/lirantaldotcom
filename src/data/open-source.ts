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

// Purpose-led selections, not an inventory of every repository or a freshness claim.
export const projectGroups: { id: string; title: string; description: string; projects: Project[] }[] = [
	{
		id: 'security',
		title: 'Security defenses',
		description: 'Put security checks into the places developers already work: installs, pull requests, and editors.',
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
		description: 'From managing networks to building terminal interfaces and inspecting AI tooling.',
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
		title: 'Shared practices & learning',
		description:
			'Make the lessons reusable, whether they become a team checklist, a community guide, or a security reference.',
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
		title: 'Hardening Node.js core',
		repository: 'nodejs/node',
		role: 'Upstream contributor',
		description:
			'Added a regression test and a fix for incomplete prototype-pollution hardening in child_process. The change covered process-spawning paths missed by earlier hardening.',
		context: 'Merged July 21, 2024. This is defense-in-depth hardening under Node.js’s documented threat model.',
		sources: [
			{ label: 'The hardening fix · #53781', url: 'https://github.com/nodejs/node/pull/53781' },
			{ label: 'Build troubleshooting documentation · #53808', url: 'https://github.com/nodejs/node/pull/53808' },
		],
	},
	{
		id: 'security-wg',
		title: 'Making ecosystem security a shared practice',
		repository: 'nodejs/security-wg',
		role: 'Historical working-group member & vulnerability triage contributor',
		description:
			'Work in the Node.js Security Working Group included vulnerability records, disclosure processes, bug-bounty guidance, and meeting documentation. This was sustained ecosystem work alongside individual fixes.',
		context:
			'Historical work in the working-group repository; this does not imply a current Node.js leadership position.',
		sources: [
			{ label: 'Joining the vulnerability triage team · #78', url: 'https://github.com/nodejs/security-wg/pull/78' },
			{ label: 'Responsible disclosure policy template · #99', url: 'https://github.com/nodejs/security-wg/pull/99' },
		],
	},
	{
		id: 'owasp',
		title: 'Helping developers learn security through OWASP',
		repository: 'OWASP/NodeGoat',
		role: 'NodeGoat project member · CWE project lead',
		description:
			'Contributed intentionally vulnerable examples and fixes to NodeGoat, including NoSQL injection and regular-expression denial of service. My profile also records project leadership for OWASP’s CWE command-line tool and JavaScript SDK.',
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
		title: 'Documenting software supply chain security',
		repository: 'cncf/tag-security',
		role: 'Contributor & supply chain section reviewer',
		description:
			'Contributed to CNCF TAG Security’s supply chain work, including documented incidents involving Packagist and Ruby. Recording the details makes real attacks useful to the next team designing a defense.',
		context: 'The repository records my addition as a reviewer for the supply chain security section in 2022.',
		sources: [
			{ label: 'Reviewer contribution · #973', url: 'https://github.com/cncf/tag-security/pull/973' },
			{ label: 'Packagist incident · #1069', url: 'https://github.com/cncf/tag-security/pull/1069' },
		],
	},
	{
		id: 'frameworks',
		title: 'Improving the tools developers build on',
		repository: 'fastify/fastify',
		role: 'Upstream contributor',
		description:
			'Contributions include a Firebase Functions guide for Fastify, Yarn plugin tutorials, Pact contract-testing examples, and an Astro integration for Trigger.dev. Documentation and working examples are part of making software usable.',
		context: 'Selected contributions across several projects, with the exact changes linked below.',
		sources: [
			{ label: 'Fastify Firebase Functions guide · #5318', url: 'https://github.com/fastify/fastify/pull/5318' },
			{ label: 'Yarn plugin tutorial · #1846', url: 'https://github.com/yarnpkg/berry/pull/1846' },
			{ label: 'Pact matching example · #211', url: 'https://github.com/pact-foundation/pact-js/pull/211' },
			{ label: 'Trigger.dev Astro integration · #354', url: 'https://github.com/triggerdotdev/trigger.dev/pull/354' },
		],
	},
	{
		id: 'maintenance',
		title: 'Doing the maintenance that keeps projects useful',
		repository: 'meanjs/mean',
		role: 'Long-running project contributions',
		description:
			'MEAN.js work spans dependency upgrades and Docker setup. Contributions to blessed-contrib include dependency fixes, terminal widget behavior, and supported-version guidance. Useful software needs this continuing attention.',
		context:
			'These examples describe the recorded work, rather than claiming every project is actively maintained today.',
		sources: [
			{ label: 'MEAN.js Docker setup · #1249', url: 'https://github.com/meanjs/mean/pull/1249' },
			{ label: 'blessed-contrib widget enhancement · #214', url: 'https://github.com/yaronn/blessed-contrib/pull/214' },
			{ label: 'Supported Node.js version · #233', url: 'https://github.com/yaronn/blessed-contrib/pull/233' },
		],
	},
	{
		id: 'ai',
		title: 'Bringing the same approach to AI tooling',
		repository: 'snyk/agent-scan',
		role: 'Contributor · includes work at Snyk',
		description:
			'Contributed OpenClaw skill-path and Amp client support to Agent Scan. Alongside this upstream work, I build MCP inspection tools and share practices for MCP servers, clients, and coding agents.',
		context:
			'Organization contributions can overlap with my professional work. Research papers and benchmark contributions have their own credits in the research area.',
		sources: [
			{ label: 'Agent Scan client support · #175', url: 'https://github.com/snyk/agent-scan/pull/175' },
			{ label: 'AI security research', url: '/research/ai-security' },
			{ label: 'MCP best practices', url: 'https://github.com/lirantal/awesome-mcp-best-practices' },
		],
	},
];

export const openSourceHighlights = [
	{
		title: 'Node.js core',
		text: 'A merged fix for child_process prototype-pollution hardening.',
		href: '/open-source/contributions#nodejs-core',
	},
	{
		title: 'OWASP guidance',
		text: 'Co-authored npm security practices that became the basis of an OWASP cheat sheet.',
		href: '/open-source/contributions#owasp',
	},
	{
		title: 'JavaScript & PHP in Israel',
		text:
			ranks.languages
				.filter((language) => ['JavaScript', 'PHP'].includes(language.name))
				.map((language) => `#${language.israel.position} for ${language.name}`)
				.join(' and ') + ` on GitRanks. Profile updated ${dateLabel(ranks.profileUpdatedAt)}.`,
		href: '/open-source/impact#languages',
	},
];

export const openSourceProjectHighlights = [
	{
		title: 'daloRADIUS',
		text: 'Original creator of a FreeRADIUS management application for networks, hotspots, and ISP deployments.',
		href: '/open-source/projects#tools',
	},
	{
		title: 'blessed-contrib',
		text: 'Helping maintain the terminal dashboard toolkit created by Yaron Naveh, with charts, maps, tables, and more.',
		href: '/open-source/projects#tools',
	},
	{
		title: 'Node.js CLI Apps Best Practices',
		text: 'A shared reference for making command-line applications more reliable and easier to use.',
		href: '/open-source/projects#practices',
	},
];
