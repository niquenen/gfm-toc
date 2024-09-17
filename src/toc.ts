import beautify from 'js-beautify';
import type { HTMLBeautifyOptions } from 'js-beautify';
import type { TMap, TValue } from './list.js';

/**
 * The definition of punctuation from GitHub.
 *
 * @author yzhang-gh
 * @see {@link https://github.com/yzhang-gh/vscode-markdown|vscode-markdown}
 */
const punctuationRegex: RegExp = /[^\p{L}\p{M}\p{Nd}\p{Nl}\p{Pc}\- ]/gu;

/**
 * Options for beautifying HTML.
 */
const htmlBeautifyOptions: HTMLBeautifyOptions = {
	indent_size: 2,
	indent_char: ' ',
	indent_with_tabs: false,
	eol: '\n',
	end_with_newline: false,
	indent_level: 0,
	preserve_newlines: false,
	max_preserve_newlines: -1,
	wrap_line_length: 80,
	indent_empty_lines: false,
	templating: ['auto'],
	indent_inner_html: true,
	indent_body_inner_html: true,
	indent_head_inner_html: true,
	wrap_attributes: 'force-expand-multiline',
	wrap_attributes_indent_size: 4
};

const template: string = `
<details>
<summary>Table of contents</summary>

{{list}}

</details>`;

/**
 * Converts a heading into a slug by removing HTML tags, punctuation, and
 * converting spaces to hyphens.
 *
 * @param heading - The string to be converted into a slug.
 * @returns The slugified string.
 */
function slugify(heading: string): string
{
	return heading.replace(/<[^>]+>/g, '')
		.replace(punctuationRegex, '')
		.toLowerCase()
		.replace(/ /g, '-');
}

/**
 * Retrieves the children of a given parent element from a map.
 *
 * @param parent - The parent element.
 * @param map - The map containing the elements.
 * @returns An array of numbers representing the children elements.
 */
function getChildrens(parent: number, map: TMap): Array<number>
{
	const childrens: Array<number> = [];

	for (const element of map) {
		if (element[1].parent != parent) {
			continue;
		}
		childrens.push(element[0]);
	}
	return childrens;
}

/**
 * Generates a link element for the given value and array of slugs.
 *
 * @param element - The value to generate the link for.
 * @param slugs - The array of slugs to check for uniqueness.
 * @returns The generated link element as a string.
 */
function link(element: TValue, slugs: Array<string>): string
{
	let index: number = 1;
	let slug: string = slugify(element.content ?? '');

	while (slugs.includes(slug)) {
		slug = slugify(element.content ?? '') + `-${index.toString()}`;
		++index;
	}
	slugs.push(slug);
	return `<a href="#${slug}">${element.content}</a>`;
}

/**
 * Retrieves the item for the specified element from the map and generates an
 * HTML list item.
 *
 * @param element - The element to retrieve the item for.
 * @param map - The map containing the elements and their corresponding values.
 * @param slugs - An array of slugs.
 * @returns The generated HTML list item.
 */
function getItem(
	element: number,
	map: TMap,
	slugs: Array<string>,
	elementsIgnored: Array<number>
): string
{
	const childrensItems: Array<string> = [];
	const childrens: Array<number> = getChildrens(element, map);

	for (let index: number = 0; index < childrens.length; ++index) {
		childrensItems.push(
			getItem(childrens[index]!, map, slugs, elementsIgnored)
		);
	}
	elementsIgnored.push(...childrens);
	if (childrensItems.length) {
		return `<li>${link(map.get(element)!, slugs)}<ul>${
			childrensItems.join('')
		}</ul></li>`;
	}
	return `<li>${link(map.get(element)!, slugs)}</li>`;
}

/**
 * Generates a table of contents (TOC) based on the provided map.
 *
 * @param map - The map containing the elements for the TOC.
 * @returns The generated TOC as a string.
 */
export function create(map: TMap): string
{
	let toc: string = '<ul>';
	const slugs: Array<string> = [];
	const ignored: Array<number> = [];

	for (const element of map) {
		if (ignored.includes(element[0]) || !element[1].content) {
			continue;
		}
		toc += getItem(element[0], map, slugs, ignored);
	}
	toc += '</ul>';
	console.log(template.replace('{{list}}', beautify.html_beautify(toc, htmlBeautifyOptions)));
	return template.replace(
		'{{list}}',
		beautify.html_beautify(toc, htmlBeautifyOptions)
	);
}
