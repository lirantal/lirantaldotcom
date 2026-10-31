export const concepts = [
	{
		round: 5,
		id: 'forma',
		name: 'Forma',
		subtitle: 'A precise technical portfolio.',
		description:
			'A centered introduction, monochrome buttons, and deliberately framed research. Informed by the clarity of shadcn and Vercel.',
		tradeoff: 'A more systematic, minimal direction, with image-led Blog cards and a dark closing section.',
		font: 'Inter',
		palette: ['#FFFFFF', '#171717', '#F7F7F7'],
	},
	{
		round: 5,
		id: 'forma-refined',
		name: 'Forma Refined',
		subtitle: 'Forma, shaped by your annotations.',
		description:
			'Forma’s typography, menu, research, and reading views with an asymmetric hero, transparent portrait, compact recognition, and tighter projects.',
		tradeoff: 'One new proposal alongside the unchanged Forma baseline.',
		font: 'Inter',
		palette: ['#FFFFFF', '#171717', '#F7F7F7'],
	},
] as const;
export const views = ['home', 'writing', 'article'] as const;
export type Concept = (typeof concepts)[number];
export type View = (typeof views)[number];
export const previewURL = (concept: string, view: string = 'home') => `/design-lab/${concept}/${view}`;
