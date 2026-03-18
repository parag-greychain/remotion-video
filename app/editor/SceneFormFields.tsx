'use client';

import type {SceneConfig, BrandSettings, ContentBlock, CustomLayout, ContentBlockType} from '@/src/lib/types';
import {LAYOUT_PRESETS, BLOCK_TYPES} from '@/src/lib/types';
import {BackgroundEditor} from './BackgroundEditor';
import {ImageUpload} from './ImageUpload';
import {RichTextEditor} from './RichTextEditor';
import {plainToRichText} from '@/src/lib/richtext-helpers';

interface SceneFormProps {
	config: SceneConfig;
	onChange: (config: SceneConfig) => void;
}

function TextInput({label, value, onChange, textarea}: {label: string; value: string; onChange: (v: string) => void; textarea?: boolean}) {
	const cls = "w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-900 text-sm focus:border-weaved-blue focus:outline-none focus:ring-1 focus:ring-weaved-blue/30 transition-colors";
	return (
		<div>
			<label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
			{textarea ? (
				<textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={cls + ' resize-none'} />
			) : (
				<input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
			)}
		</div>
	);
}

function SelectInput({label, value, options, onChange}: {label: string; value: string; options: {value: string; label: string}[]; onChange: (v: string) => void}) {
	return (
		<div>
			<label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
			<select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-900 text-sm focus:border-weaved-blue focus:outline-none">
				{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
			</select>
		</div>
	);
}

function DurationSlider({value, onChange}: {value: number; onChange: (v: number) => void}) {
	return (
		<div>
			<label className="block text-xs font-medium text-gray-500 mb-1.5">Duration: {(value / 30).toFixed(1)}s ({value} frames)</label>
			<input type="range" min={30} max={300} step={15} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-weaved-blue" />
		</div>
	);
}

// Dynamic list helper
function DynamicList({items, onAdd, onRemove, onUpdate, renderItem, addLabel}: {
	items: any[];
	onAdd: () => void;
	onRemove: (i: number) => void;
	onUpdate: (i: number, v: any) => void;
	renderItem: (item: any, i: number, update: (v: any) => void) => React.ReactNode;
	addLabel: string;
}) {
	return (
		<div>
			<div className="flex items-center justify-between mb-2">
				<label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{addLabel}s</label>
				<button onClick={onAdd} className="px-2 py-1 rounded bg-weaved-blue text-white text-xs font-semibold hover:bg-weaved-blue/90">+ Add</button>
			</div>
			{items.map((item, i) => (
				<div key={i} className="mb-2 p-3 rounded-lg bg-gray-50 border border-gray-200 relative">
					<button onClick={() => onRemove(i)} className="absolute top-2 right-2 w-6 h-6 rounded bg-red-50 text-red-500 hover:bg-red-100 text-xs font-bold flex items-center justify-center">×</button>
					{renderItem(item, i, (v: any) => onUpdate(i, v))}
				</div>
			))}
		</div>
	);
}

export function SceneFormFields({config, onChange}: SceneFormProps) {
	const update = (patch: Partial<SceneConfig>) => onChange({...config, ...patch} as SceneConfig);

	switch (config.type) {
		case 'hero':
			return (
				<div className="space-y-4">
					<TextInput label="Headline" value={config.headline} onChange={(v) => update({headline: v})} />
					<TextInput label="Subtitle" value={config.subtitle} onChange={(v) => update({subtitle: v})} textarea />
					<BackgroundEditor value={config.background} onChange={(bg) => update({background: bg})} />
					<DurationSlider value={config.durationInFrames} onChange={(v) => update({durationInFrames: v})} />
				</div>
			);

		case 'problem':
			return (
				<div className="space-y-4">
					<TextInput label="Headline" value={config.headline} onChange={(v) => update({headline: v})} />
					<RichTextEditor label="Content (use toolbar for bullets, bold, etc.)" value={config.bodyContent} onChange={(v) => update({bodyContent: v})} />
					<BackgroundEditor value={config.background} onChange={(bg) => update({background: bg})} />
					<DurationSlider value={config.durationInFrames} onChange={(v) => update({durationInFrames: v})} />
				</div>
			);

		case 'solution':
			return (
				<div className="space-y-4">
					<TextInput label="Product Name" value={config.productName} onChange={(v) => update({productName: v})} />
					<TextInput label="Tagline" value={config.tagline} onChange={(v) => update({tagline: v})} />
					<ImageUpload value={config.productImageSrc} onChange={(v) => update({productImageSrc: v})} label="Product Image / Screenshot" />
					<BackgroundEditor value={config.background} onChange={(bg) => update({background: bg})} />
					<DurationSlider value={config.durationInFrames} onChange={(v) => update({durationInFrames: v})} />
				</div>
			);

		case 'feature-spotlight':
			return (
				<div className="space-y-4">
					<TextInput label="Feature Title" value={config.title} onChange={(v) => update({title: v})} />
					<RichTextEditor label="Description" value={config.descriptionContent} onChange={(v) => update({descriptionContent: v})} compact />
					<ImageUpload value={config.imageSrc} onChange={(v) => update({imageSrc: v})} label="Feature Image" />
					<SelectInput label="Layout" value={config.layout} onChange={(v) => update({layout: v as any})} options={[{value: 'image-left', label: 'Image Left'}, {value: 'image-right', label: 'Image Right'}]} />
					<BackgroundEditor value={config.background} onChange={(bg) => update({background: bg})} />
					<DurationSlider value={config.durationInFrames} onChange={(v) => update({durationInFrames: v})} />
				</div>
			);

		case 'feature-grid':
			return (
				<div className="space-y-4">
					<TextInput label="Section Headline" value={config.headline} onChange={(v) => update({headline: v})} />
					<DynamicList
						items={config.features}
						onAdd={() => update({features: [...config.features, {title: 'New Feature', description: 'Description'}]})}
						onRemove={(i) => update({features: config.features.filter((_, idx) => idx !== i)})}
						onUpdate={(i, v) => {const f = [...config.features]; f[i] = v; update({features: f});}}
						renderItem={(item, i, upd) => (
							<div className="space-y-1.5 pr-6">
								<input type="text" value={item.title} onChange={(e) => upd({...item, title: e.target.value})} placeholder="Title" className="w-full px-2 py-1.5 rounded bg-white border border-gray-200 text-gray-900 text-sm" />
								<input type="text" value={item.description} onChange={(e) => upd({...item, description: e.target.value})} placeholder="Description" className="w-full px-2 py-1.5 rounded bg-white border border-gray-200 text-gray-500 text-sm" />
							</div>
						)}
						addLabel="Feature"
					/>
					<BackgroundEditor value={config.background} onChange={(bg) => update({background: bg})} />
					<DurationSlider value={config.durationInFrames} onChange={(v) => update({durationInFrames: v})} />
				</div>
			);

		case 'image-text':
			return (
				<div className="space-y-4">
					<TextInput label="Headline" value={config.headline} onChange={(v) => update({headline: v})} />
					<RichTextEditor label="Body Content" value={config.bodyContent} onChange={(v) => update({bodyContent: v})} />
					<ImageUpload value={config.imageSrc} onChange={(v) => update({imageSrc: v})} label="Image" />
					<SelectInput label="Layout" value={config.layout} onChange={(v) => update({layout: v as any})} options={[{value: 'image-left', label: 'Image Left'}, {value: 'image-right', label: 'Image Right'}]} />
					<BackgroundEditor value={config.background} onChange={(bg) => update({background: bg})} />
					<DurationSlider value={config.durationInFrames} onChange={(v) => update({durationInFrames: v})} />
				</div>
			);

		case 'stats':
			return (
				<div className="space-y-4">
					<TextInput label="Section Headline" value={config.headline} onChange={(v) => update({headline: v})} />
					<DynamicList
						items={config.stats}
						onAdd={() => update({stats: [...config.stats, {value: '0', label: 'Metric'}]})}
						onRemove={(i) => update({stats: config.stats.filter((_, idx) => idx !== i)})}
						onUpdate={(i, v) => {const s = [...config.stats]; s[i] = v; update({stats: s});}}
						renderItem={(item, i, upd) => (
							<div className="flex gap-2 pr-6">
								<input type="text" value={item.value} onChange={(e) => upd({...item, value: e.target.value})} placeholder="Value" className="w-24 px-2 py-1.5 rounded bg-white border border-gray-200 text-gray-900 text-sm font-bold" />
								<input type="text" value={item.label} onChange={(e) => upd({...item, label: e.target.value})} placeholder="Label" className="flex-1 px-2 py-1.5 rounded bg-white border border-gray-200 text-gray-500 text-sm" />
							</div>
						)}
						addLabel="Stat"
					/>
					<BackgroundEditor value={config.background} onChange={(bg) => update({background: bg})} />
					<DurationSlider value={config.durationInFrames} onChange={(v) => update({durationInFrames: v})} />
				</div>
			);

		case 'testimonial':
			return (
				<div className="space-y-4">
					<RichTextEditor label="Quote" value={config.quoteContent} onChange={(v) => update({quoteContent: v})} compact />
					<TextInput label="Person Name" value={config.personName} onChange={(v) => update({personName: v})} />
					<TextInput label="Role / Company" value={config.personRole} onChange={(v) => update({personRole: v})} />
					<ImageUpload value={config.avatarSrc} onChange={(v) => update({avatarSrc: v})} label="Avatar Photo" />
					<div>
						<label className="block text-xs font-medium text-gray-500 mb-1.5">Star Rating: {config.starRating}/5</label>
						<input type="range" min={1} max={5} step={1} value={config.starRating} onChange={(e) => update({starRating: Number(e.target.value)})} className="w-full accent-yellow-500" />
					</div>
					<BackgroundEditor value={config.background} onChange={(bg) => update({background: bg})} />
					<DurationSlider value={config.durationInFrames} onChange={(v) => update({durationInFrames: v})} />
				</div>
			);

		case 'logo-wall':
			return (
				<div className="space-y-4">
					<TextInput label="Headline" value={config.headline} onChange={(v) => update({headline: v})} />
					<DynamicList
						items={config.logos}
						onAdd={() => update({logos: [...config.logos, {src: '', name: 'Company'}]})}
						onRemove={(i) => update({logos: config.logos.filter((_, idx) => idx !== i)})}
						onUpdate={(i, v) => {const l = [...config.logos]; l[i] = v; update({logos: l});}}
						renderItem={(item, i, upd) => (
							<div className="space-y-2 pr-6">
								<input type="text" value={item.name} onChange={(e) => upd({...item, name: e.target.value})} placeholder="Company name" className="w-full px-2 py-1.5 rounded bg-white border border-gray-200 text-gray-900 text-sm" />
								<ImageUpload value={item.src} onChange={(src) => upd({...item, src})} label="Logo" />
							</div>
						)}
						addLabel="Logo"
					/>
					<BackgroundEditor value={config.background} onChange={(bg) => update({background: bg})} />
					<DurationSlider value={config.durationInFrames} onChange={(v) => update({durationInFrames: v})} />
				</div>
			);

		case 'cta':
			return (
				<div className="space-y-4">
					<TextInput label="Headline" value={config.headline} onChange={(v) => update({headline: v})} />
					<RichTextEditor label="Subtitle" value={config.subtitleContent} onChange={(v) => update({subtitleContent: v})} compact />
					<TextInput label="Button Text" value={config.buttonText} onChange={(v) => update({buttonText: v})} />
					<TextInput label="Button URL" value={config.buttonUrl} onChange={(v) => update({buttonUrl: v})} />
					<BackgroundEditor value={config.background} onChange={(bg) => update({background: bg})} />
					<DurationSlider value={config.durationInFrames} onChange={(v) => update({durationInFrames: v})} />
				</div>
			);

		case 'custom': {
			const updateBlocks = (blocks: ContentBlock[]) => update({blocks} as any);
			const updateBlock = (i: number, patch: Partial<ContentBlock>) => {
				const blocks = [...config.blocks];
				blocks[i] = {...blocks[i], ...patch} as ContentBlock;
				updateBlocks(blocks);
			};
			const removeBlock = (i: number) => updateBlocks(config.blocks.filter((_, idx) => idx !== i));
			const addBlock = (type: ContentBlockType) => {
				const newBlock: ContentBlock = (() => {
					switch (type) {
						case 'heading': return {blockType: 'heading' as const, text: 'New Heading', size: 'medium' as const};
						case 'text': return {blockType: 'text' as const, content: plainToRichText('Your text here')};
						case 'image': return {blockType: 'image' as const, src: '', caption: '', rounded: true};
						case 'stat': return {blockType: 'stat' as const, value: '99%', label: 'Metric'};
						case 'icon-text': return {blockType: 'icon-text' as const, icon: '⭐', title: 'Title', description: 'Description'};
					}
				})();
				updateBlocks([...config.blocks, newBlock]);
			};
			const moveBlock = (from: number, to: number) => {
				const blocks = [...config.blocks];
				const [moved] = blocks.splice(from, 1);
				blocks.splice(to, 0, moved);
				updateBlocks(blocks);
			};

			return (
				<div className="space-y-4">
					{/* Layout Picker */}
					<div>
						<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Layout</label>
						<div className="grid grid-cols-3 gap-2">
							{LAYOUT_PRESETS.map((lp) => (
								<button
									key={lp.id}
									onClick={() => update({layout: lp.id} as any)}
									className={`p-2.5 rounded-lg border text-center transition-all ${
										config.layout === lp.id
											? 'border-weaved-blue bg-blue-50 ring-1 ring-weaved-blue/30'
											: 'border-gray-200 bg-white hover:border-gray-300'
									}`}
								>
									<div className="text-xl mb-1">{lp.icon}</div>
									<div className="text-xs font-medium text-gray-700">{lp.name}</div>
								</button>
							))}
						</div>
					</div>

					{/* Content Blocks */}
					<div>
						<div className="flex items-center justify-between mb-2">
							<label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Content Blocks</label>
						</div>

						{config.blocks.map((block, i) => (
							<div key={i} className="mb-3 p-3 rounded-xl bg-gray-50 border border-gray-200 relative">
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center gap-2">
										{i > 0 && (
											<button onClick={() => moveBlock(i, i - 1)} className="w-6 h-6 rounded bg-white border border-gray-200 text-gray-400 hover:text-gray-600 text-xs flex items-center justify-center">↑</button>
										)}
										{i < config.blocks.length - 1 && (
											<button onClick={() => moveBlock(i, i + 1)} className="w-6 h-6 rounded bg-white border border-gray-200 text-gray-400 hover:text-gray-600 text-xs flex items-center justify-center">↓</button>
										)}
										<span className="text-xs font-bold text-gray-400 uppercase">
											{BLOCK_TYPES.find((bt) => bt.type === block.blockType)?.name}
										</span>
									</div>
									<button onClick={() => removeBlock(i)} className="w-6 h-6 rounded bg-red-50 text-red-500 hover:bg-red-100 text-xs font-bold flex items-center justify-center">×</button>
								</div>

								{/* Block-specific fields */}
								{block.blockType === 'heading' && (
									<div className="space-y-2">
										<input type="text" value={block.text} onChange={(e) => updateBlock(i, {text: e.target.value})} className="w-full px-3 py-1.5 rounded bg-white border border-gray-200 text-gray-900 text-sm" placeholder="Heading text" />
										<div className="flex gap-1">
											{(['large', 'medium', 'small'] as const).map((s) => (
												<button key={s} onClick={() => updateBlock(i, {size: s})} className={`flex-1 py-1 text-xs rounded ${block.size === s ? 'bg-weaved-blue text-white' : 'bg-white border border-gray-200 text-gray-500'}`}>
													{s.charAt(0).toUpperCase() + s.slice(1)}
												</button>
											))}
										</div>
									</div>
								)}
								{block.blockType === 'text' && (
									<RichTextEditor value={block.content} onChange={(v) => updateBlock(i, {content: v})} compact />
								)}
								{block.blockType === 'image' && (
									<div className="space-y-2">
										<ImageUpload value={block.src} onChange={(v) => updateBlock(i, {src: v})} label="Image" />
										<input type="text" value={block.caption} onChange={(e) => updateBlock(i, {caption: e.target.value})} className="w-full px-3 py-1.5 rounded bg-white border border-gray-200 text-gray-500 text-sm" placeholder="Caption (optional)" />
										<label className="flex items-center gap-2 text-xs text-gray-500">
											<input type="checkbox" checked={block.rounded} onChange={(e) => updateBlock(i, {rounded: e.target.checked})} className="accent-weaved-blue" />
											Rounded corners
										</label>
									</div>
								)}
								{block.blockType === 'stat' && (
									<div className="flex gap-2">
										<input type="text" value={block.value} onChange={(e) => updateBlock(i, {value: e.target.value})} className="w-24 px-3 py-1.5 rounded bg-white border border-gray-200 text-gray-900 text-sm font-bold" placeholder="99%" />
										<input type="text" value={block.label} onChange={(e) => updateBlock(i, {label: e.target.value})} className="flex-1 px-3 py-1.5 rounded bg-white border border-gray-200 text-gray-500 text-sm" placeholder="Label" />
									</div>
								)}
								{block.blockType === 'icon-text' && (
									<div className="space-y-2">
										<div className="flex gap-2">
											<input type="text" value={block.icon} onChange={(e) => updateBlock(i, {icon: e.target.value})} className="w-14 px-3 py-1.5 rounded bg-white border border-gray-200 text-gray-900 text-sm text-center" placeholder="⭐" />
											<input type="text" value={block.title} onChange={(e) => updateBlock(i, {title: e.target.value})} className="flex-1 px-3 py-1.5 rounded bg-white border border-gray-200 text-gray-900 text-sm" placeholder="Title" />
										</div>
										<input type="text" value={block.description} onChange={(e) => updateBlock(i, {description: e.target.value})} className="w-full px-3 py-1.5 rounded bg-white border border-gray-200 text-gray-500 text-sm" placeholder="Description" />
									</div>
								)}
							</div>
						))}

						{/* Add Block buttons */}
						<div className="flex flex-wrap gap-1.5 mt-3">
							{BLOCK_TYPES.map((bt) => (
								<button
									key={bt.type}
									onClick={() => addBlock(bt.type)}
									className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-600 hover:border-weaved-blue hover:text-weaved-blue transition-colors flex items-center gap-1"
								>
									<span className="text-sm">{bt.icon}</span> {bt.name}
								</button>
							))}
						</div>
					</div>

					<BackgroundEditor value={config.background} onChange={(bg) => update({background: bg})} />
					<DurationSlider value={config.durationInFrames} onChange={(v) => update({durationInFrames: v})} />
				</div>
			);
		}
	}
}
