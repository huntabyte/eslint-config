/** Forked from https://github.com/antfu/eslint-config */
import path from 'node:path';
import fsp from 'node:fs/promises';
import process from 'node:process';
import c from 'chalk';
import * as p from '@clack/prompts';

import { dependenciesMap, pkgJson } from '../constants.js';
import type { PromptResult } from '../types.js';

export async function updatePackageJson(result: PromptResult) {
	const cwd = process.cwd();

	const pathPackageJSON = path.join(cwd, 'package.json');

	p.log.step(c.cyan(`Bumping @huntabyte/eslint-config to v${pkgJson.version}`));

	const pkgContent = await fsp.readFile(pathPackageJSON, 'utf-8');
	// eslint-disable-next-line ts/no-explicit-any
	const pkg: Record<string, any> = JSON.parse(pkgContent);

	pkg.dependencies ??= {};
	pkg.devDependencies['@huntabyte/eslint-config'] = `^${pkgJson.version}`;
	pkg.devDependencies.eslint ??= pkgJson.devDependencies.eslint;

	const addedPackages: string[] = [];

	for (const template of result.templates) {
		const deps = dependenciesMap[template];
		if (deps) {
			for (const dep of deps) {
				pkg.devDependencies[dep] = pkgJson.devDependencies[dep];
				addedPackages.push(dep);
			}
		}
	}

	if (addedPackages.length) {
		p.note(`${c.dim(addedPackages.join(', '))}`, 'Added packages');
	}

	await fsp.writeFile(pathPackageJSON, JSON.stringify(pkg, null, 2));
	p.log.success(c.green('Updated package.json'));
}
