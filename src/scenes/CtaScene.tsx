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

export const CtaScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const logoEntrance = spring({
		fps,
		frame,
		config: {damping: 100, mass: 0.6},
	});
	const logoScale = interpolate(logoEntrance, [0, 1], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Button pulse
	const buttonPulse = interpolate(
		frame % 45,
		[0, 22, 45],
		[1, 1.04, 1],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	// Gradient bg animation
	const bgShift = interpolate(frame, [0, 90], [0, 30], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				background: `linear-gradient(${135 + bgShift}deg, #1F6BFF 0%, #16BAFF 60%, #1F6BFF 100%)`,
			}}
		>
			{/* Decorative circles */}
			<div
				style={{
					position: 'absolute',
					top: -100,
					right: -100,
					width: 500,
					height: 500,
					borderRadius: '50%',
					border: '1px solid rgba(255, 255, 255, 0.1)',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					bottom: -150,
					left: -100,
					width: 600,
					height: 600,
					borderRadius: '50%',
					border: '1px solid rgba(255, 255, 255, 0.08)',
				}}
			/>

			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					gap: 24,
				}}
			>
				{/* Logo */}
				<div style={{transform: `scale(${logoScale})`, marginBottom: 10}}>
					<Img
						src={staticFile('assets/icon-512.png')}
						style={{
							width: 100,
							height: 100,
							borderRadius: 50,
							border: '3px solid rgba(255, 255, 255, 0.3)',
						}}
					/>
				</div>

				<AnimatedText
					delay={8}
					style={{
						fontSize: 64,
						fontWeight: 800,
						color: theme.white,
						fontFamily: theme.fontFamily,
						letterSpacing: -2,
						textAlign: 'center',
					}}
				>
					Own Your AI Future
				</AnimatedText>

				<AnimatedText
					delay={14}
					style={{
						fontSize: 24,
						fontWeight: 400,
						color: 'rgba(255, 255, 255, 0.85)',
						fontFamily: theme.fontFamily,
						textAlign: 'center',
						maxWidth: 600,
						lineHeight: 1.5,
					}}
				>
					Full deployment. Full source code. Full control.
					Enterprise AI that's truly yours.
				</AnimatedText>

				{/* CTA Button */}
				<AnimatedText delay={22}>
					<div
						style={{
							marginTop: 20,
							padding: '20px 56px',
							background: theme.white,
							borderRadius: 50,
							fontSize: 22,
							fontWeight: 700,
							color: theme.blue,
							fontFamily: theme.fontFamily,
							transform: `scale(${buttonPulse})`,
							boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
						}}
					>
						Get Started at weaved.one
					</div>
				</AnimatedText>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
