import { defineConfig } from 'tsup';

export default defineConfig({
	clean: true,
	dts: false,
	entry: ['src/**/*.ts', '!src/**/*.d.ts'],
	format: ['cjs'],
	minify: false,
	skipNodeModulesBundle: true,
	sourcemap: true,
	target: 'es2022',
	tsconfig: 'src/tsconfig.json',
	bundle: false,
	shims: false,
	keepNames: true,
	splitting: false,
	// esbuildPlugins: [
	// 	{
	// 		name: 'add-js',
	// 		setup(build) {
	// 			build.onResolve({ filter: /.*/ }, (args) => {
	// 				if (args.importer)
	// 					return { path: args.path.startsWith('#') || args.path.endsWith('.js') ? args.path : `${args.path}.js`, external: true };
	// 			});
	// 		}
	// 	}
	// ]
});
