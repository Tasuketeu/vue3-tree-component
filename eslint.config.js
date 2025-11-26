import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import globals from 'globals';

export default [
	// JavaScript files
	{
		files: ['**/*.{js,mjs,cjs,jsx}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.es2021,
				...globals.node,
			},
		},
		rules: {
			...js.configs.recommended.rules,
			'no-unused-vars': 'warn',
			'no-console': 'warn',
			'no-debugger': 'warn',
		},
	},

	// TypeScript files
	{
		files: ['**/*.{ts,tsx,cts,mts}'],
		languageOptions: {
			parser: await import('@typescript-eslint/parser').then((module) => module.default),
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.es2021,
				...globals.node,
			},
		},
		rules: {
			'no-unused-vars': 'warn',
			'no-console': 'warn',
			'no-debugger': 'warn',
		},
	},

	// Vue files
	{
		files: ['**/*.vue'],
		plugins: {
			vue,
		},
		languageOptions: {
			parser: await import('vue-eslint-parser').then((module) => module.default),
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.browser,
			},
		},
		rules: {
			...vue.configs['vue3-essential'].rules,
			'vue/multi-word-component-names': 'off',
			'vue/no-unused-vars': 'warn',
		},
	},
];
