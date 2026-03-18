'use client';

import {useState, useCallback, useEffect} from 'react';
import type {VideoProject} from '@/src/lib/types';
import {richTextToPlain} from '@/src/lib/richtext-helpers';

const VOICES = [
	{id: 'Daniel', name: 'Daniel', gender: 'Male'},
	{id: 'Sarah', name: 'Sarah', gender: 'Female'},
	{id: 'Alice', name: 'Alice', gender: 'Female'},
	{id: 'Brian', name: 'Brian', gender: 'Male'},
	{id: 'Aria', name: 'Aria', gender: 'Female'},
	{id: 'Roger', name: 'Roger', gender: 'Male'},
	{id: 'Charlotte', name: 'Charlotte', gender: 'Female'},
	{id: 'Eric', name: 'Eric', gender: 'Male'},
	{id: 'Lily', name: 'Lily', gender: 'Female'},
	{id: 'Chris', name: 'Chris', gender: 'Male'},
	{id: 'Laura', name: 'Laura', gender: 'Female'},
	{id: 'George', name: 'George', gender: 'Male'},
	{id: 'Jessica', name: 'Jessica', gender: 'Female'},
	{id: 'Will', name: 'Will', gender: 'Male'},
	{id: 'Matilda', name: 'Matilda', gender: 'Female'},
	{id: 'Liam', name: 'Liam', gender: 'Male'},
	{id: 'Charlie', name: 'Charlie', gender: 'Male'},
	{id: 'Callum', name: 'Callum', gender: 'Male'},
	{id: 'River', name: 'River', gender: 'Non-binary'},
	{id: 'Bill', name: 'Bill', gender: 'Male'},
];

interface VoiceoverPanelProps {
	project: VideoProject;
	voiceoverUrl: string;
	onVoiceoverChange: (url: string) => void;
}

function generateScriptFromProject(project: VideoProject): string {
	const parts: string[] = [];

	for (const scene of project.scenes) {
		const c = scene.config;
		switch (c.type) {
			case 'hero':
				parts.push(`${c.headline}. ${c.subtitle}`);
				break;
			case 'problem':
				parts.push(`${c.headline}. ${richTextToPlain(c.bodyContent)}`);
				break;
			case 'solution':
				parts.push(`${c.productName}. ${c.tagline}`);
				break;
			case 'feature-spotlight':
				parts.push(`${c.title}. ${richTextToPlain(c.descriptionContent)}`);
				break;
			case 'feature-grid':
				parts.push(`${c.headline}. ${c.features.map(f => f.title).join('. ')}.`);
				break;
			case 'image-text':
				parts.push(`${c.headline}. ${richTextToPlain(c.bodyContent)}`);
				break;
			case 'stats':
				parts.push(`${c.headline}. ${c.stats.map(s => `${s.value} ${s.label}`).join('. ')}.`);
				break;
			case 'testimonial':
				parts.push(`${richTextToPlain(c.quoteContent)} — ${c.personName}, ${c.personRole}`);
				break;
			case 'logo-wall':
				if (c.logos.length > 0) parts.push(`${c.headline}. Trusted by ${c.logos.map(l => l.name).join(', ')}.`);
				break;
			case 'cta':
				parts.push(`${c.headline}. ${richTextToPlain(c.subtitleContent)}. ${c.buttonText}.`);
				break;
			case 'custom':
				for (const block of c.blocks) {
					if (block.blockType === 'heading') parts.push(block.text);
					if (block.blockType === 'text') parts.push(richTextToPlain(block.content));
					if (block.blockType === 'icon-text') parts.push(`${block.title}. ${block.description}`);
				}
				break;
		}
	}

	return parts.filter(Boolean).join('\n\n');
}

export function VoiceoverPanel({project, voiceoverUrl, onVoiceoverChange}: VoiceoverPanelProps) {
	const [enabled, setEnabled] = useState(!!voiceoverUrl);
	const [apiKey, setApiKey] = useState('');
	const [voiceId, setVoiceId] = useState('Daniel');
	const [script, setScript] = useState('');
	const [generating, setGenerating] = useState(false);
	const [error, setError] = useState('');

	// Load API key from localStorage
	useEffect(() => {
		const saved = localStorage.getItem('wavespeed-api-key');
		if (saved) setApiKey(saved);
	}, []);

	const saveApiKey = (key: string) => {
		setApiKey(key);
		localStorage.setItem('wavespeed-api-key', key);
	};

	const handleAutoScript = useCallback(() => {
		setScript(generateScriptFromProject(project));
	}, [project]);

	const handleGenerate = async () => {
		if (!script.trim() || !apiKey.trim()) {
			setError('Script and API key are required');
			return;
		}
		setGenerating(true);
		setError('');

		try {
			const res = await fetch('/api/voiceover', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({text: script, voiceId, apiKey}),
			});

			if (!res.ok) {
				const data = await res.json();
				setError(data.error || 'Failed to generate voiceover');
				return;
			}

			const data = await res.json();
			onVoiceoverChange(data.audioUrl);
		} catch (err: any) {
			setError(err.message || 'Something went wrong');
		} finally {
			setGenerating(false);
		}
	};

	if (!enabled) {
		return (
			<div className="p-5 border-b border-gray-100">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="text-lg">🎙️</span>
						<span className="text-sm font-semibold text-gray-700">AI Voiceover</span>
					</div>
					<button
						onClick={() => setEnabled(true)}
						className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 text-xs font-medium hover:bg-weaved-blue hover:text-white transition-colors"
					>
						Enable
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="p-5 border-b border-gray-100 space-y-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="text-lg">🎙️</span>
					<span className="text-sm font-semibold text-gray-700">AI Voiceover</span>
				</div>
				<button
					onClick={() => {setEnabled(false); onVoiceoverChange('');}}
					className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-medium hover:bg-red-100 transition-colors"
				>
					Disable
				</button>
			</div>

			{/* API Key */}
			<div>
				<label className="block text-xs font-medium text-gray-500 mb-1">WaveSpeed API Key</label>
				<input
					type="password"
					value={apiKey}
					onChange={(e) => saveApiKey(e.target.value)}
					placeholder="Enter your API key"
					className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:border-weaved-blue focus:outline-none"
				/>
			</div>

			{/* Voice Selection */}
			<div>
				<label className="block text-xs font-medium text-gray-500 mb-1">Voice</label>
				<select
					value={voiceId}
					onChange={(e) => setVoiceId(e.target.value)}
					className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:border-weaved-blue focus:outline-none"
				>
					{VOICES.map((v) => (
						<option key={v.id} value={v.id}>{v.name} ({v.gender})</option>
					))}
				</select>
			</div>

			{/* Script */}
			<div>
				<div className="flex items-center justify-between mb-1">
					<label className="text-xs font-medium text-gray-500">Script</label>
					<button
						onClick={handleAutoScript}
						className="text-xs text-weaved-blue font-medium hover:underline"
					>
						Auto-generate from scenes
					</button>
				</div>
				<textarea
					value={script}
					onChange={(e) => setScript(e.target.value)}
					rows={6}
					placeholder="Write your voiceover script here, or click 'Auto-generate' to create one from your scenes..."
					className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 text-sm resize-none focus:border-weaved-blue focus:outline-none"
				/>
				<p className="text-xs text-gray-400 mt-1">{script.length} characters · ~${((script.length / 1000) * 0.1).toFixed(2)} estimated cost</p>
			</div>

			{/* Generate */}
			<button
				onClick={handleGenerate}
				disabled={generating || !script.trim() || !apiKey.trim()}
				className="w-full py-2.5 rounded-lg bg-gradient-to-r from-weaved-blue to-weaved-cyan text-white font-semibold text-sm disabled:opacity-50 hover:shadow-lg transition-all"
			>
				{generating ? (
					<span className="flex items-center justify-center gap-2">
						<span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
						Generating voiceover...
					</span>
				) : '🎙️ Generate Voiceover'}
			</button>

			{error && <p className="text-xs text-red-500">{error}</p>}

			{/* Audio Preview */}
			{voiceoverUrl && (
				<div className="p-3 rounded-lg bg-green-50 border border-green-200">
					<div className="flex items-center justify-between mb-2">
						<span className="text-xs font-semibold text-green-700">Voiceover Ready</span>
						<button
							onClick={() => onVoiceoverChange('')}
							className="text-xs text-red-500 hover:underline"
						>
							Remove
						</button>
					</div>
					<audio controls src={voiceoverUrl} className="w-full h-8" style={{filter: 'hue-rotate(200deg)'}} />
				</div>
			)}
		</div>
	);
}
