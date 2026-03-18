'use client';

import {useState, useCallback, useEffect} from 'react';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {Player} from '@remotion/player';
import {DynamicComposition, calculateTotalDuration} from '@/src/templates/DynamicComposition';
import {createDefaultProject, createDefaultScene, SCENE_TYPES} from '@/src/lib/types';
import type {VideoProject, Scene, SceneConfig} from '@/src/lib/types';
import {scrapeDataToProject} from '@/src/lib/url-to-project';
import {SceneFormFields} from './SceneFormFields';
import {SceneTypePicker} from './SceneTypePicker';
import {ImageUpload} from './ImageUpload';
import {VoiceoverPanel} from './VoiceoverPanel';
import {MusicPanel} from './MusicPanel';

function loadInitialProject(): VideoProject {
	// Check if we have scrape data from URL-to-Video
	if (typeof window !== 'undefined') {
		const scrapeJson = sessionStorage.getItem('scrape-data');
		if (scrapeJson) {
			sessionStorage.removeItem('scrape-data');
			try {
				const scrapeData = JSON.parse(scrapeJson);
				return scrapeDataToProject(scrapeData);
			} catch {}
		}
	}
	return createDefaultProject();
}

export function EditorContent({templateId}: {templateId: string}) {
	const searchParams = useSearchParams();
	const isFromUrl = searchParams.get('source') === 'url';
	const [project, setProject] = useState<VideoProject>(() => loadInitialProject());
	const [expandedScene, setExpandedScene] = useState<string | null>(project.scenes[0]?.id || null);
	const [showPicker, setShowPicker] = useState(false);
	const [rendering, setRendering] = useState(false);
	const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
	const [exportFormat, setExportFormat] = useState<'mp4' | 'webm' | 'gif'>('mp4');
	const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
	const [dragIndex, setDragIndex] = useState<number | null>(null);
	const [voiceoverUrl, setVoiceoverUrl] = useState('');
	const [musicUrl, setMusicUrl] = useState('');
	const [musicVolume, setMusicVolume] = useState(0.3);

	// Brand updates
	const updateBrand = useCallback((patch: Partial<VideoProject['brand']>) => {
		setProject((prev) => ({...prev, brand: {...prev.brand, ...patch}}));
	}, []);

	// Scene CRUD
	const addScene = useCallback((type: SceneConfig['type']) => {
		const id = `scene-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
		const newScene: Scene = {id, config: createDefaultScene(type)};
		setProject((prev) => ({...prev, scenes: [...prev.scenes, newScene]}));
		setExpandedScene(id);
	}, []);

	const updateScene = useCallback((id: string, config: SceneConfig) => {
		setProject((prev) => ({
			...prev,
			scenes: prev.scenes.map((s) => (s.id === id ? {...s, config} : s)),
		}));
	}, []);

	const removeScene = useCallback((id: string) => {
		setProject((prev) => {
			const scenes = prev.scenes.filter((s) => s.id !== id);
			return {...prev, scenes};
		});
		setExpandedScene((prev) => (prev === id ? null : prev));
	}, []);

	const duplicateScene = useCallback((id: string) => {
		setProject((prev) => {
			const idx = prev.scenes.findIndex((s) => s.id === id);
			if (idx === -1) return prev;
			const original = prev.scenes[idx];
			const newId = `scene-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
			const clone: Scene = {id: newId, config: JSON.parse(JSON.stringify(original.config))};
			const scenes = [...prev.scenes];
			scenes.splice(idx + 1, 0, clone);
			return {...prev, scenes};
		});
	}, []);

	const moveScene = useCallback((fromIndex: number, toIndex: number) => {
		setProject((prev) => {
			const scenes = [...prev.scenes];
			const [moved] = scenes.splice(fromIndex, 1);
			scenes.splice(toIndex, 0, moved);
			return {...prev, scenes};
		});
	}, []);

	// Drag handlers
	const handleDragStart = (index: number) => {
		setDragIndex(index);
	};
	const handleDragOver = (e: React.DragEvent, index: number) => {
		e.preventDefault();
		setDragOverIndex(index);
	};
	const handleDrop = (index: number) => {
		if (dragIndex !== null && dragIndex !== index) {
			moveScene(dragIndex, index);
		}
		setDragIndex(null);
		setDragOverIndex(null);
	};
	const handleDragEnd = () => {
		setDragIndex(null);
		setDragOverIndex(null);
	};

	// Render
	const handleRender = async () => {
		setRendering(true);
		setDownloadUrl(null);
		try {
			const res = await fetch('/api/render', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					templateId: 'product-demo-v2',
					props: {brand: project.brand, scenes: project.scenes, voiceoverUrl: voiceoverUrl || undefined, musicUrl: musicUrl || undefined, musicVolume},
					format: exportFormat,
				}),
			});
			if (!res.ok) {
				alert('Render failed: ' + await res.text());
				return;
			}
			const blob = await res.blob();
			setDownloadUrl(URL.createObjectURL(blob));
		} catch (err: any) {
			alert('Render error: ' + err.message);
		} finally {
			setRendering(false);
		}
	};

	const totalDuration = calculateTotalDuration(project.scenes);
	const sceneTypeMeta = (type: string) => SCENE_TYPES.find((st) => st.type === type);

	return (
		<div className="h-screen flex flex-col overflow-hidden">
			{/* Header */}
			<header className="border-b border-weaved-border bg-weaved-dark px-6 py-3 flex items-center justify-between shrink-0">
				<div className="flex items-center gap-4">
					<Link href="/" className="text-weaved-muted hover:text-weaved-light transition-colors">← Back</Link>
					<div className="h-6 w-px bg-weaved-border" />
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-weaved-blue to-weaved-cyan flex items-center justify-center">
							<span className="text-white font-bold text-sm italic font-serif">W</span>
						</div>
						<span className="font-semibold text-weaved-light">Product Demo</span>
						<span className="text-xs text-weaved-muted bg-weaved-surface px-2 py-0.5 rounded">V2</span>
					</div>
				</div>
				<div className="flex items-center gap-3">
					{downloadUrl && (
						<a href={downloadUrl} download={`product-demo.${exportFormat}`} className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium text-sm transition-colors">
							⬇ Save File
						</a>
					)}
					<select
						value={exportFormat}
						onChange={(e) => {setExportFormat(e.target.value as any); setDownloadUrl(null);}}
						className="px-2 py-2 rounded-lg bg-weaved-surface border border-weaved-border text-weaved-light text-sm focus:outline-none"
					>
						<option value="mp4">MP4</option>
						<option value="webm">WebM</option>
						<option value="gif">GIF</option>
					</select>
					<button onClick={handleRender} disabled={rendering || project.scenes.length === 0} className="px-5 py-2 rounded-lg bg-gradient-to-r from-weaved-blue to-weaved-cyan text-white font-medium text-sm disabled:opacity-50 hover:shadow-lg hover:shadow-weaved-blue/20 transition-all">
						{rendering ? 'Preparing download...' : `⬇ Download ${exportFormat.toUpperCase()}`}
					</button>
				</div>
			</header>

			<div className="flex flex-1 overflow-hidden">
				{/* Left: Scene Editor — Light Theme */}
				<div className="w-[440px] border-r border-gray-200 overflow-y-auto shrink-0 bg-white">
					{/* Brand Settings */}
					<div className="p-5 border-b border-gray-100">
						<h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Brand</h2>
						<div className="space-y-3">
							<div>
								<label className="block text-xs font-medium text-gray-500 mb-1">Brand Name</label>
								<input type="text" value={project.brand.brandName} onChange={(e) => updateBrand({brandName: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:border-weaved-blue focus:outline-none" />
							</div>
							<ImageUpload value={project.brand.logoSrc} onChange={(v) => updateBrand({logoSrc: v})} label="Logo" />
							<div className="flex gap-3">
								<div className="flex-1">
									<label className="block text-xs font-medium text-gray-500 mb-1">Primary</label>
									<div className="flex items-center gap-2">
										<input type="color" value={project.brand.primaryColor} onChange={(e) => updateBrand({primaryColor: e.target.value})} className="w-8 h-8 rounded border border-gray-200 cursor-pointer" />
										<input type="text" value={project.brand.primaryColor} onChange={(e) => updateBrand({primaryColor: e.target.value})} className="flex-1 px-2 py-1.5 rounded bg-gray-50 border border-gray-200 text-gray-700 text-xs" />
									</div>
								</div>
								<div className="flex-1">
									<label className="block text-xs font-medium text-gray-500 mb-1">Accent</label>
									<div className="flex items-center gap-2">
										<input type="color" value={project.brand.accentColor} onChange={(e) => updateBrand({accentColor: e.target.value})} className="w-8 h-8 rounded border border-gray-200 cursor-pointer" />
										<input type="text" value={project.brand.accentColor} onChange={(e) => updateBrand({accentColor: e.target.value})} className="flex-1 px-2 py-1.5 rounded bg-gray-50 border border-gray-200 text-gray-700 text-xs" />
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Voiceover */}
					<VoiceoverPanel project={project} voiceoverUrl={voiceoverUrl} onVoiceoverChange={setVoiceoverUrl} />

					{/* Background Music */}
					<MusicPanel musicUrl={musicUrl} musicVolume={musicVolume} onMusicChange={setMusicUrl} onVolumeChange={setMusicVolume} />

					{/* Scenes */}
					<div className="p-5">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Scenes ({project.scenes.length})</h2>
							<button onClick={() => setShowPicker(true)} className="px-3 py-1.5 rounded-lg bg-weaved-blue text-white text-xs font-semibold hover:bg-weaved-blue/90 transition-colors flex items-center gap-1">
								<span className="text-base leading-none">+</span> Add Scene
							</button>
						</div>

						{project.scenes.length === 0 && (
							<div className="text-center py-10">
								<p className="text-gray-400 text-sm mb-3">No scenes yet</p>
								<button onClick={() => setShowPicker(true)} className="px-4 py-2 rounded-lg bg-weaved-blue text-white text-sm font-medium">+ Add Your First Scene</button>
							</div>
						)}

						{/* Scene cards (accordion) */}
						<div className="space-y-2">
							{project.scenes.map((scene, index) => {
								const meta = sceneTypeMeta(scene.config.type);
								const isExpanded = expandedScene === scene.id;
								const isDragging = dragIndex === index;
								const isDragOver = dragOverIndex === index;

								return (
									<div
										key={scene.id}
										draggable
										onDragStart={() => handleDragStart(index)}
										onDragOver={(e) => handleDragOver(e, index)}
										onDrop={() => handleDrop(index)}
										onDragEnd={handleDragEnd}
										className={`rounded-xl border transition-all ${
											isDragOver ? 'border-weaved-blue bg-blue-50/50' :
											isDragging ? 'opacity-50 border-gray-200' :
											isExpanded ? 'border-weaved-blue/30 bg-white shadow-sm' : 'border-gray-200 bg-white'
										}`}
									>
										{/* Scene header */}
										<div
											className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
											onClick={() => setExpandedScene(isExpanded ? null : scene.id)}
										>
											{/* Drag handle */}
											<span className="text-gray-300 cursor-grab text-sm" title="Drag to reorder">⠿</span>
											{/* Icon */}
											<span className="text-lg">{meta?.icon}</span>
											{/* Name */}
											<div className="flex-1 min-w-0">
												<div className="text-sm font-semibold text-gray-800 truncate">{meta?.name}</div>
												<div className="text-xs text-gray-400">{(scene.config.durationInFrames / 30).toFixed(1)}s</div>
											</div>
											{/* Actions */}
											<button
												onClick={(e) => {e.stopPropagation(); duplicateScene(scene.id);}}
												className="w-7 h-7 rounded-lg bg-gray-100 text-gray-400 hover:bg-blue-50 hover:text-weaved-blue text-xs flex items-center justify-center transition-colors"
												title="Duplicate scene"
											>
												⧉
											</button>
											<button
												onClick={(e) => {e.stopPropagation(); removeScene(scene.id);}}
												className="w-7 h-7 rounded-lg bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 text-sm flex items-center justify-center transition-colors"
												title="Remove scene"
											>
												×
											</button>
											<span className={`text-gray-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▾</span>
										</div>

										{/* Expanded form */}
										{isExpanded && (
											<div className="px-4 pb-4 border-t border-gray-100 pt-4">
												<SceneFormFields
													config={scene.config}
													onChange={(config) => updateScene(scene.id, config)}
												/>
											</div>
										)}
									</div>
								);
							})}
						</div>
					</div>
				</div>

				{/* Right: Player Preview */}
				<div className="flex-1 flex flex-col items-center justify-center bg-weaved-surface p-8">
					<div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-weaved-border">
						<Player
							component={DynamicComposition as any}
							inputProps={{brand: project.brand, scenes: project.scenes, voiceoverUrl: voiceoverUrl || undefined, musicUrl: musicUrl || undefined, musicVolume}}
							durationInFrames={totalDuration}
							compositionWidth={1920}
							compositionHeight={1080}
							fps={30}
							controls
							style={{width: '100%', height: '100%'}}
							clickToPlay
							doubleClickToFullscreen
						/>
					</div>
					<p className="text-xs text-weaved-muted mt-4">
						{(totalDuration / 30).toFixed(1)}s · 1920x1080 · 30fps · {project.scenes.length} scenes
					</p>

					{rendering && (
						<div className="mt-4 w-full max-w-md">
							<div className="h-2 bg-weaved-border rounded-full overflow-hidden">
								<div className="h-full bg-gradient-to-r from-weaved-blue to-weaved-cyan rounded-full animate-pulse" style={{width: '100%'}} />
							</div>
							<p className="text-xs text-weaved-muted mt-2 text-center">Preparing your video for download... This may take a moment.</p>
						</div>
					)}
				</div>
			</div>

			{/* Scene Type Picker Modal */}
			{showPicker && <SceneTypePicker onSelect={addScene} onClose={() => setShowPicker(false)} />}
		</div>
	);
}
