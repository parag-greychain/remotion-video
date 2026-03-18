import React from 'react';
import {
	AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	spring,
	interpolate,
	Img,
	staticFile,
} from 'remotion';
import {theme} from '../components/theme';
import {AnimatedText} from '../components/AnimatedText';

export const HeroScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const logoScale = spring({
		fps,
		frame,
		config: {damping: 100, mass: 0.8},
	});
	const logoRotate = interpolate(logoScale, [0, 1], [-180, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Subtle floating particles
	const circleOpacity = interpolate(frame, [0, 30], [0, 0.08], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{background: theme.white}}>
			{/* Background decorative circles */}
			<div
				style={{
					position: 'absolute',
					top: -200,
					right: -200,
					width: 700,
					height: 700,
					borderRadius: '50%',
					background: theme.gradient,
					opacity: circleOpacity,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					bottom: -300,
					left: -200,
					width: 800,
					height: 800,
					borderRadius: '50%',
					background: theme.gradient,
					opacity: circleOpacity * 0.7,
				}}
			/>

			{/* Content */}
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					gap: 30,
				}}
			>
				{/* Logo */}
				<div
					style={{
						transform: `scale(${logoScale}) rotate(${logoRotate}deg)`,
					}}
				>
					<Img
						src={staticFile('assets/icon-512.png')}
						style={{width: 120, height: 120, borderRadius: 60}}
					/>
				</div>

				{/* Brand name */}
				<AnimatedText
					delay={8}
					style={{
						fontSize: 88,
						fontWeight: 800,
						color: theme.darkText,
						fontFamily: theme.fontFamily,
						letterSpacing: -3,
					}}
				>
					Weaved
				</AnimatedText>

				{/* Tagline */}
				<AnimatedText
					delay={16}
					style={{
						fontSize: 34,
						fontWeight: 500,
						color: theme.blue,
						fontFamily: theme.fontFamily,
						letterSpacing: 2,
					}}
				>
					AI Agents for the Connected Enterprise
				</AnimatedText>

				{/* Subtitle */}
				<AnimatedText
					delay={24}
					style={{
						fontSize: 22,
						fontWeight: 400,
						color: theme.midText,
						fontFamily: theme.fontFamily,
						maxWidth: 700,
						textAlign: 'center',
						lineHeight: 1.5,
					}}
				>
					Your AI-powered assistant for enhanced productivity
					and seamless task management.
				</AnimatedText>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
