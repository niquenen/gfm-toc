import { argv, exit } from 'node:process';
import { read } from './fs.js';
import { toList } from './list.js';
import { toHtml } from './md.js';
import { create } from './toc.js';
import type { Nullable } from './types.js';

const buffer: Nullable<Buffer> = await read(argv[2] || 'README.md');

if (!buffer) {
	console.error('Cannot read file.');
	exit(1);
}
create(toList(toHtml(buffer)))
