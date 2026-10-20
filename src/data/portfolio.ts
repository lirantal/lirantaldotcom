import codeInjection from '~/assets/images/code-injection-book-cover-light.png';
import commandInjection from '~/assets/images/command-injection-book-cover-light.png';
import pathTraversal from '~/assets/images/path-traversal-book-cover-light.png';
import headers from '~/assets/images/book-cover-web-security-learning-http-security-headers.png';
import serverless from '~/assets/images/book-cover-serverless-security.jpeg';

// Curated selections, not exhaustive publication or contribution lists.
export const papers = [
	{
		title: 'Snyk VulnBench JS 1.0: Can LLMs Find the Same Bugs Twice?',
		id: '2606.15762',
		date: 'June 2026',
		authors: 'Liran Tal, Johannes Kloos, Arsenii Rudich, Stephen Thoemmes, and Manoj Nair',
		description:
			'Repeated vulnerability scans on JavaScript code explore the consistency of LLM security review and how it complements deterministic static analysis.',
	},
	{
		title: 'Technical Report: Exploring the Emerging Threats of the Agent Skill Ecosystem',
		id: '2605.28588',
		date: 'May 2026',
		authors:
			'Luca Beurer-Kellner, Aleksei Kudrinskii, Marco Milanta, Kristian Bonde Nielsen, Hemang Sarkar, and Liran Tal',
		description:
			'An analysis of 3,984 agent skills, documenting malicious payloads, credential theft, and the security risks of emerging skill marketplaces.',
	},
];

export const projects = [
	{
		name: 'lockfile-lint',
		npm: 'lockfile-lint',
		kind: 'Supply chain security',
		description: 'Lint lockfiles for trusted registries and protect against lockfile injection.',
		url: 'https://github.com/lirantal/lockfile-lint',
	},
	{
		name: 'npq',
		npm: 'npq',
		kind: 'Developer tooling',
		description: 'Check package health and security signals before installing npm dependencies.',
		url: 'https://github.com/lirantal/npq',
	},
	{
		name: 'dockly',
		npm: 'dockly',
		kind: 'Developer tooling',
		description: 'An interactive terminal interface for managing Docker containers and services.',
		url: 'https://github.com/lirantal/dockly',
	},
	{
		name: 'anti-trojan-source',
		npm: 'anti-trojan-source',
		kind: 'Code security',
		description: 'Detect bidirectional Unicode characters used to disguise malicious source code.',
		url: 'https://github.com/lirantal/anti-trojan-source',
	},
	{
		name: 'Node.js CLI Apps Best Practices',
		npm: undefined,
		kind: 'Community guide',
		description: 'A practical guide to building thoughtful, accessible, and reliable command-line applications.',
		url: 'https://github.com/lirantal/nodejs-cli-apps-best-practices',
	},
	{
		name: 'Awesome Node.js Security',
		npm: undefined,
		kind: 'Curated resources',
		description: 'Security resources, tools, and learning material for the Node.js ecosystem.',
		url: 'https://github.com/lirantal/awesome-nodejs-security',
	},
];

export const books = [
	{
		title: 'Mitigate and Weaponize Code Injection Vulnerabilities',
		series: 'Node.js Secure Coding',
		image: codeInjection,
		url: 'https://www.nodejs-security.com/book/code-injection',
	},
	{
		title: 'Defending Against Command Injection',
		series: 'Node.js Secure Coding',
		image: commandInjection,
		url: 'https://www.nodejs-security.com/book/command-injection',
	},
	{
		title: 'Prevention and Exploitation of Path Traversal',
		series: 'Node.js Secure Coding',
		image: pathTraversal,
		url: 'https://www.nodejs-security.com/book/path-traversal',
	},
	{
		title: 'Web Security: Learning HTTP Security Headers',
		series: 'Practical web security',
		image: headers,
		url: 'https://nodejs-security.lemonsqueezy.com/checkout/buy/3e91088f-cbb8-41a0-9c3a-5d60233f6f7b',
	},
	{
		title: 'Serverless Security',
		series: 'Co-author · O’Reilly',
		image: serverless,
		url: 'https://www.oreilly.com/library/view/serverless-security/9781492082538/',
	},
];

export const publications = [
	{
		name: 'Here on lirantal.com',
		description: 'Research write-ups, developer tools, and things I learn along the way.',
		url: '/blog',
		label: 'Browse the blog',
	},
	{
		name: 'Node.js Security',
		description: 'Vulnerability deep dives and practical secure coding for JavaScript developers.',
		url: 'https://www.nodejs-security.com/blog',
		label: 'Read Node.js Security',
	},
	{
		name: 'Snyk',
		description: 'Articles and research on AI security, application security, and the software supply chain.',
		url: 'https://snyk.io/contributors/liran-tal/',
		label: 'Browse my Snyk articles',
	},
];

export const externalWriting = [
	{
		title: 'Building Secure MCP Servers: A Developer’s Guide to Avoiding Critical Vulnerabilities',
		publication: 'Snyk Articles',
		date: 'January 2026',
		url: 'https://snyk.io/articles/building-secure-mcp-servers/',
		description: 'Command injection, path traversal, and the pitfalls of read-only database access in MCP servers.',
	},
	{
		title: 'Argument Injection vulnerability in git-blame@1.4.0',
		publication: 'Node.js Security',
		date: 'November 2025',
		url: 'https://www.nodejs-security.com/blog/argument-injection-vulnerability-in-git-blame-1-4-0',
		description: 'How an unsanitized revision parameter becomes a command execution risk in a Git wrapper.',
	},
	{
		title: 'Cursor IDE Malware Extension Compromise in $500k Crypto Heist',
		publication: 'Snyk Blog',
		date: 'July 2025',
		url: 'https://snyk.io/blog/cursor-ide-malware-extension-compromise-in-usd500k-crypto-heist/',
		description: 'A look at malicious extensions and the trust developers place in their tools.',
	},
];

export const shortBio =
	'Liran Tal is an AI security researcher, open-source maintainer, and author of books on Node.js security. A GitHub Star and recipient of the OpenJS Foundation’s Pathfinder for Security award, he leads Developer Relations at Snyk and helps developers build more secure software.';
