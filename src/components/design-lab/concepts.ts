export const concepts = [
	{
		round: 4,
		id: 'prism',
		name: 'Prism',
		subtitle: 'Clear chapters. A quieter identity.',
		description:
			'An evergreen hero, unboxed recognition, and full-width sections. Violet is an accent, not a different colored box for every section.',
		tradeoff: 'The closest evolution of Prism, with complete sections and a more restrained presentation.',
		font: 'Manrope',
		palette: ['#FFFFFF', '#51378B', '#25212F'],
	},
	{
		round: 4,
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
		round: 4,
		id: 'studio',
		name: 'Studio',
		subtitle: 'A photographic personal portfolio.',
		description:
			'An identity-led masthead, a wide stage photograph, and asymmetric sections. The work feels connected to a person.',
		tradeoff: 'A more photographic direction, with slate surfaces and a deep-blue footer.',
		font: 'Manrope',
		palette: ['#FFFFFF', '#174B68', '#EEF3F5'],
	},

	{
		round: 1,
		id: 'fieldnotes',
		name: 'Fieldnotes',
		subtitle: 'A personal research journal',
		description:
			'Serif headlines, forest ink, and an identity rail. The quietest option, with the strongest emphasis on reading.',
		tradeoff: 'Less visual spectacle; more room for the writing.',
		font: 'Newsreader + Inter',
		palette: ['#FAFBF8', '#20352D', '#23664C'],
	},
	{
		round: 1,
		id: 'signal',
		name: 'Signal',
		subtitle: 'A public security workbench',
		description: 'Cobalt, geometric type, and a bold opening. Projects and practical writing share the spotlight.',
		tradeoff: 'More assertive and graphic than the current site.',
		font: 'Space Grotesk + Inter',
		palette: ['#2549DF', '#FFFFFF', '#172447'],
	},
	{
		round: 1,
		id: 'after-hours',
		name: 'After Hours',
		subtitle: 'An author’s personal studio',
		description: 'Deep plum, soft peach, and a photographic opening. A warmer, more personal expression of the work.',
		tradeoff: 'A dark-first direction with a more immersive reading feel.',
		font: 'Manrope + Newsreader',
		palette: ['#211C27', '#F5EFE8', '#FFBD9B'],
	},
] as const;
export const views = ['home', 'writing', 'article'] as const;
export type Concept = (typeof concepts)[number];
export type View = (typeof views)[number];
export const previewURL = (concept: string, view: string = 'home') => `/design-lab/${concept}/${view}`;
