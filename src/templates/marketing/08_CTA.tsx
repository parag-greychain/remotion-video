import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile} from 'remotion';
import {m} from './theme';

export const CTA: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const logoEntrance = spring({fps, frame, config: {damping: 80, mass: 0.6}});
	const logoScale = interpolate(logoEntrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const textEntrance = spring({fps, frame: Math.max(0, frame - 10), config: {damping: 200}});
	const textOp = interpolate(textEntrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const textY = interpolate(textEntrance, [0, 1], [40, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const btnEntrance = spring({fps, frame: Math.max(0, frame - 25), config: {damping: 200}});
	const btnOp = interpolate(btnEntrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const buttonPulse = interpolate(frame % 45, [0, 22, 45], [1, 1.05, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Glow
	const glowOp = interpolate(frame % 60, [0, 30, 60], [0.15, 0.35, 0.15], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const bgShift = interpolate(frame, [0, 120], [135, 175], {extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{background: `linear-gradient(${bgShift}deg, ${m.blue} 0%, ${m.cyan} 50%, ${m.blue} 100%)`}}>
			{/* Glow */}
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
				<div style={{width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, rgba(255,255,255,${glowOp}) 0%, transparent 70%)`, position: 'absolute', filter: 'blur(60px)'}} />
			</AbsoluteFill>

			{/* Decorative rings */}
			<div style={{position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)'}} />
			<div style={{position: 'absolute', bottom: -120, left: -80, width: 500, height: 500, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)'}} />

			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 20}}>
				<div style={{transform: `scale(${logoScale})`, marginBottom: 10}}>
					<Img src={staticFile('assets/icon-512.png')} style={{width: 90, height: 90, borderRadius: 45, border: '4px solid rgba(255,255,255,0.3)'}} />
				</div>

				<div style={{transform: `translateY(${textY}px)`, opacity: textOp, fontSize: 68, fontWeight: 800, color: m.white, fontFamily: m.font, letterSpacing: -2, textAlign: 'center'}}>
					Start Creating Today
				</div>

				<div style={{opacity: textOp, fontSize: 26, color: 'rgba(255,255,255,0.85)', fontFamily: m.font, maxWidth: 600, textAlign: 'center', lineHeight: 1.5}}>
					Professional videos. Zero learning curve. Your brand, your way.
				</div>

				<div style={{opacity: btnOp, marginTop: 20, padding: '22px 64px', background: m.white, borderRadius: 50, fontSize: 24, fontWeight: 700, color: m.blue, fontFamily: m.font, transform: `scale(${buttonPulse})`, boxShadow: '0 12px 40px rgba(0,0,0,0.2)'}}>
					Try Weaved Video Studio
				</div>

				<div style={{opacity: btnOp, fontSize: 18, color: 'rgba(255,255,255,0.7)', fontFamily: m.font, marginTop: 8}}>
					weaved.one
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
