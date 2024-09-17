// import { inspect } from 'node:util';
import { default as serialize } from 'dom-serializer';
import { parseDocument } from 'htmlparser2';
import type { Nullable } from './types.js';

export type TNode = ReturnType<typeof parseDocument>['children'][number];
export type TValue = {
	parent: Nullable<number>;
	level: number;
	content: Nullable<string>;
};
export type TMap = Map<number, TValue>;

/**
 * Returns the level of the given node.
 *
 * @param node - The node to get the level from.
 * @returns The level of the node, or `-1` if the node is not a heading tag.
 */
export function getLevel(node: TNode): number
{
	if (!(node.type == 'tag' && node.name.startsWith('h'))) {
		return -1;
	}
	return parseInt(node.name.substring(2, 1));
}

/**
 * Retrieves the content from a given {@link TNode}.
 *
 * @param node - The {@link TNode} to retrieve the content from.
 * @returns The content of the {@link TNode} as a string.
 */
export function getContent(node: TNode): Nullable<string>
{
	let result: string = '';

	if (node.type != 'tag') {
		return null;
	}
	for (let index: number = 0; index < node.children.length; ++index) {
		result += serialize(
			node.children[index]!,
			{decodeEntities: true}
		).replace(
			/\r\n|\n/gu,
			' '
		).replace(/\p{Zs}+/gu, ' ').replace(/^\p{Zs}+|\p{Zs}+$/gu, '');
		if (node.children[index + 1]) {
			result += ' ';
		}
	}
	return result;
}

/**
 * Finds the parent index in the map based on the given level.
 *
 * @param level - The level to compare against.
 * @param map - The map to search in.
 * @param length - The length of the map.
 * @returns The index of the parent or null if not found.
 */
function findParent(
	level: number,
	map: TMap,
	length: number
): Nullable<number>
{
	for (let index = length - 1; index > 0; --index) {
		if (map.get(index)!.level < level) {
			return index;
		}
	}
	return null;
}

/**
 * Converts a string into a map representing a table of contents.
 *
 * @param data - The string to be converted.
 * @returns The map representing the table of contents.
 */
export function toList(data: string): TMap
{
	const map: TMap = new Map<number, TValue>();
	let level: number = 0;
	let nodes:  Array<TNode> = parseDocument(
		data
	).children;

	nodes = nodes.filter(
		(value) => value.type == 'tag' && value.name.startsWith('h')
	);
	for (let index: number = 0; index < nodes.length; ++index) {
		level = getLevel(nodes[index]!);
		map.set(
			index,
			{
				parent: findParent(level, map, index),
				level: level,
				content: getContent(nodes[index]!)
			}
		);
	}
	// console.log(inspect(map, false, null, true));
	return map;
}
