/** Forked from https://github.com/antfu/eslint-config */

import { execSync } from 'node:child_process';

export function isGitClean() {
	try {
		execSync('git diff --quiet HEAD --');
		return true;
	} catch (err) {
		return false;
	}
}

export function getEslintConfigContent(mainConfig: string, additionalConfigs?: string[]) {
	return `
import config from '@huntabyte/eslint-config'

export default config({
${mainConfig}${additionalConfigs?.map((config) => `,{\n${config}\n}`)}
})
`.trimStart();
}
