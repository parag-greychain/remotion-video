import React from 'react';
import {
	AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	spring,
	interpolate,
} from 'remotion';
import {pTheme} from './theme';
import {AnimatedText} from './AnimatedText';

export const CtaScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({fps, frame, config: {damping: 100}});

	// Pulsing glow
	const glowOpacity = interpolate(
		frame % 60,
		[0, 30, 60],
		[0.15, 0.3, 0.15],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);

	// Button pulse
	const buttonPulse = interpolate(
		frame % 45,
		[0, 22, 45],
		[1, 1.03, 1],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);

	const bgAngle = interpolate(frame, [0, 120], [135, 180], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{background: pTheme.bg}}>
			{/* Central glow */}
			<AbsoluteFill
				style={{justifyContent: 'center', alignItems: 'center'}}
			>
				<div
					style={{
						width: 600,
						height: 600,
						borderRadius: '50%',
						background: `radial-gradient(circle, ${pTheme.primary}${Math.round(glowOpacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
						position: 'absolute',
						filter: 'blur(60px)',
					}}
				/>
				<div
					style={{
						width: 400,
						height: 400,
						borderRadius: '50%',
						background: `radial-gradient(circle, ${pTheme.accent}${Math.round(glowOpacity * 200).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
						position: 'absolute',
						transform: 'translate(100px, -50px)',
						filter: 'blur(80px)',
					}}
				/>
			</AbsoluteFill>

			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					gap: 24,
				}}
			>
				<AnimatedText
					delay={0}
					style={{
						fontSize: 60,
						fontWeight: 800,
						color: pTheme.foreground,
						fontFamily: pTheme.fontFamily,
						letterSpacing: -2,
						textAlign: 'center',
					}}
				>
					Let's Build Something Great
				</AnimatedText>

				<AnimatedText
					delay={10}
					style={{
						fontSize: 24,
						color: pTheme.mutedText,
						fontFamily: pTheme.fontFamily,
						textAlign: 'center',
						maxWidth: 600,
						lineHeight: 1.5,
					}}
				>
					React.js Expert · AI Integration · Team Leadership
				</AnimatedText>

				{/* Contact info */}
				<AnimatedText
					delay={18}
					style={{
						display: 'flex',
						gap: 40,
						marginTop: 20,
					}}
				>
					<span
						style={{
							fontSize: 18,
							color: pTheme.primary,
							fontFamily: pTheme.fontFamily,
							fontWeight: 500,
						}}
					>
						paragahir75@gmail.com
					</span>
					<span
						style={{
							fontSize: 18,
							color: pTheme.accent,
							fontFamily: pTheme.fontFamily,
							fontWeight: 500,
						}}
					>
						Ahmedabad, India
					</span>
				</AnimatedText>

				{/* CTA Button */}
				<AnimatedText delay={26}>
					<div
						style={{
							marginTop: 24,
							padding: '18px 52px',
							background: pTheme.gradient,
							borderRadius: 50,
							fontSize: 20,
							fontWeight: 700,
							color: pTheme.white,
							fontFamily: pTheme.fontFamily,
							transform: `scale(${buttonPulse})`,
							boxShadow: `0 8px 32px ${pTheme.primary}40`,
						}}
					>
						Send Me a Message
					</div>
				</AnimatedText>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
