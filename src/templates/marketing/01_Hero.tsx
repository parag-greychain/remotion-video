import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile, random} from 'remotion';
import {m} from './theme';

const Particle: React.FC<{i: number}> = ({i}) => {
	const frame = useCurrentFrame();
	const x = random(`p-x-${i}`) * 1920;
	const baseY = random(`p-y-${i}`) * 1080;
	const size = 2 + random(`p-s-${i}`) * 3;
	const speed = 0.2 + random(`p-sp-${i}`) * 0.5;
	const y = (baseY + frame * speed) % 1120 - 40;
	const opacity = 0.1 + random(`p-o-${i}`) * 0.25;
	return <div style={{position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: '50%', background: `rgba(31, 107, 255, ${opacity})`}} />;
};

export const Hero: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const logoScale = spring({fps, frame, config: {damping: 80, mass: 0.6}});
	const logoRotate = interpolate(logoScale, [0, 1], [-360, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const titleEntrance = spring({fps, frame: Math.max(0, frame - 12), config: {damping: 200}});
	const titleY = interpolate(titleEntrance, [0, 1], [60, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const titleOp = interpolate(titleEntrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const subEntrance = spring({fps, frame: Math.max(0, frame - 22), config: {damping: 200}});
	const subY = interpolate(subEntrance, [0, 1], [40, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const subOp = interpolate(subEntrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const tagEntrance = spring({fps, frame: Math.max(0, frame - 32), config: {damping: 200}});
	const tagOp = interpolate(tagEntrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Rotating rings
	const ring1 = interpolate(frame, [0, 300], [0, 360], {extrapolateRight: 'clamp'});
	const ring2 = interpolate(frame, [0, 300], [0, -240], {extrapolateRight: 'clamp'});

	// Glow pulse
	const glowOp = interpolate(frame % 90, [0, 45, 90], [0.08, 0.2, 0.08], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{background: m.dark}}>
			{new Array(30).fill(null).map((_, i) => <Particle key={i} i={i} />)}

			{/* Central glow */}
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
				<div style={{width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${m.blue}${Math.round(glowOp * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`, position: 'absolute', filter: 'blur(40px)'}} />
			</AbsoluteFill>

			{/* Rings */}
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
				<div style={{width: 400, height: 400, border: `1.5px solid ${m.blue}18`, borderRadius: '50%', transform: `rotate(${ring1}deg)`, position: 'absolute'}} />
				<div style={{width: 320, height: 320, border: `1.5px solid ${m.cyan}12`, borderRadius: '50%', transform: `rotate(${ring2}deg)`, position: 'absolute'}} />
			</AbsoluteFill>

			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 20}}>
				{/* Logo */}
				<div style={{transform: `scale(${logoScale}) rotate(${logoRotate}deg)`, marginBottom: 10}}>
					<Img src={staticFile('assets/icon-512.png')} style={{width: 110, height: 110, borderRadius: 55}} />
				</div>

				{/* Title */}
				<div style={{transform: `translateY(${titleY}px)`, opacity: titleOp, fontSize: 82, fontWeight: 800, color: m.light, fontFamily: m.font, letterSpacing: -3}}>
					Weaved Video Studio
				</div>

				{/* Gradient subtitle */}
				<div style={{transform: `translateY(${subY}px)`, opacity: subOp, fontSize: 36, fontWeight: 600, background: m.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: m.font}}>
					Create Professional Videos in Minutes
				</div>

				{/* Tag line */}
				<div style={{opacity: tagOp, fontSize: 22, color: m.muted, fontFamily: m.font, marginTop: 8}}>
					No designers. No video editors. No code. Just results.
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
