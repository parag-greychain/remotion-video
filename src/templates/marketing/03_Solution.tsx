import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile} from 'remotion';
import {m} from './theme';

export const Solution: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const bgShift = interpolate(frame, [0, 120], [135, 165], {extrapolateRight: 'clamp'});

	const logoEntrance = spring({fps, frame, config: {damping: 80}});
	const logoScale = interpolate(logoEntrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const textEntrance = spring({fps, frame: Math.max(0, frame - 10), config: {damping: 200}});
	const textOp = interpolate(textEntrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const textY = interpolate(textEntrance, [0, 1], [50, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Platform screenshot slides up from bottom
	const imgEntrance = spring({fps, frame: Math.max(0, frame - 30), config: {damping: 100}});
	const imgY = interpolate(imgEntrance, [0, 1], [200, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const imgOp = interpolate(imgEntrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{background: `linear-gradient(${bgShift}deg, ${m.blue} 0%, ${m.cyan} 60%, ${m.blue} 100%)`}}>
			<div style={{position: 'absolute', top: -120, right: -120, width: 500, height: 500, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)'}} />

			<AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', paddingTop: 60}}>
				<div style={{transform: `scale(${logoScale})`, marginBottom: 12}}>
					<Img src={staticFile('assets/icon-512.png')} style={{width: 70, height: 70, borderRadius: 35, border: '3px solid rgba(255,255,255,0.3)'}} />
				</div>

				<div style={{transform: `translateY(${textY}px)`, opacity: textOp, fontSize: 20, fontWeight: 600, color: 'rgba(255,255,255,0.7)', fontFamily: m.font, letterSpacing: 6, textTransform: 'uppercase'}}>
					Introducing
				</div>

				<div style={{transform: `translateY(${textY}px)`, opacity: textOp, fontSize: 64, fontWeight: 800, color: m.white, fontFamily: m.font, letterSpacing: -2, marginTop: 8}}>
					Weaved Video Studio
				</div>

				<div style={{opacity: textOp, fontSize: 22, color: 'rgba(255,255,255,0.85)', fontFamily: m.font, marginTop: 12, marginBottom: 24}}>
					Create professional product demo videos — in minutes, not weeks.
				</div>

				{/* Platform screenshot */}
				<div style={{transform: `translateY(${imgY}px)`, opacity: imgOp, width: 1100, borderRadius: 16, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.15)'}}>
					<Img src={staticFile('assets/screenshots/dashboard.png')} style={{width: '100%', display: 'block'}} />
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
