export const concepts = [
	{
		round: 3,
		id: 'prism',
		name: 'Prism',
		subtitle: 'A portfolio with a clear sequence',
		description:
			'An evergreen hero, prominent recognition, and full-width colored sections. Research leads; Blog has its own place.',
		tradeoff: 'A complete reorganization of Prism, with no competing content sidebars.',
		font: 'Manrope',
		palette: ['#F7F5FC', '#6242B5', '#E5F2EC'],
	},
	{
		round: 3,
		id: 'structured',
		name: 'Structured',
		subtitle: 'The current website, brought together',
		description:
			'The familiar blue, Inter typography, portrait, and numbered sections, organized into consistent panels.',
		tradeoff: 'The closest to the current site, with a shared structure inside every section.',
		font: 'Inter',
		palette: ['#F3F6FB', '#1D4ED8', '#EDF6F2'],
	},
	{
		round: 3,
		id: 'navigator',
		name: 'Navigator',
		subtitle: 'An interactive portfolio workspace',
		description:
			'Choose Research, Open source, Speaking, Books, or Blog. One area of work fills the workspace at a time.',
		tradeoff: 'A different navigation model, with Research open first and direct links to each area.',
		font: 'Manrope',
		palette: ['#F1F4F9', '#142A43', '#FFE7DA'],
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
