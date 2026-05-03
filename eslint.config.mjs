import js from '@eslint/js';
import eslintPluginAstro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	js.configs.recommended,
	...tseslint.configs.recommended,
	...eslintPluginAstro.configs.recommended,
	{
		ignores: [
			'dist/**',
			'node_modules/**',
			'.astro/**',
			'.vercel/**',
			'public/**',
			'.github/**',
		],
	},
	{
		files: ['**/*.js', '**/*.mjs'],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
	/* CommonJS: require() + Node globals for .cjs (e.g. tailwind.config.cjs). */
	{
		files: ['**/*.cjs'],
		languageOptions: {
			globals: {
				...globals.node,
			},
			sourceType: 'commonjs',
		},
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
		},
	},
	/* Ad-hoc Node scripts stay on require(). */
	{
		files: ['scripts/**/*.js'],
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
		},
	},
);
