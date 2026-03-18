'use client';

import {useState, useCallback} from 'react';

interface MusicPanelProps {
	musicUrl: string;
	musicVolume: number;
	onMusicChange: (url: string) => void;
	onVolumeChange: (vol: number) => void;
}

export function MusicPanel({musicUrl, musicVolume, onMusicChange, onVolumeChange}: MusicPanelProps) {
	const [enabled, setEnabled] = useState(!!musicUrl);
	const [uploading, setUploading] = useState(false);

	const handleUpload = useCallback(async (file: File) => {
		setUploading(true);
		try {
			const formData = new FormData();
			formData.append('file', file);
			const res = await fetch('/api/upload', {method: 'POST', body: formData});
			const data = await res.json();
			if (data.url) onMusicChange(data.url);
			else alert(data.error || 'Upload failed');
		} catch {
			alert('Upload failed');
		} finally {
			setUploading(false);
		}
	}, [onMusicChange]);

	const handleClick = useCallback(() => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'audio/*';
		input.onchange = (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file) handleUpload(file);
		};
		input.click();
	}, [handleUpload]);

	if (!enabled) {
		return (
			<div className="p-5 border-b border-gray-100">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="text-lg">🎵</span>
						<span className="text-sm font-semibold text-gray-700">Background Music</span>
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
		<div className="p-5 border-b border-gray-100 space-y-3">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="text-lg">🎵</span>
					<span className="text-sm font-semibold text-gray-700">Background Music</span>
				</div>
				<button
					onClick={() => {setEnabled(false); onMusicChange('');}}
					className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-medium hover:bg-red-100 transition-colors"
				>
					Disable
				</button>
			</div>

			{musicUrl ? (
				<div className="space-y-3">
					<div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
						<div className="flex items-center justify-between mb-2">
							<span className="text-xs font-medium text-gray-500">Music Track</span>
							<button onClick={handleClick} className="text-xs text-weaved-blue hover:underline">Replace</button>
						</div>
						<audio controls src={musicUrl} className="w-full h-8" />
					</div>
					<div>
						<label className="block text-xs font-medium text-gray-500 mb-1">Volume: {Math.round(musicVolume * 100)}%</label>
						<input type="range" min={0} max={100} value={musicVolume * 100} onChange={(e) => onVolumeChange(Number(e.target.value) / 100)} className="w-full accent-weaved-blue" />
					</div>
				</div>
			) : (
				<div
					onClick={handleClick}
					onDrop={(e) => {e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleUpload(f);}}
					onDragOver={(e) => e.preventDefault()}
					className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-weaved-blue hover:bg-blue-50/50 transition-colors"
				>
					{uploading ? (
						<span className="text-sm text-gray-400">Uploading...</span>
					) : (
						<>
							<span className="text-2xl mb-1">🎵</span>
							<span className="text-xs text-gray-400">Drop audio or click to upload</span>
						</>
					)}
				</div>
			)}
		</div>
	);
}
