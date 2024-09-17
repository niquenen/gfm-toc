import { join } from 'node:path';
import { cwd, env } from 'node:process';
import { build } from 'esbuild';

await build({
	bundle: true,
	outdir: 'dist',
	packages: 'bundle',
	resolveExtensions: [
		'.ts'
	],
	allowOverwrite: true,
	tsconfig: join(cwd(), 'tsconfig.json'),
	entryPoints: [
		join('src', 'index.ts')
	],
	platform: 'node',
	minify: true,
	color: env.CI === 'true',
	logLevel: 'info'
});
