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

const StatCard: React.FC<{
	value: string;
	label: string;
	delay: number;
	color?: string;
}> = ({value, label, delay, color = pTheme.primary}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({
		fps,
		frame: Math.max(0, frame - delay),
		config: {damping: 200},
	});

	const scale = interpolate(entrance, [0, 1], [0.5, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const opacity = interpolate(entrance, [0, 1], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				transform: `scale(${scale})`,
				opacity,
				background: pTheme.card,
				border: `1px solid ${pTheme.border}`,
				borderRadius: 20,
				padding: '32px 28px',
				width: 200,
				textAlign: 'center',
			}}
		>
			<div
				style={{
					fontSize: 42,
					fontWeight: 800,
					color,
					fontFamily: pTheme.fontFamily,
					marginBottom: 8,
				}}
			>
				{value}
			</div>
			<div
				style={{
					fontSize: 15,
					color: pTheme.mutedText,
					fontFamily: pTheme.fontFamily,
					fontWeight: 500,
				}}
			>
				{label}
			</div>
		</div>
	);
};

export const AchievementsScene: React.FC = () => {
	const frame = useCurrentFrame();

	// Animated gradient line
	const lineWidth = interpolate(frame, [0, 30], [0, 200], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{background: pTheme.bg}}>
			<AbsoluteFill
				style={{
					flexDirection: 'column',
					alignItems: 'center',
					paddingTop: 80,
				}}
			>
				<AnimatedText
					delay={0}
					style={{
						fontSize: 20,
						fontWeight: 600,
						color: pTheme.primary,
						fontFamily: pTheme.fontFamily,
						letterSpacing: 4,
						textTransform: 'uppercase',
						marginBottom: 8,
					}}
				>
					Results
				</AnimatedText>
				<AnimatedText
					delay={4}
					style={{
						fontSize: 48,
						fontWeight: 700,
						color: pTheme.foreground,
						fontFamily: pTheme.fontFamily,
						marginBottom: 12,
					}}
				>
					Impact & Achievements
				</AnimatedText>
				<div
					style={{
						width: lineWidth,
						height: 4,
						background: pTheme.gradient,
						borderRadius: 2,
						marginBottom: 60,
					}}
				/>

				{/* Stats grid - row 1 */}
				<div
					style={{
						display: 'flex',
						gap: 30,
						marginBottom: 30,
					}}
				>
					<StatCard value="20%" label="Performance Boost" delay={10} />
					<StatCard
						value="3"
						label="AI Platforms Built"
						delay={16}
						color={pTheme.accent}
					/>
					<StatCard value="4+" label="Years Experience" delay={22} />
					<StatCard
						value="6"
						label="Production Projects"
						delay={28}
						color={pTheme.emerald}
					/>
				</div>

				{/* Stats grid - row 2 */}
				<div
					style={{
						display: 'flex',
						gap: 30,
					}}
				>
					<StatCard
						value="★"
						label="Team Leadership"
						delay={34}
						color={pTheme.accent}
					/>
					<StatCard value="⚡" label="Real-time Systems" delay={40} />
					<StatCard
						value="✓"
						label="Full-Stack Delivery"
						delay={46}
						color={pTheme.emerald}
					/>
					<StatCard
						value="◆"
						label="Code Quality Champion"
						delay={52}
						color={pTheme.accent}
					/>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
