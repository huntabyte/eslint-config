export type PromptItem<T> = {
	label: string;
	value: T;
	hint?: string;
};

export type TemplateOption = 'svelte';

export type PromptResult = {
	uncommittedConfirmed: boolean;
	templates: TemplateOption[];
	updateVscodeSettings: unknown;
};
