import { createHash } from 'node:crypto';
import { fetchPosts } from './posts';
import { getPermalink } from './permalinks';
import { getSpeaking, formatDate } from './speaking';
import { papers, studies } from '~/data/research';

export type SocialCard = {
	key: string;
	paths?: string[];
	section: string;
	title: string;
	detail?: string;
	credits?: string;
};

// Bump when changing the renderer, portrait, or fonts to refresh social crawler caches.
export const SOCIAL_CARD_VERSION = 'forma-1';
export const SOCIAL_CARD_WIDTH = 1200;
export const SOCIAL_CARD_HEIGHT = 630;

export function socialCardSlug(card: SocialCard) {
	const hash = createHash('sha256')
		.update(JSON.stringify([SOCIAL_CARD_VERSION, card]))
		.digest('hex')
		.slice(0, 12);
	return `${card.key}-${hash}`;
}

let cardsPromise: Promise<SocialCard[]>;

export function getSocialCards() {
	return (cardsPromise ??= loadSocialCards());
}

async function loadSocialCards(): Promise<SocialCard[]> {
	const [posts, speaking] = await Promise.all([fetchPosts(), getSpeaking()]);
	const cards: SocialCard[] = [
		{
			key: 'home',
			paths: ['/'],
			section: '',
			title: 'Securing the\nagentic future.',
			detail: 'Developer advocacy, open source,\nand security research.',
		},
		{
			key: 'blog',
			paths: ['/writing', '/blog'],
			section: 'Blog',
			title: 'Writing for the\ndeveloper community.',
			detail: 'Developer advocacy, open source, and security.',
		},
		{
			key: 'speaking',
			paths: ['/speaking'],
			section: 'Speaking',
			title: 'Ideas for the\ndeveloper community.',
			detail: 'Keynotes, workshops & conversations.',
		},
		{
			key: 'research',
			paths: ['/research'],
			section: 'Research',
			title: 'Researching emerging\nthreats. Building\nopen-source defenses.',
			detail: 'AI agents and software supply chain security.',
		},
		{
			key: 'papers',
			paths: ['/research/papers'],
			section: 'Research / Preprints',
			title: 'Research papers.',
			detail: 'Co-authored preprints on AI agents and software security.',
		},
		{
			key: 'reports',
			paths: ['/research/reports'],
			section: 'Research / Reports',
			title: 'Research reports.',
			detail: 'Contributions to industry reports and web security research.',
		},
		{
			key: 'advisories',
			paths: ['/research/advisories'],
			section: 'Research / Advisories',
			title: 'Security advisories.',
			detail: 'Vulnerability disclosures and open-source defenses.',
		},
		{
			key: 'media',
			paths: ['/media'],
			section: 'Media',
			title: 'In the media.',
			detail: 'Developer advocacy, open source, and security research.',
		},
		{
			key: 'hire-me',
			paths: ['/hire-me'],
			section: 'Work with me',
			title: 'Developer advocacy.\nOpen source.\nSecurity research.',
		},
		{
			key: 'books',
			paths: ['/books/nodejs-secure-coding'],
			section: 'Books',
			title: 'Node.js Secure Coding',
			detail: 'Practical security education for developers.',
		},
		{
			key: 'recognitions',
			paths: ['/recognitions'],
			section: 'Recognitions',
			title: 'Community &\nrecognition.',
			detail: 'Developer advocacy, open source, and security.',
		},
	];
	for (const [slug, label] of Object.entries({
		talks: 'Talks',
		events: 'Events',
		recordings: 'Recordings',
		podcasts: 'Podcasts',
		'press-kit': 'Bio & press kit',
	})) {
		cards.push({
			key: `speaking/${slug}`,
			paths: [`/speaking/${slug}`],
			section: `Speaking / ${label}`,
			title: label === 'Bio & press kit' ? 'Liran Tal' : label,
			detail: 'Developer advocacy, open source, and security.',
		});
	}
	for (const post of posts) {
		cards.push({
			key: `blog/${post.slug ? getPermalink(post.slug, 'post').split('/').pop() : post.id}`,
			paths: [getPermalink(post.slug, 'post')],
			section: 'Blog / Article',
			title: post.title,
			detail: post.category || '',
		});
	}
	for (const talk of speaking.talks) {
		cards.push({
			key: `talks/${talk.slug}`,
			paths: [talk.href],
			section: 'Speaking / Talk',
			title: talk.title,
			detail: talk.topic.label,
		});
	}
	for (const event of speaking.events) {
		cards.push({
			key: `events/${event.slug}`,
			paths: [event.href],
			section: `Speaking / ${event.type === 'podcast' ? 'Podcast' : 'Event'}`,
			title: event.title || event.name,
			detail: `${event.name} · ${formatDate(event.date, 'monthYear')}`,
		});
	}
	for (const study of studies) {
		cards.push({
			key: `research/${study.slug}`,
			paths: [`/research/${study.slug}`],
			section: 'Research',
			title: study.title,
			detail: study.context,
		});
	}
	// Papers link to arXiv, whose metadata we cannot change. Export reusable local cards for each paper.
	for (const paper of papers) {
		cards.push({
			key: `papers/${paper.id}`,
			section: 'Research / Preprint',
			title: paper.title,
			credits: paper.authors,
			detail: `arXiv:${paper.id} · ${paper.date}`,
		});
	}
	return cards;
}

export async function getSocialImage(pathname: string) {
	const path = decodeURI(pathname).replace(/\/$/, '') || '/';
	const cards = await getSocialCards();
	const fallback = /^\/(blog|tag|category)(\/|$)/.test(path)
		? 'blog'
		: path.startsWith('/speaking/')
			? 'speaking'
			: path.startsWith('/research/')
				? 'research'
				: 'home';
	const card = cards.find((card) => card.paths?.includes(path)) || cards.find((card) => card.key === fallback)!;
	return {
		src: `/og/${socialCardSlug(card)}.png`,
		width: SOCIAL_CARD_WIDTH,
		height: SOCIAL_CARD_HEIGHT,
		alt: `${card.title.replace(/\n/g, ' ')} — Liran Tal, Developer Relations & Security Research`,
	};
}
