import { resolve } from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: {
		alias: [
			{ find: '#util', replacement: resolve('src/lib/utils') },
			{ find: '#structure', replacement: resolve('src/lib/structures') },
			{ find: '#manager', replacement: resolve('src/lib/manager') },
			{ find: '#lib', replacement: resolve('src/lib') },
			{ find: '#model', replacement: resolve('src/models') },
			{ find: '#types', replacement: resolve('src/types') },
			{ find: '#commands', replacement: resolve('src/commands') },
			{ find: '#root', replacement: resolve('src') },
			{ find: '#controller', replacement: resolve('src/controller') },
		],
	},
	test: {
		globals: true,
	},
	esbuild: {
		target: 'esnext',
	},
});
