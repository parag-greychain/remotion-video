'use client';

import {useEditor, EditorContent} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import {useEffect, useRef} from 'react';

interface RichTextEditorProps {
	/** Tiptap JSON content */
	value: any;
	onChange: (json: any) => void;
	label?: string;
	/** Compact mode — smaller toolbar, fewer options */
	compact?: boolean;
}

function ToolbarButton({active, onClick, title, children}: {active?: boolean; onClick: () => void; title: string; children: React.ReactNode}) {
	return (
		<button
			type="button"
			onMouseDown={(e) => {e.preventDefault(); onClick();}}
			title={title}
			className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold transition-colors ${
				active ? 'bg-weaved-blue text-white' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
			}`}
		>
			{children}
		</button>
	);
}

export function RichTextEditor({value, onChange, label, compact = false}: RichTextEditorProps) {
	const isInternalUpdate = useRef(false);

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({
				heading: compact ? false : {levels: [2, 3]},
			}),
			Underline,
			...(compact ? [] : [TextAlign.configure({types: ['heading', 'paragraph']})]),
		],
		content: value || {type: 'doc', content: [{type: 'paragraph', content: [{type: 'text', text: ''}]}]},
		onUpdate: ({editor}) => {
			isInternalUpdate.current = true;
			onChange(editor.getJSON());
		},
		editorProps: {
			attributes: {
				class: 'prose prose-sm max-w-none focus:outline-none min-h-[60px] px-3 py-2 text-gray-900',
			},
		},
	});

	// Sync external value changes
	useEffect(() => {
		if (!editor || isInternalUpdate.current) {
			isInternalUpdate.current = false;
			return;
		}
		const currentJSON = JSON.stringify(editor.getJSON());
		const newJSON = JSON.stringify(value);
		if (currentJSON !== newJSON && value) {
			editor.commands.setContent(value);
		}
	}, [value, editor]);

	if (!editor) return null;

	return (
		<div>
			{label && <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>}
			<div className="rounded-lg border border-gray-200 bg-white overflow-hidden focus-within:border-weaved-blue focus-within:ring-1 focus-within:ring-weaved-blue/30 transition-colors">
				{/* Toolbar */}
				<div className="flex items-center gap-1 px-2 py-1.5 border-b border-gray-100 bg-gray-50 flex-wrap">
					<ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
						B
					</ToolbarButton>
					<ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
						<span className="italic">I</span>
					</ToolbarButton>
					<ToolbarButton active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline">
						<span className="underline">U</span>
					</ToolbarButton>

					<div className="w-px h-5 bg-gray-200 mx-1" />

					<ToolbarButton active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List">
						•≡
					</ToolbarButton>
					<ToolbarButton active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered List">
						1.
					</ToolbarButton>

					{!compact && (
						<>
							<div className="w-px h-5 bg-gray-200 mx-1" />

							<ToolbarButton active={editor.isActive('heading', {level: 2})} onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()} title="Heading">
								H2
							</ToolbarButton>
							<ToolbarButton active={editor.isActive('heading', {level: 3})} onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()} title="Sub-heading">
								H3
							</ToolbarButton>

							<div className="w-px h-5 bg-gray-200 mx-1" />

							<ToolbarButton active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Quote">
								❝
							</ToolbarButton>
						</>
					)}
				</div>

				{/* Editor area */}
				<EditorContent editor={editor} />
			</div>
		</div>
	);
}
