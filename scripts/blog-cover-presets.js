/**
 * Curated visual presets for scripts/generate-blog-cover.js (~28 variants).
 * Coordinates cx, cy, x, y, w, h are 0–1 fractions of canvas width/height.
 * Circle r and rect rx are fractions of min(width, height).
 */

/** @typedef {{ offset: string, color: string }} GradientStop */
/** @typedef {{ type: 'linear', x1: string, y1: string, x2: string, y2: string, stops: GradientStop[] } | { type: 'radial', cx: string, cy: string, r: string, stops: GradientStop[] }} Background */
/** @typedef {{ type: 'circle', cx: number, cy: number, r: number, fill: string, opacity: number } | { type: 'ellipse', cx: number, cy: number, rx: number, ry: number, fill: string, opacity: number } | { type: 'rect', x: number, y: number, w: number, h: number, rx: number, fill: string, opacity: number }} Shape */
/** @typedef {{ points: [number, number][], fill: string, opacity: number }} Band */

/** @type {Array<{ id: string, family: string, background: Background, shapes: Shape[], band?: Band, titleFill: string, subtitleFill: string }>} */
const PRESETS = [
	// —— cool editorial (5)
	{
		id: 'cool-mariana',
		family: 'cool-editorial',
		background: {
			type: 'linear',
			x1: '0%',
			y1: '100%',
			x2: '100%',
			y2: '0%',
			stops: [
				{ offset: '0%', color: '#0c4a6e' },
				{ offset: '50%', color: '#1e3a5f' },
				{ offset: '100%', color: '#0f172a' },
			],
		},
		shapes: [
			{ type: 'circle', cx: 0.88, cy: 0.18, r: 0.16, fill: '#22d3ee', opacity: 0.2 },
			{ type: 'circle', cx: 0.12, cy: 0.82, r: 0.22, fill: '#0369a1', opacity: 0.18 },
			{ type: 'ellipse', cx: 0.78, cy: 0.7, rx: 0.22, ry: 0.11, fill: '#1e293b', opacity: 0.14 },
		],
		titleFill: '#f1f5f9',
		subtitleFill: 'rgba(241,245,249,0.85)',
	},
	{
		id: 'cool-indigo-ink',
		family: 'cool-editorial',
		background: {
			type: 'linear',
			x1: '100%',
			y1: '0%',
			x2: '0%',
			y2: '100%',
			stops: [
				{ offset: '0%', color: '#312e81' },
				{ offset: '45%', color: '#1e1b4b' },
				{ offset: '100%', color: '#0f172a' },
			],
		},
		shapes: [
			{ type: 'circle', cx: 0.82, cy: 0.25, r: 0.14, fill: '#a78bfa', opacity: 0.22 },
			{ type: 'circle', cx: 0.25, cy: 0.88, r: 0.18, fill: '#4f46e5', opacity: 0.16 },
			{ type: 'rect', x: 0.68, y: 0.55, w: 0.32, h: 0.4, rx: 0.04, fill: '#312e81', opacity: 0.2 },
		],
		titleFill: '#f8fafc',
		subtitleFill: 'rgba(248,250,252,0.82)',
	},
	{
		id: 'cool-steel-teal',
		family: 'cool-editorial',
		background: {
			type: 'radial',
			cx: '35%',
			cy: '25%',
			r: '95%',
			stops: [
				{ offset: '0%', color: '#164e63' },
				{ offset: '55%', color: '#134e4a' },
				{ offset: '100%', color: '#0f172a' },
			],
		},
		shapes: [
			{ type: 'circle', cx: 0.9, cy: 0.15, r: 0.12, fill: '#2dd4bf', opacity: 0.24 },
			{ type: 'ellipse', cx: 0.7, cy: 0.85, rx: 0.28, ry: 0.1, fill: '#0d9488', opacity: 0.18 },
		],
		titleFill: '#ecfeff',
		subtitleFill: 'rgba(236,254,255,0.8)',
	},
	{
		id: 'cool-midnight-cornflower',
		family: 'cool-editorial',
		background: {
			type: 'linear',
			x1: '0%',
			y1: '0%',
			x2: '100%',
			y2: '100%',
			stops: [
				{ offset: '0%', color: '#1e3a8a' },
				{ offset: '60%', color: '#172554' },
				{ offset: '100%', color: '#020617' },
			],
		},
		shapes: [
			{ type: 'circle', cx: 0.85, cy: 0.2, r: 0.17, fill: '#60a5fa', opacity: 0.2 },
			{ type: 'circle', cx: 0.18, cy: 0.75, r: 0.15, fill: '#3b82f6', opacity: 0.14 },
		],
		band: {
			points: [
				[0.55, 0],
				[1, 0],
				[1, 0.45],
				[0.4, 0.35],
			],
			fill: '#1d4ed8',
			opacity: 0.12,
		},
		titleFill: '#eff6ff',
		subtitleFill: 'rgba(239,246,255,0.82)',
	},
	{
		id: 'cool-prussian',
		family: 'cool-editorial',
		background: {
			type: 'linear',
			x1: '50%',
			y1: '0%',
			x2: '50%',
			y2: '100%',
			stops: [
				{ offset: '0%', color: '#082f49' },
				{ offset: '100%', color: '#020617' },
			],
		},
		shapes: [
			{ type: 'ellipse', cx: 0.88, cy: 0.35, rx: 0.14, ry: 0.22, fill: '#0ea5e9', opacity: 0.2 },
			{ type: 'circle', cx: 0.2, cy: 0.9, r: 0.2, fill: '#1e40af', opacity: 0.16 },
		],
		titleFill: '#f0f9ff',
		subtitleFill: 'rgba(240,249,255,0.85)',
	},

	// —— warm editorial (4)
	{
		id: 'warm-terracotta-dusk',
		family: 'warm-editorial',
		background: {
			type: 'linear',
			x1: '0%',
			y1: '0%',
			x2: '100%',
			y2: '100%',
			stops: [
				{ offset: '0%', color: '#7c2d12' },
				{ offset: '50%', color: '#431407' },
				{ offset: '100%', color: '#1c1917' },
			],
		},
		shapes: [
			{ type: 'circle', cx: 0.86, cy: 0.22, r: 0.15, fill: '#fb923c', opacity: 0.22 },
			{ type: 'circle', cx: 0.14, cy: 0.78, r: 0.18, fill: '#c2410c', opacity: 0.18 },
		],
		titleFill: '#fff7ed',
		subtitleFill: 'rgba(255,247,237,0.85)',
	},
	{
		id: 'warm-ochre-paper',
		family: 'warm-editorial',
		background: {
			type: 'linear',
			x1: '100%',
			y1: '100%',
			x2: '0%',
			y2: '0%',
			stops: [
				{ offset: '0%', color: '#fef3c7' },
				{ offset: '55%', color: '#fde68a' },
				{ offset: '100%', color: '#d97706' },
			],
		},
		shapes: [
			{ type: 'circle', cx: 0.82, cy: 0.2, r: 0.14, fill: '#b45309', opacity: 0.14 },
			{ type: 'ellipse', cx: 0.72, cy: 0.75, rx: 0.2, ry: 0.1, fill: '#92400e', opacity: 0.1 },
		],
		titleFill: '#1c1917',
		subtitleFill: 'rgba(28,25,23,0.72)',
	},
	{
		id: 'warm-clay-mahogany',
		family: 'warm-editorial',
		background: {
			type: 'radial',
			cx: '80%',
			cy: '20%',
			r: '80%',
			stops: [
				{ offset: '0%', color: '#78350f' },
				{ offset: '70%', color: '#451a03' },
				{ offset: '100%', color: '#1c1917' },
			],
		},
		shapes: [
			{ type: 'circle', cx: 0.12, cy: 0.25, r: 0.16, fill: '#ea580c', opacity: 0.18 },
			{ type: 'rect', x: 0.65, y: 0.5, w: 0.35, h: 0.45, rx: 0.035, fill: '#292524', opacity: 0.25 },
		],
		titleFill: '#fafaf9',
		subtitleFill: 'rgba(250,250,249,0.82)',
	},
	{
		id: 'warm-honey-umber',
		family: 'warm-editorial',
		background: {
			type: 'linear',
			x1: '0%',
			y1: '50%',
			x2: '100%',
			y2: '50%',
			stops: [
				{ offset: '0%', color: '#422006' },
				{ offset: '50%', color: '#713f12' },
				{ offset: '100%', color: '#1c1917' },
			],
		},
		shapes: [
			{ type: 'circle', cx: 0.88, cy: 0.75, r: 0.2, fill: '#eab308', opacity: 0.16 },
			{ type: 'circle', cx: 0.22, cy: 0.15, r: 0.1, fill: '#ca8a04', opacity: 0.22 },
		],
		titleFill: '#fefce8',
		subtitleFill: 'rgba(254,252,232,0.85)',
	},

	// —— noir + accent (4)
	{
		id: 'noir-emerald-glow',
		family: 'noir-accent',
		background: {
			type: 'linear',
			x1: '0%',
			y1: '100%',
			x2: '100%',
			y2: '0%',
			stops: [
				{ offset: '0%', color: '#022c22' },
				{ offset: '100%', color: '#020617' },
			],
		},
		shapes: [
			{ type: 'circle', cx: 0.85, cy: 0.2, r: 0.13, fill: '#10b981', opacity: 0.28 },
			{ type: 'ellipse', cx: 0.3, cy: 0.85, rx: 0.25, ry: 0.08, fill: '#047857', opacity: 0.15 },
		],
		titleFill: '#ecfdf5',
		subtitleFill: 'rgba(236,253,245,0.8)',
	},
	{
		id: 'noir-magenta-pulse',
		family: 'noir-accent',
		background: {
			type: 'radial',
			cx: '50%',
			cy: '100%',
			r: '90%',
			stops: [
				{ offset: '0%', color: '#1a0520' },
				{ offset: '100%', color: '#030712' },
			],
		},
		shapes: [
			{ type: 'circle', cx: 0.78, cy: 0.18, r: 0.15, fill: '#e879f9', opacity: 0.26 },
			{ type: 'circle', cx: 0.15, cy: 0.6, r: 0.11, fill: '#a21caf', opacity: 0.2 },
		],
		titleFill: '#fdf4ff',
		subtitleFill: 'rgba(253,244,255,0.82)',
	},
	{
		id: 'noir-amber-beacon',
		family: 'noir-accent',
		background: {
			type: 'linear',
			x1: '100%',
			y1: '0%',
			x2: '0%',
			y2: '100%',
			stops: [
				{ offset: '0%', color: '#0c0a09' },
				{ offset: '100%', color: '#1c1917' },
			],
		},
		shapes: [
			{ type: 'circle', cx: 0.9, cy: 0.65, r: 0.18, fill: '#f59e0b', opacity: 0.22 },
			{ type: 'rect', x: 0.05, y: 0.1, w: 0.22, h: 0.35, rx: 0.03, fill: '#d97706', opacity: 0.12 },
		],
		titleFill: '#fffbeb',
		subtitleFill: 'rgba(255,251,235,0.85)',
	},
	{
		id: 'noir-cyan-signal',
		family: 'noir-accent',
		background: {
			type: 'linear',
			x1: '0%',
			y1: '0%',
			x2: '0%',
			y2: '100%',
			stops: [
				{ offset: '0%', color: '#020617' },
				{ offset: '100%', color: '#0c4a6e' },
			],
		},
		shapes: [
			{ type: 'ellipse', cx: 0.82, cy: 0.45, rx: 0.18, ry: 0.28, fill: '#06b6d4', opacity: 0.2 },
			{ type: 'circle', cx: 0.2, cy: 0.2, r: 0.08, fill: '#22d3ee', opacity: 0.3 },
		],
		titleFill: '#ecfeff',
		subtitleFill: 'rgba(236,254,255,0.82)',
	},

	// —— forest / mineral (4)
	{
		id: 'forest-pine-mist',
		family: 'forest-mineral',
		background: {
			type: 'linear',
			x1: '0%',
			y1: '0%',
			x2: '100%',
			y2: '100%',
			stops: [
				{ offset: '0%', color: '#14532d' },
				{ offset: '50%', color: '#166534' },
				{ offset: '100%', color: '#052e16' },
			],
		},
		shapes: [
			{ type: 'circle', cx: 0.88, cy: 0.72, r: 0.19, fill: '#4ade80', opacity: 0.16 },
			{ type: 'circle', cx: 0.18, cy: 0.22, r: 0.14, fill: '#15803d', opacity: 0.22 },
		],
		titleFill: '#f0fdf4',
		subtitleFill: 'rgba(240,253,244,0.85)',
	},
	{
		id: 'forest-moss-slate',
		family: 'forest-mineral',
		background: {
			type: 'radial',
			cx: '20%',
			cy: '80%',
			r: '85%',
			stops: [
				{ offset: '0%', color: '#365314' },
				{ offset: '100%', color: '#1a2e05' },
			],
		},
		shapes: [
			{ type: 'ellipse', cx: 0.75, cy: 0.2, rx: 0.24, ry: 0.12, fill: '#57534e', opacity: 0.2 },
			{ type: 'circle', cx: 0.85, cy: 0.55, r: 0.12, fill: '#84cc16', opacity: 0.18 },
		],
		titleFill: '#f7fee7',
		subtitleFill: 'rgba(247,254,231,0.82)',
	},
	{
		id: 'mineral-jade-deep',
		family: 'forest-mineral',
		background: {
			type: 'linear',
			x1: '50%',
			y1: '0%',
			x2: '50%',
			y2: '100%',
			stops: [
				{ offset: '0%', color: '#134e4a' },
				{ offset: '100%', color: '#042f2e' },
			],
		},
		shapes: [
			{ type: 'circle', cx: 0.8, cy: 0.28, r: 0.16, fill: '#5eead4', opacity: 0.2 },
			{ type: 'rect', x: 0.6, y: 0.6, w: 0.38, h: 0.35, rx: 0.04, fill: '#0f766e', opacity: 0.18 },
		],
		titleFill: '#f0fdfa',
		subtitleFill: 'rgba(240,253,250,0.85)',
	},
	{
		id: 'forest-gold-shadow',
		family: 'forest-mineral',
		background: {
			type: 'linear',
			x1: '100%',
			y1: '50%',
			x2: '0%',
			y2: '50%',
			stops: [
				{ offset: '0%', color: '#1a2e05' },
				{ offset: '100%', color: '#422006' },
			],
		},
		shapes: [
			{ type: 'circle', cx: 0.15, cy: 0.75, r: 0.17, fill: '#ca8a04', opacity: 0.2 },
			{ type: 'ellipse', cx: 0.82, cy: 0.35, rx: 0.15, ry: 0.2, fill: '#166534', opacity: 0.22 },
		],
		titleFill: '#fefce8',
		subtitleFill: 'rgba(254,252,232,0.82)',
	},

	// —— sunset / plum (4)
	{
		id: 'sunset-coral-ink',
		family: 'sunset-plum',
		background: {
			type: 'linear',
			x1: '0%',
			y1: '100%',
			x2: '100%',
			y2: '0%',
			stops: [
				{ offset: '0%', color: '#9f1239' },
				{ offset: '50%', color: '#4c0519' },
				{ offset: '100%', color: '#1e1b4b' },
			],
		},
		shapes: [
			{ type: 'circle', cx: 0.86, cy: 0.2, r: 0.15, fill: '#fb7185', opacity: 0.24 },
			{ type: 'circle', cx: 0.2, cy: 0.85, r: 0.18, fill: '#be185d', opacity: 0.16 },
		],
		titleFill: '#fff1f2',
		subtitleFill: 'rgba(255,241,242,0.85)',
	},
	{
		id: 'plum-velvet-dusk',
		family: 'sunset-plum',
		background: {
			type: 'radial',
			cx: '70%',
			cy: '30%',
			r: '75%',
			stops: [
				{ offset: '0%', color: '#581c87' },
				{ offset: '100%', color: '#0f0720' },
			],
		},
		shapes: [
			{ type: 'ellipse', cx: 0.2, cy: 0.3, rx: 0.2, ry: 0.15, fill: '#c084fc', opacity: 0.2 },
			{ type: 'circle', cx: 0.78, cy: 0.78, r: 0.2, fill: '#7c3aed', opacity: 0.18 },
		],
		titleFill: '#faf5ff',
		subtitleFill: 'rgba(250,245,255,0.82)',
	},
	{
		id: 'magenta-wine-eclipse',
		family: 'sunset-plum',
		background: {
			type: 'linear',
			x1: '0%',
			y1: '0%',
			x2: '100%',
			y2: '100%',
			stops: [
				{ offset: '0%', color: '#701a75' },
				{ offset: '55%', color: '#3b0764' },
				{ offset: '100%', color: '#0c0a09' },
			],
		},
		shapes: [
			{ type: 'circle', cx: 0.88, cy: 0.55, r: 0.17, fill: '#f0abfc', opacity: 0.2 },
			{ type: 'rect', x: 0.08, y: 0.55, w: 0.28, h: 0.38, rx: 0.03, fill: '#86198f', opacity: 0.15 },
		],
		titleFill: '#fdf4ff',
		subtitleFill: 'rgba(253,244,255,0.85)',
	},
	{
		id: 'rose-quartz-midnight',
		family: 'sunset-plum',
		background: {
			type: 'linear',
			x1: '100%',
			y1: '0%',
			x2: '0%',
			y2: '100%',
			stops: [
				{ offset: '0%', color: '#831843' },
				{ offset: '100%', color: '#1e1b4b' },
			],
		},
		shapes: [
			{ type: 'circle', cx: 0.72, cy: 0.18, r: 0.12, fill: '#fda4af', opacity: 0.22 },
			{ type: 'ellipse', cx: 0.25, cy: 0.72, rx: 0.22, ry: 0.1, fill: '#9d174d', opacity: 0.18 },
		],
		band: {
			points: [
				[0, 0.6],
				[0.5, 0.5],
				[0.45, 1],
				[0, 1],
			],
			fill: '#4c1d95',
			opacity: 0.14,
		},
		titleFill: '#fff1f2',
		subtitleFill: 'rgba(255,241,242,0.82)',
	},

	// —— monochrome (4)
	{
		id: 'mono-zinc-concrete',
		family: 'monochrome',
		background: {
			type: 'linear',
			x1: '0%',
			y1: '0%',
			x2: '100%',
			y2: '100%',
			stops: [
				{ offset: '0%', color: '#3f3f46' },
				{ offset: '100%', color: '#18181b' },
			],
		},
		shapes: [
			{ type: 'circle', cx: 0.85, cy: 0.22, r: 0.16, fill: '#a1a1aa', opacity: 0.18 },
			{ type: 'circle', cx: 0.15, cy: 0.8, r: 0.14, fill: '#71717a', opacity: 0.2 },
		],
		titleFill: '#fafafa',
		subtitleFill: 'rgba(250,250,250,0.82)',
	},
	{
		id: 'mono-charcoal-silver',
		family: 'monochrome',
		background: {
			type: 'radial',
			cx: '50%',
			cy: '0%',
			r: '100%',
			stops: [
				{ offset: '0%', color: '#52525b' },
				{ offset: '100%', color: '#09090b' },
			],
		},
		shapes: [
			{ type: 'rect', x: 0.7, y: 0.15, w: 0.28, h: 0.55, rx: 0.04, fill: '#27272a', opacity: 0.35 },
			{ type: 'ellipse', cx: 0.2, cy: 0.85, rx: 0.2, ry: 0.09, fill: '#d4d4d8', opacity: 0.12 },
		],
		titleFill: '#f4f4f5',
		subtitleFill: 'rgba(244,244,245,0.85)',
	},
	{
		id: 'mono-obsidian-steel',
		family: 'monochrome',
		background: {
			type: 'linear',
			x1: '0%',
			y1: '50%',
			x2: '100%',
			y2: '50%',
			stops: [
				{ offset: '0%', color: '#0a0a0a' },
				{ offset: '50%', color: '#262626' },
				{ offset: '100%', color: '#000000' },
			],
		},
		shapes: [
			{ type: 'circle', cx: 0.78, cy: 0.7, r: 0.2, fill: '#78716c', opacity: 0.2 },
			{ type: 'circle', cx: 0.22, cy: 0.25, r: 0.1, fill: '#a8a29e', opacity: 0.22 },
		],
		titleFill: '#fafaf9',
		subtitleFill: 'rgba(250,250,249,0.8)',
	},
	{
		id: 'mono-graphite-fog',
		family: 'monochrome',
		background: {
			type: 'linear',
			x1: '100%',
			y1: '100%',
			x2: '0%',
			y2: '0%',
			stops: [
				{ offset: '0%', color: '#404040' },
				{ offset: '100%', color: '#171717' },
			],
		},
		shapes: [
			{ type: 'ellipse', cx: 0.85, cy: 0.4, rx: 0.16, ry: 0.24, fill: '#d4d4d4', opacity: 0.1 },
			{ type: 'circle', cx: 0.12, cy: 0.55, r: 0.15, fill: '#737373', opacity: 0.16 },
		],
		titleFill: '#f5f5f5',
		subtitleFill: 'rgba(245,245,245,0.85)',
	},

	// —— arctic / mist (3)
	{
		id: 'arctic-frost-ice',
		family: 'arctic-mist',
		background: {
			type: 'linear',
			x1: '0%',
			y1: '0%',
			x2: '100%',
			y2: '100%',
			stops: [
				{ offset: '0%', color: '#e0f2fe' },
				{ offset: '50%', color: '#bae6fd' },
				{ offset: '100%', color: '#0369a1' },
			],
		},
		shapes: [
			{ type: 'circle', cx: 0.82, cy: 0.25, r: 0.14, fill: '#0284c7', opacity: 0.16 },
			{ type: 'circle', cx: 0.2, cy: 0.8, r: 0.18, fill: '#0c4a6e', opacity: 0.12 },
		],
		titleFill: '#0c4a6e',
		subtitleFill: 'rgba(12,74,110,0.75)',
	},
	{
		id: 'mist-cerulean-pale',
		family: 'arctic-mist',
		background: {
			type: 'radial',
			cx: '30%',
			cy: '40%',
			r: '90%',
			stops: [
				{ offset: '0%', color: '#f0f9ff' },
				{ offset: '60%', color: '#7dd3fc' },
				{ offset: '100%', color: '#075985' },
			],
		},
		shapes: [
			{ type: 'ellipse', cx: 0.78, cy: 0.65, rx: 0.25, ry: 0.12, fill: '#0369a1', opacity: 0.14 },
			{ type: 'circle', cx: 0.88, cy: 0.15, r: 0.1, fill: '#38bdf8', opacity: 0.22 },
		],
		titleFill: '#0c4a6e',
		subtitleFill: 'rgba(12,74,110,0.72)',
	},
	{
		id: 'polar-slate-glass',
		family: 'arctic-mist',
		background: {
			type: 'linear',
			x1: '50%',
			y1: '100%',
			x2: '50%',
			y2: '0%',
			stops: [
				{ offset: '0%', color: '#334155' },
				{ offset: '50%', color: '#1e293b' },
				{ offset: '100%', color: '#0f172a' },
			],
		},
		shapes: [
			{ type: 'circle', cx: 0.86, cy: 0.72, r: 0.17, fill: '#94a3b8', opacity: 0.2 },
			{ type: 'rect', x: 0.05, y: 0.12, w: 0.25, h: 0.4, rx: 0.03, fill: '#cbd5e1', opacity: 0.08 },
		],
		titleFill: '#f8fafc',
		subtitleFill: 'rgba(248,250,252,0.82)',
	},
];

function hashSeed(str) {
	let h = 2166136261;
	for (let i = 0; i < str.length; i++) {
		h ^= str.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}

/**
 * @param {{ seed?: string, avoidId?: string | null }} opts
 * @returns {number} index into PRESETS
 */
function pickPresetIndex(opts) {
	const { seed, avoidId } = opts;
	const n = PRESETS.length;

	if (seed !== undefined && seed !== null && String(seed).length > 0) {
		let h = hashSeed(String(seed));
		for (let k = 0; k < n + 5; k++) {
			const idx = h % n;
			if (!avoidId || PRESETS[idx].id !== avoidId) return idx;
			h = hashSeed(String(seed) + '\0' + k);
		}
		return hashSeed(String(seed)) % n;
	}

	const maxAttempts = 8;
	for (let attempt = 0; attempt < maxAttempts; attempt++) {
		const idx = Math.floor(Math.random() * n);
		if (!avoidId || PRESETS[idx].id !== avoidId) return idx;
	}
	return Math.floor(Math.random() * n);
}

/**
 * @param {string} id
 * @returns {typeof PRESETS[0] | null}
 */
function getPresetById(id) {
	const p = PRESETS.find((x) => x.id === id);
	return p || null;
}

function listStylesGrouped() {
	/** @type {Record<string, string[]>} */
	const byFamily = {};
	for (const p of PRESETS) {
		if (!byFamily[p.family]) byFamily[p.family] = [];
		byFamily[p.family].push(p.id);
	}
	return byFamily;
}

/**
 * @param {string} uid unique suffix for gradient ids in this SVG
 * @param {number} width
 * @param {number} height
 * @param {typeof PRESETS[0]} preset
 */
function buildPresetLayers(uid, width, height, preset) {
	const bgId = `blogCoverBg_${uid}`;
	const defParts = [];
	const bodyParts = [];
	const { background } = preset;

	if (background.type === 'linear') {
		defParts.push(
			`<linearGradient id="${bgId}" gradientUnits="objectBoundingBox" x1="${background.x1}" y1="${background.y1}" x2="${background.x2}" y2="${background.y2}">`
		);
		for (const s of background.stops) {
			defParts.push(`<stop offset="${s.offset}" stop-color="${s.color}"/>`);
		}
		defParts.push('</linearGradient>');
	} else {
		defParts.push(
			`<radialGradient id="${bgId}" gradientUnits="objectBoundingBox" cx="${background.cx}" cy="${background.cy}" r="${background.r}">`
		);
		for (const s of background.stops) {
			defParts.push(`<stop offset="${s.offset}" stop-color="${s.color}"/>`);
		}
		defParts.push('</radialGradient>');
	}

	bodyParts.push(`<rect width="100%" height="100%" fill="url(#${bgId})"/>`);

	const m = Math.min(width, height);

	for (const sh of preset.shapes) {
		if (sh.type === 'circle') {
			const cx = sh.cx * width;
			const cy = sh.cy * height;
			const r = sh.r * m;
			bodyParts.push(
				`<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${r.toFixed(2)}" fill="${sh.fill}" opacity="${sh.opacity}"/>`
			);
		} else if (sh.type === 'ellipse') {
			const cx = sh.cx * width;
			const cy = sh.cy * height;
			const rx = sh.rx * width;
			const ry = sh.ry * height;
			bodyParts.push(
				`<ellipse cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" rx="${rx.toFixed(2)}" ry="${ry.toFixed(
					2
				)}" fill="${sh.fill}" opacity="${sh.opacity}"/>`
			);
		} else if (sh.type === 'rect') {
			const x = sh.x * width;
			const y = sh.y * height;
			const w = sh.w * width;
			const h = sh.h * height;
			const rxPx = sh.rx * m;
			bodyParts.push(
				`<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${w.toFixed(2)}" height="${h.toFixed(
					2
				)}" rx="${rxPx.toFixed(2)}" ry="${rxPx.toFixed(2)}" fill="${sh.fill}" opacity="${sh.opacity}"/>`
			);
		}
	}

	if (preset.band) {
		const pts = preset.band.points
			.map(([fx, fy]) => `${(fx * width).toFixed(2)},${(fy * height).toFixed(2)}`)
			.join(' ');
		bodyParts.push(`<polygon points="${pts}" fill="${preset.band.fill}" opacity="${preset.band.opacity}"/>`);
	}

	return {
		defs: defParts.join('\n    '),
		body: bodyParts.join('\n  '),
		titleFill: preset.titleFill,
		subtitleFill: preset.subtitleFill,
	};
}

module.exports = {
	PRESETS,
	pickPresetIndex,
	getPresetById,
	listStylesGrouped,
	buildPresetLayers,
};
