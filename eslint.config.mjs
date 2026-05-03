import js from '@eslint/js';
import eslintPluginAstro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	js.configs.recommended,
	...tseslint.configs.recommended,
	...eslintPluginAstro.configs.recommended,
	{
		ignores: ['dist/**', 'node_modules/**', '.astro/**', 'public/**', '.github/**'],
	},
	{
		files: ['**/*.js', '**/*.mjs'],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	}
);
