/**
 * @author Cédric Hennequin
 * @company H2V Solutions
 * @created_at 2024-09-13 15:27:25
 * @updated_by Cédric Hennequin
 * @updated_at 2024-09-13 16:51:09
 */

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
