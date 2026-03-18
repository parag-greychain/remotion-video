import React from 'react';
import {
	AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	spring,
	interpolate,
	random,
} from 'remotion';
import {pTheme} from './theme';
import {AnimatedText} from './AnimatedText';

const GlowOrb: React.FC<{index: number}> = ({index}) => {
	const frame = useCurrentFrame();
	const x = random(`orb-x-${index}`) * 1920;
	const y = random(`orb-y-${index}`) * 1080;
	const size = 200 + random(`orb-size-${index}`) * 400;
	const isBlue = random(`orb-color-${index}`) > 0.5;

	const pulse = interpolate(
		(frame + index * 20) % 120,
		[0, 60, 120],
		[0.03, 0.08, 0.03],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);

	return (
		<div
			style={{
				position: 'absolute',
				left: x - size / 2,
				top: y - size / 2,
				width: size,
				height: size,
				borderRadius: '50%',
				background: isBlue ? pTheme.primary : pTheme.accent,
				opacity: pulse,
				filter: 'blur(80px)',
			}}
		/>
	);
};

export const HeroScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const nameScale = spring({fps, frame, config: {damping: 100, mass: 0.8}});

	// Blinking cursor
	const cursorOpacity = Math.floor(frame / 15) % 2 === 0 ? 1 : 0;

	// Status badge
	const badgeEntrance = spring({
		fps,
		frame: Math.max(0, frame - 30),
		config: {damping: 200},
	});

	return (
		<AbsoluteFill style={{background: pTheme.bg}}>
			{/* Ambient glow orbs */}
			{new Array(5).fill(null).map((_, i) => (
				<GlowOrb key={i} index={i} />
			))}

			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					gap: 24,
				}}
			>
				{/* Available badge */}
				<div
					style={{
						opacity: interpolate(badgeEntrance, [0, 1], [0, 1], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
						}),
						transform: `scale(${interpolate(badgeEntrance, [0, 1], [0.8, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})})`,
						padding: '10px 24px',
						borderRadius: 50,
						border: `1px solid ${pTheme.emerald}40`,
						background: `${pTheme.emerald}15`,
						display: 'flex',
						alignItems: 'center',
						gap: 10,
						marginBottom: 10,
					}}
				>
					<div
						style={{
							width: 8,
							height: 8,
							borderRadius: '50%',
							background: pTheme.emerald,
						}}
					/>
					<span
						style={{
							fontSize: 16,
							color: pTheme.emerald,
							fontFamily: pTheme.fontFamily,
							fontWeight: 500,
						}}
					>
						Available for opportunities
					</span>
				</div>

				{/* Name */}
				<AnimatedText
					delay={5}
					style={{
						fontSize: 92,
						fontWeight: 800,
						color: pTheme.foreground,
						fontFamily: pTheme.fontFamily,
						letterSpacing: -3,
					}}
				>
					Parag Baldaniya
				</AnimatedText>

				{/* Role with gradient */}
				<AnimatedText
					delay={12}
					style={{
						fontSize: 36,
						fontWeight: 600,
						background: pTheme.gradient,
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						fontFamily: pTheme.fontFamily,
					}}
				>
					Frontend Developer & Team Lead
				</AnimatedText>

				{/* Description */}
				<AnimatedText
					delay={20}
					style={{
						fontSize: 22,
						color: pTheme.mutedText,
						fontFamily: pTheme.fontFamily,
						maxWidth: 750,
						textAlign: 'center',
						lineHeight: 1.6,
					}}
				>
					4+ years engineering scalable web applications,
					leading teams, and integrating AI functionalities.
				</AnimatedText>

				{/* Typing cursor accent */}
				<div
					style={{
						width: 3,
						height: 32,
						background: pTheme.primary,
						opacity: cursorOpacity,
						marginTop: 10,
						borderRadius: 2,
					}}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
