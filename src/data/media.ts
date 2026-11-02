export type MediaEntry = {
	id: string;
	title: string;
	originalTitle?: string;
	outlet: string;
	date?: string;
	language: 'English' | 'Hebrew' | 'French';
	section: 'news' | 'interviews' | 'cited';
	role: string;
	url: string;
	description: string;
	disclosure?: string;
	featured?: number;
};

// Curated from the linked articles, checked November 1–2, 2026.
// Featured ranks are editorial: established outlets precede community blogs.
// Missing publication dates stay omitted rather than being inferred from incident dates.
export const mediaEntries: MediaEntry[] = [
	{
		id: 'new-stack-agent-security',
		title: 'Kubernetes just formed a workload conformance group. Here’s why it matters for AI teams.',
		outlet: 'The New Stack',
		date: '2026-10-30',
		language: 'English',
		section: 'news',
		role: 'Talk featured',
		url: 'https://thenewstack.io/kubernetes-workload-conformance-ai/',
		description:
			'Bill Doerrfeld highlights my AGNTCon + MCPCon talk on malicious agent skills and practical defenses against agents installing malware.',
		disclosure: 'HPE sponsored this article.',
		featured: 4,
	},
	{
		id: 'themarker-ai-coding',
		title: 'A young entrepreneur let AI code for him. Hackers had a field day on his website',
		originalTitle: 'יזם צעיר נתן ל-AI לתכנת במקומו. האקרים חגגו על האתר שלו',
		outlet: 'TheMarker',
		date: '2025-03-20',
		language: 'Hebrew',
		section: 'news',
		role: 'Quoted & mentioned',
		url: 'https://www.themarker.com/captain-internet/2025-03-20/ty-article/.premium/00000195-b30c-de74-add7-bb1fba850000',
		description:
			'Ran Bar-Zik quotes and mentions me in his reporting on AI-assisted coding and the security risks facing inexperienced developers.',
		featured: 2,
	},
	{
		id: 'dark-reading-node-ipc',
		title: 'Code-Sabotage Incident in Protest of Ukraine War Exposed Open Source Risks',
		outlet: 'Dark Reading',
		date: '2022-03-18',
		language: 'English',
		section: 'news',
		role: 'Expert commentary',
		url: 'https://www.darkreading.com/application-security/recent-code-sabotage-incident-latest-to-highlight-code-dependency-risks',
		description:
			'Comments to Dark Reading and quotations from my research on node-ipc sabotage and the risks of transitive dependencies.',
		featured: 1,
	},
	{
		id: 'geektime-node-ipc',
		title: 'Israeli researcher uncovers malicious code in a popular open-source package',
		originalTitle: 'ישראלי גילה חבילת קוד פתוח פופולרית עם הפתעה לא נעימה למפתחים ברוסיה',
		outlet: 'Geektime',
		date: '2022-03-20',
		language: 'Hebrew',
		section: 'news',
		role: 'Research featured',
		url: 'https://www.geektime.co.il/a-developer-left-a-nasty-surprise-in-popular-npm-package/',
		description:
			'Coverage of my node-ipc investigation, including its destructive behavior and the implications for software supply chain security.',
		featured: 3,
	},
	{
		id: 'computing-node-ipc',
		title: 'Open source dev sabotages own library to target Russian and Belarusian users',
		outlet: 'Computing',
		language: 'English',
		section: 'news',
		role: 'Research quoted',
		url: 'https://www.computing.co.uk/news/4046716/open-source-dev-sabotages-library-target-russian-belarusian-users',
		description:
			'Quotes my published analysis of the node-ipc supply chain incident and the trust placed in open-source maintainers.',
	},
	{
		id: 'siliconangle-shift-left',
		title: 'How Snyk’s approach to application security remedies shift-left shortcomings',
		outlet: 'SiliconANGLE / theCUBE',
		date: '2022-01-17',
		language: 'English',
		section: 'interviews',
		role: 'Video interview',
		url: 'https://siliconangle.com/2022/01/17/snyks-approach-application-security-remedies-shift-left-shortcomings-awsshowcases2e1/',
		description:
			'A conversation with Lisa Martin about developer security, shift-left practices, and integrating security into development workflows.',
		disclosure: 'Snyk sponsored this theCUBE segment; the publisher states sponsors had no editorial control.',
	},
	{
		id: 'developer-avocados',
		title: 'Liran Tal — Adventcado 2021',
		outlet: 'Developer Avocados',
		date: '2021-12-12',
		language: 'English',
		section: 'interviews',
		role: 'Written interview',
		url: 'https://avocados.dev/adventcado/2021/12/12/liran-tal/',
		description:
			'A discussion of developer advocacy, security education, community, and the path from engineering into Developer Relations.',
	},
	{
		id: 'survivejs-secure-coding',
		title: 'Secure Coding — Interview with Liran Tal',
		outlet: 'SurviveJS',
		date: '2019-07-31',
		language: 'English',
		section: 'interviews',
		role: 'Written interview',
		url: 'https://survivejs.com/blog/secure-coding-interview/',
		description: 'An interview with Juho Vepsäläinen about secure coding, developer education, and security tooling.',
	},
	{
		id: 'fsm-daloradius',
		title: 'Interview with Liran Tal, author of daloRADIUS',
		outlet: 'Free Software Magazine',
		date: '2008-06-23',
		language: 'English',
		section: 'interviews',
		role: 'Written interview',
		url: 'https://freesoftwaremagazine.com/articles/interview_liran_tal_author_daloradius/',
		description:
			'An interview with Tony Mobily about creating daloRADIUS, its early development, and the open-source community supporting it.',
	},
	{
		id: 'safeguard-vulnbench',
		title: 'Can an LLM find the same bug twice? What repeatability benchmarking reveals',
		outlet: 'Safeguard',
		date: '2026-07-07',
		language: 'English',
		section: 'cited',
		role: 'Research cited',
		url: 'https://safeguard.sh/resources/blog/llm-code-review-repeatability-vulnerability-benchmarking',
		description:
			'Safeguard’s research team discusses our co-authored Snyk VulnBench JS 1.0 benchmark on the repeatability of LLM vulnerability scanning and mentions me by name.',
	},
	{
		id: 'cramhacks-lifecycle-scripts',
		title: "Lessons Learned from 2024's Supply Chain Attacks",
		outlet: 'CramHacks',
		date: '2025-02-27',
		language: 'English',
		section: 'cited',
		role: 'Guidance cited',
		url: 'https://www.cramhacks.com/p/lessons-learned-from-2024-s-supply-chain-attacks',
		description:
			'Kyle Kelly cites my npm ignore-scripts guidance when discussing lifecycle-script risks and defenses against software supply chain attacks.',
	},
	{
		id: 'internet-israel-frontend',
		title: 'Security information every frontend developer should know',
		originalTitle: 'מידע על אבטחה שכל מפתח צד לקוח צריך להכיר',
		outlet: 'Internet Israel',
		date: '2024-11-10',
		language: 'Hebrew',
		section: 'cited',
		role: 'Tool & talk recommended',
		url: 'https://internet-israel.com/פיתוח-אינטרנט/בניית-אתרי-אינטרנט-למפתחים/מידע-על-אבטחה-שכל-מפתח-צד-לקוח-צריך-להכי/',
		description: 'Recommends my npq tool and includes my talk on AI and secure code among further learning resources.',
	},
	{
		id: 'internet-israel-colors-faker',
		title: 'A developer deliberately sabotaged his popular npm package',
		originalTitle: 'מפתח הכניס באג מכוון בחבילת ה-npm הפופולרית שלו',
		outlet: 'Internet Israel',
		date: '2022-01-09',
		language: 'Hebrew',
		section: 'cited',
		role: 'Information & screenshot credited',
		url: 'https://internet-israel.com/חדשות-אינטרנט/מפתח-הכניס-באג-מכוון-בחבילת-ה-npm-הפופולר/',
		description:
			'Credits me for the initial information and a screenshot used in coverage of the colors/faker incident.',
	},
	{
		id: 'btao-npm-trust',
		title: 'A web of trust for npm',
		outlet: 'Tao Bojlén',
		date: '2020-10-02',
		language: 'English',
		section: 'cited',
		role: 'Tool cited',
		url: 'https://btao.org/posts/2020-10-02-npm-trust/',
		description:
			'Cites my npq tool as an example of checking packages before installation while exploring trust relationships among npm maintainers.',
	},
	{
		id: 'internet-israel-shrinkwrap',
		title: 'npm-shrinkwrap for version pinning',
		originalTitle: 'npm-shrinkwrap ככלי לנעילת גרסאות',
		outlet: 'Internet Israel',
		date: '2020-05-17',
		language: 'Hebrew',
		section: 'cited',
		role: 'Analysis cited',
		url: 'https://internet-israel.com/מדריכים/node-js-מדריכים/npm-shrinkwrap-ככלי-לנעילת-גרסאות/',
		description: 'References my analysis of the is-promise incident to explain why dependency version pinning matters.',
	},
	{
		id: 'ostechnix-npq',
		title: 'How To Safely Install Packages Using Npm Or Yarn On Linux',
		outlet: 'OSTechNix',
		date: '2019-12-20',
		language: 'English',
		section: 'cited',
		role: 'Tool featured',
		url: 'https://ostechnix.com/how-to-safely-install-packages-using-npm-or-yarn-on-linux/',
		description:
			'Senthilkumar Palani (SK) walks through installing and using npq to inspect npm packages before handing installation over to npm or Yarn.',
	},
	{
		id: 'internet-israel-website',
		title: 'A tool for checking the security of a website’s client-side libraries',
		originalTitle: 'מודול לבדיקת אבטחה של ספריות צד לקוח של אתר',
		outlet: 'Internet Israel',
		date: '2019-11-24',
		language: 'Hebrew',
		section: 'cited',
		role: 'Tool featured',
		url: 'https://internet-israel.com/פיתוח-אינטרנט/בניית-אתרי-אינטרנט-למפתחים/מודול-לבדיקת-אבטחה-של-ספריות-צד-לקוח-של/',
		description:
			'A walkthrough of my is-website-vulnerable command-line tool for identifying vulnerable JavaScript libraries on websites.',
	},
	{
		id: 'internet-israel-exec',
		title: 'Avoid child_process.exec when running commands in Node.js',
		originalTitle: 'אל תשתמשו ב-child_process.exec כדי להריץ פקודות ב-node שלכם',
		outlet: 'Internet Israel',
		date: '2017-10-29',
		language: 'Hebrew',
		section: 'cited',
		role: 'Security guidance credited',
		url: 'https://internet-israel.com/פיתוח-אינטרנט/בניית-אתרי-אינטרנט-למפתחים/אל-תשתמשו-ב-child_process-exec-כדי-להריץ-פקודות-ב-node-שלכם/',
		description:
			'Credits my review for flagging a potential security issue in branch-lint and motivating safer command execution practices.',
	},
	{
		id: 'gentilhomme-nodejs-book',
		title: 'Become a Node.js Developer',
		outlet: 'Thomas Gentilhomme',
		language: 'French',
		section: 'cited',
		role: 'Tool referenced in book',
		url: 'https://docs.google.com/document/d/1JHgmEFkc8Py4XSuCB8_DQ5FFEJoogyeninFK6ucTd4o/edit?tab=t.0#heading=h.7urhd3dh4541',
		description:
			'My npq tool is referenced in Thomas Gentilhomme’s French-language Node.js book, as recorded in the project’s media coverage references.',
	},
];

export const featuredMedia = mediaEntries
	.filter((entry) => entry.featured !== undefined)
	.sort((a, b) => a.featured! - b.featured!);

export const mediaSections = [
	{ id: 'news', title: 'In the news', description: 'Reporting on my research and commentary on software security.' },
	{
		id: 'interviews',
		title: 'Interviews',
		description: 'Conversations about security, developer advocacy, and open source.',
	},
	{
		id: 'cited',
		title: 'Work cited & featured',
		description: 'Tools, analysis, and guidance referenced by the developer community.',
	},
] as const;
