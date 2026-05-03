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
							color: theme('colors.gray.100'),
							backgroundColor: theme('colors.slate.800'),
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
				primary: colors.blue,
				secondary: colors.pink,
			},
			fontFamily: {
				sans: ["'Inter'", ...defaultTheme.fontFamily.sans],
			},
		},
	},
};
