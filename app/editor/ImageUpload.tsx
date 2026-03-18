'use client';

import {useState, useCallback} from 'react';

interface ImageUploadProps {
	value: string;
	onChange: (url: string) => void;
	label?: string;
}

export function ImageUpload({value, onChange, label = 'Image'}: ImageUploadProps) {
	const [uploading, setUploading] = useState(false);

	const handleUpload = useCallback(async (file: File) => {
		setUploading(true);
		try {
			const formData = new FormData();
			formData.append('file', file);
			const res = await fetch('/api/upload', {method: 'POST', body: formData});
			const data = await res.json();
			if (data.url) onChange(data.url);
			else alert(data.error || 'Upload failed');
		} catch {
			alert('Upload failed');
		} finally {
			setUploading(false);
		}
	}, [onChange]);

	const handleDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		const file = e.dataTransfer.files[0];
		if (file) handleUpload(file);
	}, [handleUpload]);

	const handleClick = useCallback(() => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.onchange = (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file) handleUpload(file);
		};
		input.click();
	}, [handleUpload]);

	return (
		<div>
			<label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
			{value ? (
				<div className="relative group">
					<img src={value} alt="" className="w-full h-32 object-cover rounded-lg border border-gray-200" />
					<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
						<button onClick={handleClick} className="px-3 py-1 bg-white text-gray-700 rounded-md text-xs font-medium">Replace</button>
						<button onClick={() => onChange('')} className="px-3 py-1 bg-red-500 text-white rounded-md text-xs font-medium">Remove</button>
					</div>
				</div>
			) : (
				<div
					onClick={handleClick}
					onDrop={handleDrop}
					onDragOver={(e) => e.preventDefault()}
					className="w-full h-28 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-weaved-blue hover:bg-blue-50/50 transition-colors"
				>
					{uploading ? (
						<span className="text-sm text-gray-400">Uploading...</span>
					) : (
						<>
							<span className="text-2xl mb-1">📷</span>
							<span className="text-xs text-gray-400">Drop image or click to upload</span>
						</>
					)}
				</div>
			)}
		</div>
	);
}
