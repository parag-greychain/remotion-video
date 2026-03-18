import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile, Sequence} from 'remotion';
import {m} from './theme';

const Step: React.FC<{num: string; title: string; desc: string; screenshot: string; delay: number; color: string}> = ({num, title, desc, screenshot, delay, color}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const entrance = spring({fps, frame: Math.max(0, frame - delay), config: {damping: 200}});
	const scale = interpolate(entrance, [0, 1], [0.85, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const op = interpolate(entrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<div style={{transform: `scale(${scale})`, opacity: op, display: 'flex', gap: 60, alignItems: 'center', padding: '0 120px'}}>
			{/* Text side */}
			<div style={{flex: '0 0 400px'}}>
				<div style={{width: 56, height: 56, borderRadius: 16, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: m.white, fontFamily: m.font, marginBottom: 20}}>
					{num}
				</div>
				<div style={{fontSize: 36, fontWeight: 700, color: m.light, fontFamily: m.font, marginBottom: 12}}>
					{title}
				</div>
				<div style={{fontSize: 20, color: m.muted, fontFamily: m.font, lineHeight: 1.6}}>
					{desc}
				</div>
			</div>

			{/* Screenshot */}
			<div style={{flex: 1, borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', border: `2px solid ${m.border}`}}>
				<Img src={staticFile(screenshot)} style={{width: '100%', display: 'block'}} />
			</div>
		</div>
	);
};

export const HowItWorks: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const headEntrance = spring({fps, frame, config: {damping: 200}});
	const headOp = interpolate(headEntrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const lineW = interpolate(frame, [0, 30], [0, 150], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Show steps sequentially: each step visible for ~8s (240 frames)
	const stepDuration = 240;

	return (
		<AbsoluteFill style={{background: m.dark}}>
			{/* Header - always visible */}
			<div style={{position: 'absolute', top: 40, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10}}>
				<div style={{opacity: headOp, fontSize: 20, fontWeight: 600, color: m.blue, fontFamily: m.font, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 8}}>
					Simple as 1-2-3
				</div>
				<div style={{opacity: headOp, fontSize: 44, fontWeight: 700, color: m.light, fontFamily: m.font, marginBottom: 8}}>
					How It Works
				</div>
				<div style={{width: lineW, height: 4, background: m.gradient, borderRadius: 2}} />
			</div>

			{/* Step 1: Pick Template (frames 0-250) */}
			<Sequence from={15} durationInFrames={stepDuration + 30}>
				<AbsoluteFill style={{justifyContent: 'center', paddingTop: 60}}>
					<Step num="1" title="Pick a Template" desc="Choose from 11 scene types — or build your own custom scene from scratch." screenshot="assets/screenshots/dashboard.png" delay={0} color={m.blue} />
				</AbsoluteFill>
			</Sequence>

			{/* Step 2: Customize (frames 260-510) */}
			<Sequence from={stepDuration + 30} durationInFrames={stepDuration + 30}>
				<AbsoluteFill style={{justifyContent: 'center', paddingTop: 60}}>
					<Step num="2" title="Customize Everything" desc="Edit text with rich formatting, upload images, change colors — all with live preview." screenshot="assets/screenshots/editor.png" delay={0} color={m.cyan} />
				</AbsoluteFill>
			</Sequence>

			{/* Step 3: Download (frames 520-770) */}
			<Sequence from={(stepDuration + 30) * 2} durationInFrames={stepDuration + 30}>
				<AbsoluteFill style={{justifyContent: 'center', paddingTop: 60}}>
					<Step num="3" title="Download & Share" desc="Render your video as MP4 in one click. Share with your team or publish anywhere." screenshot="assets/screenshots/scene-editing.png" delay={0} color="#10B981" />
				</AbsoluteFill>
			</Sequence>
		</AbsoluteFill>
	);
};
