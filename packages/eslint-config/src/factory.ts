import antfu, {
	type Awaitable,
	type OptionsConfig,
	type TypedFlatConfigItem,
} from '@antfu/eslint-config';
import pluginHuntabyte from '@huntabyte/eslint-plugin';
import { isPackageExists } from 'local-pkg';
import type { FlatConfigPipeline } from 'eslint-flat-config-utils';

export type Options = OptionsConfig & TypedFlatConfigItem;
export type UserConfig = Awaitable<
	TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigPipeline<any>
>;

const DEFAULT_IGNORES = ['**/.svelte-kit', '**/dist', '**/build', '**/static', '**/*.md'];

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
): FlatConfigPipeline<TypedFlatConfigItem> {
	defaultOptions.svelte = isPackageExists('svelte');

	const withDefaults = { ...defaultOptions, ...options };

	const factory = antfu(withDefaults, ...userConfigs)
		.override('antfu:javascript', {
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
			plugins: {
				huntabyte: pluginHuntabyte,
			},
		})
		.override('antfu:typescript:setup', {
			plugins: {
				huntabyte: pluginHuntabyte,
			},
		})
		.override('antfu:unicorn', {
			rules: {
				'unicorn/prefer-dom-node-text-content': 'off',
			},
		})
		.override('antfu:typescript:rules', {
			rules: {
				'ts/consistent-type-definitions': ['error', 'type'],
			},
		})
		.remove('antfu:perfectionist')
		.remove('antfu:disables:cli');

	if (withDefaults.svelte) {
		return factory
			.override('antfu:svelte:setup', {
				name: 'huntabyte:svelte:setup',
				plugins: {
					huntabyte: pluginHuntabyte,
				},
			})
			.override('antfu:svelte:rules', {
				name: 'huntabyte:svelte:rules',
				rules: {
					'no-unused-vars': 'off',
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
			});
	}

	return factory;
}
