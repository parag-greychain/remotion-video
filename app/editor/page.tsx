'use client';

import {Suspense} from 'react';
import {useSearchParams} from 'next/navigation';
import {EditorContent} from './EditorContent';
import {EditorV1} from './EditorV1';

const V1_TEMPLATES = ['product-demo', 'team-intro', 'announcement'];

function EditorInner() {
	const searchParams = useSearchParams();
	const templateId = searchParams.get('template') || 'product-demo-v2';

	// V2 scene-based editor
	if (templateId === 'product-demo-v2') {
		return <EditorContent templateId={templateId} />;
	}

	// V1 legacy form-based editor
	if (V1_TEMPLATES.includes(templateId)) {
		return <EditorV1 templateId={templateId} />;
	}

	return <EditorContent templateId={templateId} />;
}

export default function EditorPage() {
	return (
		<Suspense fallback={<div className="min-h-screen flex items-center justify-center text-weaved-muted">Loading editor...</div>}>
			<EditorInner />
		</Suspense>
	);
}
