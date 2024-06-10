const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}', './node_modules/flowbite/**/*.js'],
	theme: {
		extend: {
			typography(theme) {
				return {
					DEFAULT: {
						css: {
							// target Dark mode where code blocks are inline in text
							// and not full code blocks:
							'.dark code:not(pre > code)': {
								// 	// Use dark prefix for older Tailwind versions
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
				};
			},
			colors: {
				primary: colors.blue,
				secondary: colors.pink,
			},
			fontFamily: {
				sans: ["'InterVariable'", ...defaultTheme.fontFamily.sans],
			},
		},
	},
	plugins: [require('flowbite/plugin'), require('@tailwindcss/typography')],
	darkMode: 'class',
};

/* 

  Alternative tailwind.config.js
  
  NOTE: Add this fonts to <head>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;700&display=swap" rel="stylesheet" />
*/

// module.exports = {
//   content: ["./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}"],
//   theme: {
//     extend: {
//       colors: {
//         primary: colors.cyan,
//         secondary: colors.lime,
//       },
//       fontFamily: {
//         sans: ["'Nunito'", ...defaultTheme.fontFamily.sans],
//       },
//     },
//   },
//   plugins: [require("@tailwindcss/typography")],
//   darkMode: "class",
// };
