import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {m} from './theme';

const PersonaCard: React.FC<{emoji: string; role: string; use: string; delay: number}> = ({emoji, role, use, delay}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const entrance = spring({fps, frame: Math.max(0, frame - delay), config: {damping: 200}});
	const y = interpolate(entrance, [0, 1], [60, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const op = interpolate(entrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<div style={{transform: `translateY(${y}px)`, opacity: op, background: m.card, border: `1px solid ${m.border}`, borderRadius: 20, padding: '32px 28px', width: 260, textAlign: 'center'}}>
			<div style={{fontSize: 48, marginBottom: 16}}>{emoji}</div>
			<div style={{fontSize: 22, fontWeight: 700, color: m.light, fontFamily: m.font, marginBottom: 8}}>{role}</div>
			<div style={{fontSize: 15, color: m.muted, fontFamily: m.font, lineHeight: 1.5}}>{use}</div>
		</div>
	);
};

export const WhoCanUse: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const headEntrance = spring({fps, frame, config: {damping: 200}});
	const headOp = interpolate(headEntrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const lineW = interpolate(frame, [0, 30], [0, 150], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{background: m.dark}}>
			<AbsoluteFill style={{flexDirection: 'column', alignItems: 'center', paddingTop: 70}}>
				<div style={{opacity: headOp, fontSize: 20, fontWeight: 600, color: m.blue, fontFamily: m.font, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 12}}>
					Built for Everyone
				</div>
				<div style={{opacity: headOp, fontSize: 52, fontWeight: 700, color: m.light, fontFamily: m.font, marginBottom: 12}}>
					Who Can Use It?
				</div>
				<div style={{width: lineW, height: 4, background: m.gradient, borderRadius: 2, marginBottom: 50}} />

				<div style={{display: 'flex', gap: 28}}>
					<PersonaCard emoji="👔" role="CEOs" use="Create investor updates and company announcements" delay={12} />
					<PersonaCard emoji="📈" role="Marketing" use="Product launches, social ads, and brand videos" delay={20} />
					<PersonaCard emoji="👥" role="HR Teams" use="Team intros, onboarding, and culture videos" delay={28} />
					<PersonaCard emoji="💼" role="Sales" use="Product demos and personalized pitches" delay={36} />
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
