/** Forked from https://github.com/antfu/eslint-config */
import process from 'node:process';
import c from 'chalk';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';
import * as p from '@clack/prompts';
import { run } from './run.js';
import { pkgJson } from './constants.js';

function header() {
	// eslint-disable-next-line no-console
	console.log('\n');
	p.intro(`${c.magenta(`@huntabyte/eslint-config `)}${c.dim(`v${pkgJson.version}`)}`);
}

const instance = yargs(hideBin(process.argv))
	.scriptName('@huntabyte/eslint-config')
	.usage('')
	.command(
		'*',
		'Run the initialization process',
		(args) =>
			args
				.option('yes', {
					alias: 'y',
					description: 'Skip prompts and use defaults',
					type: 'boolean',
				})
				.option('template', {
					alias: 't',
					description: 'Use a specific template for a framework or library',
					type: 'string',
				})
				.help(),
		async (args) => {
			header();
			try {
				await run(args);
			} catch (err) {
				p.log.error(c.inverse(c.red(' Failed to migrate ')));
				p.log.error(c.red(`✘ ${String(err)}`));
				process.exit(1);
			}
		}
	)
	.showHelpOnFail(false)
	.alias('h', 'help')
	.version('version', pkgJson.version)
	.alias('v', 'version');

// eslint-disable-next-line no-unused-expressions
instance.help().argv;
