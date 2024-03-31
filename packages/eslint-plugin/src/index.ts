import type { ESLint, Linter } from 'eslint';
import { version } from '../package.json';
import topLevelFunction from './rules/top-level-function.js';

const plugin = {
	meta: {
		name: 'huntabyte',
		version,
	},
	rules: {
		'top-level-function': topLevelFunction,
	},
} satisfies ESLint.Plugin;

export default plugin;

type RuleDefinitions = (typeof plugin)['rules'];

export type RuleOptions = {
	[K in keyof RuleDefinitions]: RuleDefinitions[K]['defaultOptions'];
};

export type Rules = {
	[K in keyof RuleDefinitions]: Linter.RuleEntry<RuleOptions[K]>;
};
