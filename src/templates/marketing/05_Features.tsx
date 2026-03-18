import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile} from 'remotion';
import {m} from './theme';

const FeatureChip: React.FC<{icon: string; label: string; delay: number}> = ({icon, label, delay}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const entrance = spring({fps, frame: Math.max(0, frame - delay), config: {damping: 200}});
	const scale = interpolate(entrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const op = interpolate(entrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<div style={{transform: `scale(${scale})`, opacity: op, background: m.card, border: `1px solid ${m.border}`, borderRadius: 14, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10}}>
			<span style={{fontSize: 22}}>{icon}</span>
			<span style={{fontSize: 16, fontWeight: 600, color: m.light, fontFamily: m.font}}>{label}</span>
		</div>
	);
};

export const Features: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const headEntrance = spring({fps, frame, config: {damping: 200}});
	const headOp = interpolate(headEntrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const lineW = interpolate(frame, [0, 30], [0, 150], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Editor screenshot entrance
	const imgEntrance = spring({fps, frame: Math.max(0, frame - 20), config: {damping: 100}});
	const imgScale = interpolate(imgEntrance, [0, 1], [0.9, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const imgOp = interpolate(imgEntrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const features = [
		{icon: '🎬', label: '11 Scene Types'},
		{icon: '✨', label: 'Custom Builder'},
		{icon: '📝', label: 'Rich Text'},
		{icon: '📷', label: 'Image Upload'},
		{icon: '🎨', label: 'Backgrounds'},
		{icon: '🖌️', label: 'Brand Kit'},
		{icon: '⚡', label: 'Live Preview'},
		{icon: '📊', label: 'Stats'},
		{icon: '💬', label: 'Testimonials'},
		{icon: '🔀', label: 'Drag & Drop'},
		{icon: '⬇️', label: 'MP4 Export'},
		{icon: '📐', label: '6 Layouts'},
	];

	return (
		<AbsoluteFill style={{background: m.dark}}>
			<AbsoluteFill style={{display: 'flex', flexDirection: 'row'}}>
				{/* Left: Screenshot */}
				<div style={{flex: '0 0 55%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 40px 40px 60px'}}>
					<div style={{transform: `scale(${imgScale})`, opacity: imgOp, borderRadius: 16, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.5)', border: `2px solid ${m.border}`}}>
						<Img src={staticFile('assets/screenshots/editor.png')} style={{width: '100%', display: 'block'}} />
					</div>
				</div>

				{/* Right: Feature list */}
				<div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: 80}}>
					<div style={{opacity: headOp, fontSize: 18, fontWeight: 600, color: m.cyan, fontFamily: m.font, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 8}}>
						Packed With Power
					</div>
					<div style={{opacity: headOp, fontSize: 40, fontWeight: 700, color: m.light, fontFamily: m.font, marginBottom: 8}}>
						Everything You Need
					</div>
					<div style={{width: lineW, height: 3, background: m.gradient, borderRadius: 2, marginBottom: 28}} />

					<div style={{display: 'flex', flexWrap: 'wrap', gap: 10}}>
						{features.map((f, i) => (
							<FeatureChip key={i} icon={f.icon} label={f.label} delay={15 + i * 3} />
						))}
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
