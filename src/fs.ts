import { Buffer } from 'node:buffer';
import type { PathLike, Stats } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { Nullable } from './types.js';

/**
 * Reads the content of a file at the given path.
 *
 * @param path - The path to the file.
 * @returns Content of the file, or `null` if the file does not exist or is not
 *   a file.
 */
export async function read(path: PathLike): Promise<Nullable<Buffer>>
{
	let stats: Nullable<Stats> = null;

	try {
		stats = await stat(path);
	}
	catch {
		return null;
	}
	if (!stats.isFile()) {
		return null;
	}
	return await readFile(path);
}
