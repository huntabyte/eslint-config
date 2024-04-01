/** Forked from https://github.com/antfu/eslint-config */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import c from 'chalk';
import * as p from '@clack/prompts';

import { templateOptions, templates } from './constants.js';
import type { PromptItem, PromptResult, TemplateOption } from './types.js';
import { isGitClean } from './utils.js';
import { updatePackageJson } from './states/update-package-json.js';
import { updateEslintFiles } from './states/update-eslint-files.js';
import { updateVscodeSettings } from './states/update-vscode-settings.js';

export type CliRunOptions = {
	/**
	 * Skip prompts and use defaults
	 */
	yes?: boolean;

	/**
	 * Use a template tailored for a specific framework or library
	 */
	templates?: string[];
};

export async function run(options: CliRunOptions = {}) {
	const argSkipPrompt = !!process.env.SKIP_PROMPT || options.yes;
	const argTemplate = <TemplateOption[]>options.templates?.map((m) => m.trim());

	if (fs.existsSync(path.join(process.cwd(), 'eslint.config.js'))) {
		p.log.warn(c.yellow('eslint.config.js already exists, exiting.'));
		return process.exit(1);
	}

	let result: PromptResult = {
		templates: argTemplate ?? [],
		uncommittedConfirmed: false,
		updateVscodeSettings: true,
	};

	if (!argSkipPrompt) {
		result = (await p.group(
			{
				uncommittedConfirmed: () => {
					if (argSkipPrompt || isGitClean()) {
						return Promise.resolve(true);
					}

					return p.confirm({
						initialValue: false,
						message: 'There are uncommitted change in the current git repository. Continue?',
					});
				},
				templates: ({ results }) => {
					const isArgTemplateValid =
						typeof argTemplate === 'string' && !!templates.includes(<TemplateOption>argTemplate);

					if (!results.uncommittedConfirmed || isArgTemplateValid) return;

					const message =
						!isArgTemplateValid && argTemplate
							? `"${argTemplate}" is not a valid template. Please choose from below: `
							: 'Select a template';

					return p.multiselect<PromptItem<TemplateOption>[], TemplateOption>({
						message: c.reset(message),
						options: templateOptions,
						required: false,
					});
				},
				updateVscodeSettings: ({ results }) => {
					if (!results.uncommittedConfirmed) return;
					return p.confirm({
						initialValue: true,
						message: 'Update .vscode/settings.json with recommended settings?',
					});
				},
			},
			{
				onCancel: () => {
					p.cancel('Operation cancelled.');
					process.exit(0);
				},
			}
		)) as PromptResult;

		if (!result.uncommittedConfirmed) {
			return process.exit(1);
		}
	}

	await updatePackageJson(result);
	await updateEslintFiles(result);
	await updateVscodeSettings(result);

	p.log.success(c.green('Done!'));
	p.outro(`Now you can update the dependencies and run ${c.blue('eslint . --fix')}\n`);
}
