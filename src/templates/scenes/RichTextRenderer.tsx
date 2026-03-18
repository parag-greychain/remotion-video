import React from 'react';
import {generateHTML} from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import {richTextCSS} from './richtext-styles';

const extensions = [StarterKit, Underline];

interface RichTextRendererProps {
	/** Tiptap JSON content */
	content: any;
	/** Text color */
	color?: string;
	/** Font size for body text */
	fontSize?: number;
	/** Additional CSS class */
	className?: string;
	style?: React.CSSProperties;
}

/**
 * Renders Tiptap JSON content as styled HTML inside Remotion compositions.
 * Falls back to rendering a plain string if content is a string.
 */
export const RichTextRenderer: React.FC<RichTextRendererProps> = ({
	content,
	color = '#1A1A2E',
	fontSize = 22,
	style,
}) => {
	// Handle plain string fallback
	if (typeof content === 'string') {
		return (
			<div style={{fontSize, color, fontFamily: 'system-ui, sans-serif', lineHeight: 1.7, ...style}}>
				{content}
			</div>
		);
	}

	// Handle empty/null content
	if (!content || !content.type) {
		return null;
	}

	let html: string;
	try {
		html = generateHTML(content, extensions);
	} catch {
		return null;
	}

	return (
		<div
			style={{
				fontSize,
				color,
				fontFamily: 'system-ui, sans-serif',
				lineHeight: 1.7,
				...style,
			}}
		>
			<style dangerouslySetInnerHTML={{__html: richTextCSS}} />
			<div dangerouslySetInnerHTML={{__html: html}} />
		</div>
	);
};
