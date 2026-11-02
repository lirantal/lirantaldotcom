import { papers } from './portfolio';
import snapshot from './research-advisories.json';

export { papers };
export const scholarURL = 'https://scholar.google.com/citations?user=J3pv7lMAAAAJ&hl=en';
export const researchAsOf = snapshot.asOf;
export const advisories = snapshot.advisories;
export const advisorySource = snapshot.source;
export const activeAdvisories = advisories.filter((item) => !item.withdrawn);
export const criticalAdvisories = activeAdvisories.filter((item) => item.severity === 'Critical');
export const dateLabel = (date: string) =>
	new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		timeZone: 'UTC',
	});

type Source = { label: string; url: string };
type Section = { title: string; paragraphs: string[]; links?: Source[] };
type Study = {
	slug: string;
	label: string;
	title: string;
	description: string;
	summary: string;
	context: string;
	facts: { label: string; value: string }[];
	sections: Section[];
	sources: Source[];
	related: string[];
};

const lockfileArticle =
	'https://snyk.io/blog/why-npm-lockfiles-can-be-a-security-blindspot-for-injecting-malicious-modules/';
const gitlabResearch =
	'https://gitlab.com/gitlab-com/gl-security/security-operations/redteam/redteam-public/resources/red-team-tech-notes/-/tree/master/blackhat-eu-2021-picking-lockfiles';
const npmArticle = 'https://snyk.io/blog/ten-npm-security-best-practices/';
const owasp = 'https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html';

export const studies: Study[] = [
	{
		slug: 'patents',
		label: 'Patents',
		title: 'Patents & invention.',
		description: 'Co-invented work on bringing application context into software localization and testing.',
		summary: 'A patent application connecting manual testing, screen states, and contextual software localization.',
		context: 'Software engineering · Filed 2013',
		facts: [
			{ label: 'US publication', value: 'US20160139914A1' },
			{ label: 'Filed', value: 'June 24, 2013' },
			{ label: 'Published', value: 'May 19, 2016' },
			{ label: 'Co-inventors', value: 'Elad Levi, Ran Bar Zik, Liran Tal' },
		],
		sections: [
			{
				title: 'Contextual-based localization based on manual testing',
				paragraphs: [
					'Translating an application is easier when the translator can see where a string appears. This invention uses the actions recorded during manual testing to reconstruct application screen states and pair the relevant text with screenshots.',
					'I am named as a co-inventor alongside Elad Levi and Ran Bar Zik. The application was originally assigned to Hewlett-Packard. It reflects an earlier strand of my work: improving software engineering workflows by connecting tools to the context developers and testers already create.',
				],
			},
			{
				title: 'Publication record',
				paragraphs: [
					'The US application was published as US20160139914A1 on May 19, 2016, following a June 24, 2013 filing. Google Patents lists this application as abandoned. This is a published patent application.',
					'The public records linked below include the application text, inventor credits, and publication history.',
				],
			},
		],
		sources: [
			{
				label: 'Application, inventors & publication history · Google Patents',
				url: 'https://patents.google.com/patent/US20160139914A1/en',
			},
			{ label: 'Application text & inventor record · Justia', url: 'https://patents.justia.com/patent/20160139914' },
		],
		related: ['papers', 'supply-chain-security'],
	},
	{
		slug: 'lockfile-injection',
		label: 'Lockfile injection',
		title: 'The lockfile blind spot.',
		description:
			'My 2019 research into malicious dependency sources hidden in npm and Yarn lockfiles, and the defenses and follow-on research it led to.',
		summary: 'Original 2019 research, lockfile-lint, and the GitLab work that extended it at Black Hat Europe 2021.',
		context: 'Software supply chain · 2019 →',
		facts: [
			{ label: 'Original publication', value: 'September 24, 2019' },
			{ label: 'Ecosystems studied', value: 'npm & Yarn' },
			{ label: 'Defensive tool', value: 'lockfile-lint' },
			{ label: 'Follow-on presentation', value: 'Black Hat Europe 2021' },
		],
		sections: [
			{
				title: 'A dependency change hiding in plain sight',
				paragraphs: [
					'In September 2019, I demonstrated how a pull request could redirect a dependency to attacker-controlled code through a lockfile. The package name and version could look familiar while its download source changed beneath the reviewer’s attention.',
					'Large, generated diffs make this kind of change difficult to spot. The research examined how npm and Yarn treat lockfile entries as installation instructions, and why reviewing package.json alone does not establish the trustworthiness of an install.',
				],
				links: [{ label: 'Read the original 2019 research', url: lockfileArticle }],
			},
			{
				title: 'Turning the finding into a defense',
				paragraphs: [
					'I built lockfile-lint to make dependency-source checks repeatable in development and CI. It lets teams enforce policies such as HTTPS and approved registry hosts, so suspicious sources can be flagged automatically.',
					'The tool addresses a particular trust boundary in dependency installation. It complements package review and vulnerability scanning; an allowed registry alone cannot guarantee that a package is safe.',
				],
				links: [{ label: 'Explore lockfile-lint', url: 'https://github.com/lirantal/lockfile-lint' }],
			},
			{
				title: 'From the original finding to Black Hat',
				paragraphs: [
					'GitLab researchers Dennis Appelt and Greg Johnson extended this work for “Picking Lockfiles: Attacking and Defending Your Supply Chain” at Black Hat Europe 2021. Their published notes explicitly credit my initial research.',
					'They explored additional tampering techniques and extended the analysis to Ruby and Go, alongside Node.js. Their work also introduced defensive verification and tooling to automate lockfile tampering for security testing.',
				],
				links: [
					{ label: 'Read GitLab’s research & acknowledgement', url: gitlabResearch },
					{ label: 'Watch the Black Hat presentation', url: 'https://www.youtube.com/watch?v=UkWJeqb8BZk' },
				],
			},
		],
		sources: [
			{ label: 'Original research · Liran Tal, Snyk, 2019', url: lockfileArticle },
			{ label: 'Black Hat EU 2021 research · Dennis Appelt & Greg Johnson, GitLab', url: gitlabResearch },
			{ label: 'Defensive implementation · lockfile-lint', url: 'https://github.com/lirantal/lockfile-lint' },
		],
		related: ['npm-security', 'supply-chain-security'],
	},
	{
		slug: 'npm-security',
		label: 'npm security',
		title: 'Research into everyday practice.',
		description:
			'The npm security guidance I co-authored became the original basis of OWASP’s npm security cheat sheet.',
		summary: 'The original npm security best practices, their adoption by OWASP, and ongoing package-manager guidance.',
		context: 'Developer security guidance · 2019 →',
		facts: [
			{ label: 'Original article', value: 'February 19, 2019' },
			{ label: 'Co-authors', value: 'Liran Tal & Juan Picado' },
			{ label: 'Adopted by', value: 'OWASP Cheat Sheet Series' },
		],
		sections: [
			{
				title: 'The original npm security best practices',
				paragraphs: [
					'Juan Picado and I published “10 npm Security Best Practices” on the Snyk blog in February 2019. We brought package publishing, installation behavior, dependency health, and account protection into a practical guide for JavaScript developers.',
					'The work connects common development decisions to security consequences: what enters a published tarball, when install scripts execute, and how dependency changes reach a build.',
				],
				links: [{ label: 'Read the co-authored original', url: npmArticle }],
			},
			{
				title: 'Adoption by OWASP',
				paragraphs: [
					'The introduction to OWASP’s NPM Security Cheat Sheet states that its list was originally based on that Snyk article. This provides a direct trail from the original guidance to a community-maintained security reference.',
					'The OWASP document has continued to evolve with contributions from its community. The original guidance is one contribution to that evolving community resource.',
				],
				links: [{ label: 'Read the OWASP cheat sheet & original attribution', url: owasp }],
			},
			{
				title: 'Continuing the work',
				paragraphs: [
					'I maintain npm-security-best-practices as a practical resource for package-manager security. It covers installation policies, dependency sources, release cooldowns, publishing trust, and safer local development.',
					'This sits alongside my lockfile injection research and tools such as lockfile-lint and npq: research findings translated into checks developers can use in their own workflows.',
				],
				links: [
					{
						label: 'Explore npm-security-best-practices',
						url: 'https://github.com/lirantal/npm-security-best-practices',
					},
				],
			},
		],
		sources: [
			{ label: '10 npm Security Best Practices · Liran Tal & Juan Picado, 2019', url: npmArticle },
			{ label: 'NPM Security Cheat Sheet · OWASP', url: owasp },
			{
				label: 'Maintained guidance · npm-security-best-practices',
				url: 'https://github.com/lirantal/npm-security-best-practices',
			},
		],
		related: ['lockfile-injection', 'advisories'],
	},
	{
		slug: 'ai-security',
		label: 'AI & agents',
		title: 'Following the agent’s trust.',
		description:
			'Research on agent skills, MCP servers, and the reliability of AI-assisted security review and remediation.',
		summary: 'Agent skill ecosystem threats, MCP vulnerability disclosures, and benchmarks for AI security tools.',
		context: 'AI & agentic security · 2025 →',
		facts: [
			{ label: 'Research areas', value: 'Agent skills, MCP & security evaluation' },
			{ label: 'Publication type', value: 'Co-authored arXiv preprints' },
		],
		sections: [
			{
				title: 'Agent skills as a supply chain',
				paragraphs: [
					'Agent skills introduce instructions and executable resources into an assistant’s workflow. In our co-authored technical report, we examined 3,984 skills and documented security issues in this emerging ecosystem, including malicious content and risks to credentials.',
					'The work applies software supply-chain thinking to the resources an agent discovers and trusts. The report is available as an arXiv preprint, with its full author list on the papers page.',
				],
				links: [{ label: 'Read the agent skill ecosystem report', url: 'https://arxiv.org/abs/2605.28588' }],
			},
			{
				title: 'MCP servers and tool boundaries',
				paragraphs: [
					'My credited disclosures include command injection in MCP tools, path traversal, information exposure, and authorization failures. These findings examine what happens when model-driven requests reach shells, filesystems, or databases.',
					'Examples include adb-mcp command injection (CVE-2025-59834) and a read-only-mode bypass in Apache Doris MCP Server (CVE-2025-58337). Each entry links to the public advisory so readers can inspect the affected versions, credits, and remediation details.',
				],
				links: [
					{ label: 'adb-mcp disclosure', url: 'https://github.com/advisories/GHSA-54j7-grvr-9xwg' },
					{ label: 'Apache Doris MCP disclosure', url: 'https://github.com/advisories/GHSA-m35w-xx8c-6xc7' },
				],
			},
			{
				title: 'Measuring AI security work',
				paragraphs: [
					'In Snyk VulnBench JS 1.0, we studied whether repeated LLM reviews of the same JavaScript code produce consistent vulnerability findings. The benchmark focuses on repeatability, an important dimension of whether a security workflow can be relied on.',
					'VulnBump examines a complementary question: can an agent upgrade vulnerable dependencies while preserving a working project? Its tasks verify dependency resolution, vulnerability fixes, builds, and tests together. Both studies are co-authored preprints.',
				],
				links: [
					{ label: 'Snyk VulnBench JS 1.0', url: 'https://arxiv.org/abs/2606.15762' },
					{ label: 'VulnBump', url: 'https://arxiv.org/abs/2610.17374' },
				],
			},
		],
		sources: [
			{ label: 'Agent skill ecosystem report · arXiv', url: 'https://arxiv.org/abs/2605.28588' },
			{ label: 'Snyk VulnBench JS 1.0 · arXiv', url: 'https://arxiv.org/abs/2606.15762' },
			{ label: 'VulnBump · arXiv', url: 'https://arxiv.org/abs/2610.17374' },
			{ label: 'Public vulnerability credits · GitHub', url: advisorySource },
		],
		related: ['papers', 'advisories'],
	},
	{
		slug: 'supply-chain-security',
		label: 'Supply chain',
		title: 'Tracing trust through the supply chain.',
		description:
			'Incident analysis and open-source defenses for the dependencies, source code, and development tools that applications trust.',
		summary:
			'The event-stream post-mortem, source-code defenses, and tools that turn research into development safeguards.',
		context: 'Incident analysis & defensive tooling · 2018 →',
		facts: [
			{ label: 'Research approaches', value: 'Incident analysis & defensive tools' },
			{ label: 'Focus', value: 'npm, source review & developer workflows' },
		],
		sections: [
			{
				title: 'The event-stream backdoor',
				paragraphs: [
					'Danny Grander and I co-authored a December 2018 post-mortem of the event-stream compromise. We traced the addition of the malicious flatmap-stream dependency and its targeting of the Copay cryptocurrency wallet.',
					'The analysis connects maintainer trust, dependency changes, and a targeted payload. It builds on the wider community’s investigation and credits the people who helped reverse engineer the incident.',
				],
				links: [
					{
						label: 'Read the co-authored event-stream post-mortem',
						url: 'https://snyk.io/blog/a-post-mortem-of-the-malicious-event-stream-backdoor/',
					},
				],
			},
			{
				title: 'Defending source-code review',
				paragraphs: [
					'I maintain anti-trojan-source to detect Unicode patterns that can conceal malicious intent in source code. Its checks help surface content that can look different to a reviewer than it behaves to a compiler or interpreter.',
					'The tool implements defenses for the Trojan Source attack class. The repository documents its supported checks and integrations.',
				],
				links: [{ label: 'Explore anti-trojan-source', url: 'https://github.com/lirantal/anti-trojan-source' }],
			},
			{
				title: 'Checks where dependencies enter',
				paragraphs: [
					'lockfile-lint and npq bring security checks closer to dependency installation and review. lockfile-lint validates dependency sources against project policies; npq exposes package-health and security signals before an install.',
					'The same trust questions now reach agent skills and MCP tools. My recent AI security research follows that transition from conventional dependency chains to the resources and capabilities an agent can acquire.',
				],
				links: [
					{ label: 'lockfile-lint', url: 'https://github.com/lirantal/lockfile-lint' },
					{ label: 'npq', url: 'https://github.com/lirantal/npq' },
				],
			},
		],
		sources: [
			{
				label: 'event-stream post-mortem · Danny Grander & Liran Tal, 2018',
				url: 'https://snyk.io/blog/a-post-mortem-of-the-malicious-event-stream-backdoor/',
			},
			{ label: 'Source-code defenses · anti-trojan-source', url: 'https://github.com/lirantal/anti-trojan-source' },
			{ label: 'Package installation checks · npq', url: 'https://github.com/lirantal/npq' },
			{ label: 'Original lockfile injection research · Snyk, 2019', url: lockfileArticle },
		],
		related: ['lockfile-injection', 'ai-security'],
	},
];

export const researchPages = [
	{
		slug: 'papers',
		label: 'Papers',
		context: 'Co-authored preprints',
		summary: 'Research on agent skills, the repeatability of AI security review, and vulnerability remediation.',
	},
	{
		slug: 'reports',
		label: 'Reports & chapters',
		context: 'Industry research · 2019 & 2022',
		summary: 'Contributions to HTTP Archive’s Web Almanac and Snyk’s State of Open Source Security report.',
	},
	studies[0],
	{
		slug: 'advisories',
		label: 'CVEs & advisories',
		context: 'Coordinated vulnerability disclosure',
		summary: 'Publicly credited disclosures across developer tooling, web packages, runtimes, and MCP servers.',
	},
	...studies.slice(1),
];
