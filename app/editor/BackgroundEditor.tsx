'use client';

import type {BackgroundConfig} from '@/src/lib/types';
import {ImageUpload} from './ImageUpload';

interface BackgroundEditorProps {
	value: BackgroundConfig;
	onChange: (bg: BackgroundConfig) => void;
}

export function BackgroundEditor({value, onChange}: BackgroundEditorProps) {
	const update = (patch: Partial<BackgroundConfig>) => onChange({...value, ...patch});

	return (
		<div className="space-y-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
			<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Background</label>

			{/* Type selector */}
			<div className="flex gap-1">
				{(['solid', 'gradient', 'image'] as const).map((t) => (
					<button
						key={t}
						onClick={() => update({type: t})}
						className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
							value.type === t
								? 'bg-weaved-blue text-white'
								: 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-100'
						}`}
					>
						{t.charAt(0).toUpperCase() + t.slice(1)}
					</button>
				))}
			</div>

			{/* Color inputs */}
			{(value.type === 'solid' || value.type === 'gradient') && (
				<div className="space-y-2">
					<div className="min-w-0">
						<label className="block text-xs text-gray-400 mb-1">{value.type === 'gradient' ? 'Start Color' : 'Color'}</label>
						<div className="flex items-center gap-2">
							<input type="color" value={value.color1} onChange={(e) => update({color1: e.target.value})} className="w-8 h-8 shrink-0 rounded border border-gray-200 cursor-pointer" />
							<input type="text" value={value.color1} onChange={(e) => update({color1: e.target.value})} className="w-full min-w-0 px-2 py-1 rounded bg-white border border-gray-200 text-gray-700 text-xs" />
						</div>
					</div>
					{value.type === 'gradient' && (
						<div className="min-w-0">
							<label className="block text-xs text-gray-400 mb-1">End Color</label>
							<div className="flex items-center gap-2">
								<input type="color" value={value.color2} onChange={(e) => update({color2: e.target.value})} className="w-8 h-8 shrink-0 rounded border border-gray-200 cursor-pointer" />
								<input type="text" value={value.color2} onChange={(e) => update({color2: e.target.value})} className="w-full min-w-0 px-2 py-1 rounded bg-white border border-gray-200 text-gray-700 text-xs" />
							</div>
						</div>
					)}
				</div>
			)}

			{/* Image upload */}
			{value.type === 'image' && (
				<>
					<ImageUpload value={value.imageSrc} onChange={(src) => update({imageSrc: src})} label="Background Image" />
					<div>
						<label className="block text-xs text-gray-400 mb-1">Overlay Darkness: {Math.round(value.overlayOpacity * 100)}%</label>
						<input type="range" min={0} max={100} value={value.overlayOpacity * 100} onChange={(e) => update({overlayOpacity: Number(e.target.value) / 100})} className="w-full accent-weaved-blue" />
					</div>
				</>
			)}
		</div>
	);
}
