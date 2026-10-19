import defaultTheme from 'tailwindcss/defaultTheme';
import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			typography: (theme) => ({
				DEFAULT: {
					css: {
						'.dark code:not(pre > code)': {
							color: 'var(--color-slate-100)',
							backgroundColor: 'var(--color-slate-800)',
						},
						// Long inline tokens (env vars, config keys) must wrap instead of widening the page on mobile.
						':not(pre) > code': {
							overflowWrap: 'anywhere',
						},
						'code::before': {
							content: 'none',
						},
						'code::after': {
							content: 'none',
						},
						code: {
							color: theme('colors.slate.800'),
							backgroundColor: theme('colors.gray.200'),
							borderRadius: theme('borderRadius.DEFAULT'),
							paddingLeft: theme('spacing[1.5]'),
							paddingRight: theme('spacing[1.5]'),
							paddingTop: theme('spacing.1'),
							paddingBottom: theme('spacing.1'),
						},
					},
				},
			}),
			colors: {
				primary: {
					...colors.blue,
					300: 'var(--color-blue-300)',
					400: 'var(--color-blue-400)',
				},
				secondary: colors.pink,
			},
			fontFamily: {
				sans: ["'Inter'", ...defaultTheme.fontFamily.sans],
			},
		},
	},
};
