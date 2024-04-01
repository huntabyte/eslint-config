/** Forked from https://github.com/antfu/eslint-config */

import c from 'chalk';
import pkgJson from '../../package.json';
import type { PromptItem, TemplateOption } from './types.js';

export { pkgJson };

export const vscodeSettingsString = `
  // Enable the ESlint flat config support
  "eslint.experimental.useFlatConfig": true,

  // Disable the default formatter, use eslint instead
  "prettier.enable": false,
  "editor.formatOnSave": false,

  // Auto fix
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },

  // Enable eslint for all supported languages
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "html",
	"svelte",
    "markdown",
    "json",
    "jsonc",
    "yaml",
    "toml",
    "astro",
  ]
`;

export const templateOptions: PromptItem<TemplateOption>[] = [
	{ label: c.hex('#ff3e00')('Svelte'), value: 'svelte' },
];

export const templates: TemplateOption[] = templateOptions.map((opt) => opt.value);

export const dependenciesMap = {
	svelte: ['eslint-plugin-svelte', 'svelte-eslint-parser'],
} as const;
