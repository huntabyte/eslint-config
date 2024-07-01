import antfu, {
	type Awaitable,
	type ConfigNames,
	type OptionsConfig,
	type TypedFlatConfigItem,
} from '@antfu/eslint-config';
import pluginHuntabyte from '@huntabyte/eslint-plugin';
import type { FlatConfigComposer } from 'eslint-flat-config-utils';
import parserSvelte from 'svelte-eslint-parser';
import parserTypescript from '@typescript-eslint/parser';
import type { Linter } from 'eslint';

export type Options = OptionsConfig & TypedFlatConfigItem;
export type UserConfig = Awaitable<
	// eslint-disable-next-line ts/no-explicit-any
	TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.FlatConfig[]
>[];

export const DEFAULT_IGNORES = ['**/.svelte-kit', '**/dist', '**/build', '**/static', '**/*.md'];

const defaultOptions: Options = {
	stylistic: false,
	jsonc: false,
	ignores: DEFAULT_IGNORES,
	typescript: true,
	svelte: false,
};

export function huntabyte(
	options?: Options,
	...userConfigs: UserConfig[]
): FlatConfigComposer<
	TypedFlatConfigItem,
	| Exclude<ConfigNames, 'antfu/svelte/setup' | 'antfu/svelte/rules'>
	| 'huntabyte/svelte/setup'
	| 'huntabyte/svelte/rules'
	| 'huntabyte/svelte-ts/rules'
> {
	const withDefaults = { ...defaultOptions, ...options };

	const factory = antfu(withDefaults, ...userConfigs)
		.override('antfu/javascript/rules', {
			plugins: {
				huntabyte: pluginHuntabyte,
			},
			rules: {
				'no-unused-vars': [
					'error',
					{
						args: 'after-used',
						argsIgnorePattern: '^_',
						varsIgnorePattern: '^_',
					},
				],
				'no-console': [
					'error',
					{
						allow: ['info', 'clear', 'error', 'warn'],
					},
				],
				'huntabyte/top-level-function': 'error',
			},
		})
		.override('antfu/typescript/setup', {
			plugins: {
				huntabyte: pluginHuntabyte,
			},
		})
		.override('antfu/unicorn/rules', {
			rules: {
				'unicorn/prefer-dom-node-text-content': 'off',
			},
		})
		.override('antfu/typescript/rules', {
			rules: {
				'ts/consistent-type-definitions': ['error', 'type'],
				'ts/no-explicit-any': 'error',
			},
		})
		.remove('antfu/perfectionist/setup');

	if (withDefaults.svelte) {
		return factory
			.override('antfu/svelte/setup', {
				name: 'huntabyte/svelte/setup',
				plugins: {
					huntabyte: pluginHuntabyte,
				},
				files: ['**/*.svelte'],
			})
			.override('antfu/svelte/rules', {
				name: 'huntabyte/svelte/rules',
				files: ['**/*.svelte'],
				languageOptions: {
					parser: parserSvelte,
				},
				rules: {
					'no-unused-vars': 'off',
					'svelte/valid-compile': 'off',
					'unused-imports/no-unused-vars': [
						'error',
						{
							argsIgnorePattern: '^_',
							varsIgnorePattern: '^_|\\$\\$(Props|Events|Slots|Generic)$',
						},
					],
					'ts/no-unused-vars': [
						'error',
						{
							args: 'after-used',
							argsIgnorePattern: '^_',
							varsIgnorePattern: '^_|\\$\\$(Props|Events|Slots|Generic)$',
						},
					],
					'no-undef-init': 'off',
					'unused-imports/no-unused-imports': [
						'error',
						{ varsIgnorePattern: '^FormPath|FormPathLeaves' },
					],
					'prefer-const': 'off',
					'huntabyte/top-level-function': 'error',
				},
			})
			.append({
				name: 'huntabyte/svelte-ts/rules',
				files: ['**/*.svelte.ts'],
				languageOptions: {
					parser: parserSvelte,
					parserOptions: {
						parser: parserTypescript,
					},
				},
				rules: {
					'prefer-const': 'off',
				},
			})
			.append({
				name: 'huntabyte/svelte-js/rules',
				files: ['**/*.svelte.js'],
				languageOptions: {
					parser: parserSvelte,
				},
				rules: {
					'prefer-const': 'off',
				},
			});
	}

	return factory;
}
