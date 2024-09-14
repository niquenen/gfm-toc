/**
 * @author Cédric Hennequin
 * @company H2V Solutions
 * @created_at 2024-09-14 11:06:42
 * @updated_by Cédric Hennequin
 * @updated_at 2024-09-14 12:23:05
 */

import type { Root, RootContent } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toMarkdown } from 'mdast-util-to-markdown';
import { gfmFromMarkdown, gfmToMarkdown } from 'mdast-util-gfm';
import { micromark } from 'micromark'
import { gfm, gfmHtml } from 'micromark-extension-gfm';

/**
 * Checks if the given content is a heading.
 *
 * @param content - The content to check.
 * @returns Returns `true` if the content is a heading, otherwise `false`.
 */
function isHeading(content: RootContent): boolean
{
	if (content.type == 'heading') {
		return content.depth > 1;
	}
	else if (content.type != 'html') {
		return false;
	}
	return /<h[2-6]>/.test(content.value);
}

/**
 * Converts the given Markdown content to HTML.
 *
 * @param content - The Markdown content to convert.
 * @returns - HTML string.
 */
export function toHtml(content: Buffer): string
{
	const root: Root = fromMarkdown(
		content,
		{mdastExtensions: gfmFromMarkdown()}
	);

	root.children = root.children.filter(isHeading);
	return micromark(
		toMarkdown(root, gfmToMarkdown()),
		{
			extensions: [gfm()],
			htmlExtensions: [gfmHtml()],
			allowDangerousHtml: true
		}
	);
}
