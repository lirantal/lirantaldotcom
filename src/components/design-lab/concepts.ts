export const concepts = [
	{
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
		id: 'signal',
		name: 'Signal',
		subtitle: 'A public security workbench',
		description: 'Cobalt, geometric type, and a bold opening. Projects and practical writing share the spotlight.',
		tradeoff: 'More assertive and graphic than the current site.',
		font: 'Space Grotesk + Inter',
		palette: ['#2549DF', '#FFFFFF', '#172447'],
	},
	{
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
