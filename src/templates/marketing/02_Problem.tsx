import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {m} from './theme';

const PainPoint: React.FC<{icon: string; text: string; delay: number}> = ({icon, text, delay}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const entrance = spring({fps, frame: Math.max(0, frame - delay), config: {damping: 200}});
	const x = interpolate(entrance, [0, 1], [-80, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const op = interpolate(entrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const strikeW = interpolate(frame, [delay + 50, delay + 65], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<div style={{transform: `translateX(${x}px)`, opacity: op, display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, position: 'relative'}}>
			<div style={{width: 56, height: 56, borderRadius: 14, background: '#1a0a0a', border: '1px solid #3a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28}}>
				{icon}
			</div>
			<div style={{position: 'relative'}}>
				<span style={{fontSize: 28, color: m.light, fontFamily: m.font, fontWeight: 500}}>{text}</span>
				<div style={{position: 'absolute', top: '50%', left: 0, width: `${strikeW}%`, height: 3, background: '#EF4444', borderRadius: 2}} />
			</div>
		</div>
	);
};

export const Problem: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const headEntrance = spring({fps, frame, config: {damping: 200}});
	const headOp = interpolate(headEntrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const headY = interpolate(headEntrance, [0, 1], [40, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{background: m.dark}}>
			<div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #EF4444, #F97316)'}} />
			<AbsoluteFill style={{justifyContent: 'center', paddingLeft: 220, paddingRight: 220}}>
				<div style={{transform: `translateY(${headY}px)`, opacity: headOp, fontSize: 52, fontWeight: 700, color: m.light, fontFamily: m.font, marginBottom: 12}}>
					Creating videos is painful.
				</div>
				<div style={{opacity: headOp, fontSize: 22, color: m.muted, fontFamily: m.font, marginBottom: 48}}>
					Every team faces the same problems:
				</div>

				<PainPoint icon="💸" text="Hiring designers costs $5,000+ per video" delay={15} />
				<PainPoint icon="⏰" text="Video editors take weeks to deliver" delay={25} />
				<PainPoint icon="🔧" text="Complex tools with steep learning curves" delay={35} />
				<PainPoint icon="🚫" text="Non-technical teams can't create videos" delay={45} />
				<PainPoint icon="🔄" text="Endless revision cycles and back-and-forth" delay={55} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
