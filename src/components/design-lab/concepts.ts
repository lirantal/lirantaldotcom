export const concepts = [
	{
		round: 2,
		id: 'prism',
		name: 'Prism',
		subtitle: 'Layered, personal, composed',
		description: 'A lilac canvas, layered photography, and a compact mix of writing, tools, and research.',
		tradeoff: 'The most expressive composition, with a quieter reading view.',
		font: 'Manrope',
		palette: ['#F5F3FB', '#6242B5', '#27213B'],
	},
	{
		round: 2,
		id: 'atlas',
		name: 'Atlas',
		subtitle: 'A connected body of work',
		description: 'Teal and cool white, a wide photographic opening, and a dense main-and-aside arrangement.',
		tradeoff: 'The most information-rich option without a dashboard feel.',
		font: 'Manrope',
		palette: ['#F7FAFC', '#006E68', '#173846'],
	},
	{
		round: 2,
		id: 'lumen',
		name: 'Lumen',
		subtitle: 'Personality through photography',
		description: 'A portrait-led introduction, soft peach accents, and a visual shelf of recent writing.',
		tradeoff: 'The most personal option, balancing photography with compact sections.',
		font: 'Manrope',
		palette: ['#FFFFFF', '#A74825', '#283341'],
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
