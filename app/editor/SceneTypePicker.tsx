'use client';

import {SCENE_TYPES} from '@/src/lib/types';
import type {SceneConfig} from '@/src/lib/types';

interface SceneTypePickerProps {
	onSelect: (type: SceneConfig['type']) => void;
	onClose: () => void;
}

export function SceneTypePicker({onSelect, onClose}: SceneTypePickerProps) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
			<div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
				<div className="flex items-center justify-between mb-5">
					<h2 className="text-lg font-bold text-gray-900">Add Scene</h2>
					<button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center text-lg">×</button>
				</div>
				<div className="grid grid-cols-2 gap-3">
					{SCENE_TYPES.map((st) => (
						<button
							key={st.type}
							onClick={() => {onSelect(st.type); onClose();}}
							className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-weaved-blue hover:bg-blue-50/50 transition-all text-left group"
						>
							<span className="text-2xl mt-0.5">{st.icon}</span>
							<div>
								<div className="text-sm font-semibold text-gray-900 group-hover:text-weaved-blue">{st.name}</div>
								<div className="text-xs text-gray-400 mt-0.5">{st.description}</div>
							</div>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
