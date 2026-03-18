/** Create a Tiptap JSON document from a plain string */
export function plainToRichText(text: string): any {
	if (!text) return {type: 'doc', content: [{type: 'paragraph'}]};
	const paragraphs = text.split('\n').filter(Boolean);
	return {
		type: 'doc',
		content: paragraphs.map((p) => ({
			type: 'paragraph',
			content: [{type: 'text', text: p}],
		})),
	};
}

/** Create a Tiptap JSON document with bullet points */
export function bulletsToRichText(items: string[]): any {
	if (!items.length) return {type: 'doc', content: [{type: 'paragraph'}]};
	return {
		type: 'doc',
		content: [
			{
				type: 'bulletList',
				content: items.map((text) => ({
					type: 'listItem',
					content: [{type: 'paragraph', content: [{type: 'text', text}]}],
				})),
			},
		],
	};
}

/** Extract plain text from Tiptap JSON (for preview labels etc) */
export function richTextToPlain(content: any): string {
	if (!content) return '';
	if (typeof content === 'string') return content;
	const texts: string[] = [];
	function walk(node: any) {
		if (node.text) texts.push(node.text);
		if (node.content) node.content.forEach(walk);
	}
	walk(content);
	return texts.join(' ').slice(0, 100);
}
