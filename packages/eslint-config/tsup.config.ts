import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts', 'src/cli.ts'],
	outDir: 'dist',
	sourcemap: true,
	format: ['esm'],
	dts: true,
	clean: true,
});
