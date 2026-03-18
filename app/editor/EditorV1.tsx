'use client';

import {useState, useCallback} from 'react';
import Link from 'next/link';
import {Player} from '@remotion/player';
import {getTemplate, getDefaultProps} from '@/src/lib/templates';
import {ProductDemo} from '@/src/templates/ProductDemo';
import {TeamIntro} from '@/src/templates/TeamIntro';
import {Announcement} from '@/src/templates/Announcement';

const componentMap: Record<string, React.FC<any>> = {
	'product-demo': ProductDemo,
	'team-intro': TeamIntro,
	announcement: Announcement,
};

const labelMap: Record<string, string> = {
	brandName: 'Brand Name', tagline: 'Tagline', subtitle: 'Subtitle',
	ctaText: 'CTA Text', ctaUrl: 'CTA URL', primaryColor: 'Primary Color', accentColor: 'Accent Color',
	personName: 'Person Name', role: 'Role', bio: 'Bio',
	achievement1: 'Achievement 1', achievement2: 'Achievement 2', achievement3: 'Achievement 3', achievement4: 'Achievement 4',
	contactEmail: 'Email', contactLocation: 'Location',
	headline: 'Headline', subheadline: 'Subheadline', body: 'Body Text',
};

function isColorField(key: string) { return key.toLowerCase().includes('color'); }
function isLongTextField(key: string) { return ['subtitle', 'bio', 'body'].includes(key); }

export function EditorV1({templateId}: {templateId: string}) {
	const template = getTemplate(templateId);
	const [props, setProps] = useState<Record<string, any>>(() => getDefaultProps(templateId));
	const [rendering, setRendering] = useState(false);
	const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
	const Component = componentMap[templateId];

	const updateProp = useCallback((key: string, value: any) => {
		setProps((prev: Record<string, any>) => ({...prev, [key]: value}));
	}, []);

	const addFeature = useCallback(() => {
		setProps((prev: Record<string, any>) => ({...prev, features: [...(prev.features || []), {title: '', description: ''}]}));
	}, []);
	const removeFeature = useCallback((index: number) => {
		setProps((prev: Record<string, any>) => ({...prev, features: (prev.features || []).filter((_: any, i: number) => i !== index)}));
	}, []);
	const updateFeature = useCallback((index: number, field: string, value: string) => {
		setProps((prev: Record<string, any>) => {
			const features = [...(prev.features || [])];
			features[index] = {...features[index], [field]: value};
			return {...prev, features};
		});
	}, []);

	const handleRender = async () => {
		setRendering(true); setDownloadUrl(null);
		try {
			const res = await fetch('/api/render', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({templateId, props})});
			if (!res.ok) { alert('Render failed: ' + await res.text()); return; }
			setDownloadUrl(URL.createObjectURL(await res.blob()));
		} catch (err: any) { alert('Error: ' + err.message); } finally { setRendering(false); }
	};

	if (!template || !Component) {
		return <div className="min-h-screen flex items-center justify-center"><p className="text-weaved-muted">Template not found</p><Link href="/" className="text-weaved-blue ml-4">← Back</Link></div>;
	}

	const defaultProps = getDefaultProps(templateId);
	const propKeys = Object.keys(defaultProps).filter((k) => k !== 'features');
	const hasFeatures = 'features' in defaultProps;

	return (
		<div className="h-screen flex flex-col overflow-hidden">
			<header className="border-b border-weaved-border bg-weaved-dark px-6 py-3 flex items-center justify-between shrink-0">
				<div className="flex items-center gap-4">
					<Link href="/" className="text-weaved-muted hover:text-weaved-light transition-colors">← Back</Link>
					<div className="h-6 w-px bg-weaved-border" />
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-weaved-blue to-weaved-cyan flex items-center justify-center">
							<span className="text-white font-bold text-sm italic font-serif">W</span>
						</div>
						<span className="font-semibold text-weaved-light">{template.name}</span>
					</div>
				</div>
				<div className="flex items-center gap-3">
					{downloadUrl && <a href={downloadUrl} download={`${templateId}-video.mp4`} className="px-5 py-2 rounded-lg bg-green-600 text-white font-medium text-sm">⬇ Download MP4</a>}
					<button onClick={handleRender} disabled={rendering} className="px-5 py-2 rounded-lg bg-gradient-to-r from-weaved-blue to-weaved-cyan text-white font-medium text-sm disabled:opacity-50">
						{rendering ? 'Rendering...' : '🎬 Render Video'}
					</button>
				</div>
			</header>
			<div className="flex flex-1 overflow-hidden">
				<div className="w-[420px] border-r border-gray-200 overflow-y-auto p-6 shrink-0 bg-white">
					<h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">Customize</h2>
					<div className="space-y-5">
						{propKeys.map((key) => (
							<div key={key}>
								<label className="block text-sm font-medium text-gray-700 mb-1.5">{labelMap[key] || key}</label>
								{isColorField(key) ? (
									<div className="flex items-center gap-3">
										<input type="color" value={props[key] || '#000000'} onChange={(e) => updateProp(key, e.target.value)} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer bg-white" />
										<input type="text" value={props[key] || ''} onChange={(e) => updateProp(key, e.target.value)} className="flex-1 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:border-weaved-blue focus:outline-none" />
									</div>
								) : isLongTextField(key) ? (
									<textarea value={props[key] || ''} onChange={(e) => updateProp(key, e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 text-sm resize-none focus:border-weaved-blue focus:outline-none" />
								) : (
									<input type="text" value={props[key] || ''} onChange={(e) => updateProp(key, e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:border-weaved-blue focus:outline-none" />
								)}
							</div>
						))}
						{hasFeatures && (
							<div className="pt-4 border-t border-gray-200">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Features</h3>
									<button onClick={addFeature} className="px-3 py-1.5 rounded-lg bg-weaved-blue text-white text-xs font-semibold">+ Add</button>
								</div>
								{(props.features || []).map((f: any, i: number) => (
									<div key={i} className="mb-3 p-3 rounded-xl bg-gray-50 border border-gray-200 relative">
										<button onClick={() => removeFeature(i)} className="absolute top-2 right-2 w-6 h-6 rounded bg-red-50 text-red-500 text-xs font-bold flex items-center justify-center">×</button>
										<input type="text" value={f.title || ''} onChange={(e) => updateFeature(i, 'title', e.target.value)} placeholder="Title" className="w-full px-3 py-1.5 rounded bg-white border border-gray-200 text-gray-900 text-sm mb-2" />
										<textarea value={f.description || ''} onChange={(e) => updateFeature(i, 'description', e.target.value)} placeholder="Description" rows={2} className="w-full px-3 py-1.5 rounded bg-white border border-gray-200 text-gray-900 text-sm resize-none" />
									</div>
								))}
							</div>
						)}
					</div>
				</div>
				<div className="flex-1 flex flex-col items-center justify-center bg-weaved-surface p-8">
					<div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-weaved-border">
						<Player component={Component} inputProps={props} durationInFrames={template.durationInFrames} compositionWidth={template.width} compositionHeight={template.height} fps={template.fps} controls style={{width: '100%', height: '100%'}} clickToPlay doubleClickToFullscreen />
					</div>
					<p className="text-xs text-weaved-muted mt-4">{template.durationInFrames / template.fps}s · {template.width}x{template.height} · {template.fps}fps</p>
					{rendering && <div className="mt-4 w-full max-w-md"><div className="h-2 bg-weaved-border rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-weaved-blue to-weaved-cyan rounded-full animate-pulse" style={{width: '100%'}} /></div><p className="text-xs text-weaved-muted mt-2 text-center">Rendering...</p></div>}
				</div>
			</div>
		</div>
	);
}
