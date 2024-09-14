/**
 * @author Cédric Hennequin
 * @company H2V Solutions
 * @created_at 2024-09-14 10:57:11
 * @updated_by Cédric Hennequin
 * @updated_at 2024-09-14 11:30:31
 */

import { Buffer } from 'node:buffer';
import { readFile, stat } from 'node:fs/promises';
import type { PathLike, Stats } from 'node:fs';
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
