import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {m} from './theme';

const StatCard: React.FC<{value: string; label: string; desc: string; delay: number; color: string}> = ({value, label, desc, delay, color}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const entrance = spring({fps, frame: Math.max(0, frame - delay), config: {damping: 200}});
	const scale = interpolate(entrance, [0, 1], [0.5, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const op = interpolate(entrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<div style={{transform: `scale(${scale})`, opacity: op, background: m.card, border: `1px solid ${m.border}`, borderRadius: 24, padding: '44px 40px', textAlign: 'center', width: 340}}>
			<div style={{fontSize: 64, fontWeight: 800, color, fontFamily: m.font, marginBottom: 8}}>{value}</div>
			<div style={{fontSize: 22, fontWeight: 700, color: m.light, fontFamily: m.font, marginBottom: 8}}>{label}</div>
			<div style={{fontSize: 15, color: m.muted, fontFamily: m.font, lineHeight: 1.5}}>{desc}</div>
		</div>
	);
};

export const Stats: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const headEntrance = spring({fps, frame, config: {damping: 200}});
	const headOp = interpolate(headEntrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{background: m.dark}}>
			<AbsoluteFill style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40}}>
				<div style={{opacity: headOp, fontSize: 52, fontWeight: 700, color: m.light, fontFamily: m.font}}>
					The Impact
				</div>

				<div style={{display: 'flex', gap: 32}}>
					<StatCard value="10x" label="Faster" desc="Create videos in minutes instead of weeks of back-and-forth" delay={10} color={m.blue} />
					<StatCard value="$0" label="Design Cost" desc="No designers needed. Your team creates videos directly" delay={18} color={m.cyan} />
					<StatCard value="100%" label="Control" desc="Edit everything yourself. No waiting for revisions" delay={26} color="#10B981" />
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
