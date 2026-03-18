import React from 'react';
import {
	AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	spring,
	interpolate,
} from 'remotion';
import {theme} from '../components/theme';
import {AnimatedText} from '../components/AnimatedText';

const FeatureCard: React.FC<{
	icon: string;
	title: string;
	description: string;
	delay: number;
	index: number;
}> = ({icon, title, description, delay, index}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({
		fps,
		frame: Math.max(0, frame - delay),
		config: {damping: 200},
	});

	const y = interpolate(entrance, [0, 1], [80, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const opacity = interpolate(entrance, [0, 1], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const scale = interpolate(entrance, [0, 1], [0.9, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				transform: `translateY(${y}px) scale(${scale})`,
				opacity,
				width: 380,
				background: theme.white,
				borderRadius: 24,
				padding: 40,
				boxShadow: '0 4px 40px rgba(31, 107, 255, 0.08)',
				border: '1px solid ' + theme.lightGray,
			}}
		>
			<div
				style={{
					width: 64,
					height: 64,
					borderRadius: 16,
					background: theme.gradient,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: 32,
					marginBottom: 24,
				}}
			>
				{icon}
			</div>
			<div
				style={{
					fontSize: 24,
					fontWeight: 700,
					color: theme.darkText,
					fontFamily: theme.fontFamily,
					marginBottom: 12,
				}}
			>
				{title}
			</div>
			<div
				style={{
					fontSize: 17,
					color: theme.midText,
					fontFamily: theme.fontFamily,
					lineHeight: 1.6,
				}}
			>
				{description}
			</div>
		</div>
	);
};

export const FeaturesScene: React.FC = () => {
	const frame = useCurrentFrame();

	// Animated accent line
	const lineWidth = interpolate(frame, [0, 30], [0, 120], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{background: theme.offWhite}}>
			<AbsoluteFill
				style={{
					flexDirection: 'column',
					alignItems: 'center',
					paddingTop: 70,
				}}
			>
				<AnimatedText
					delay={0}
					style={{
						fontSize: 20,
						fontWeight: 600,
						color: theme.blue,
						fontFamily: theme.fontFamily,
						letterSpacing: 4,
						textTransform: 'uppercase',
						marginBottom: 12,
					}}
				>
					Why Weaved
				</AnimatedText>

				<AnimatedText
					delay={4}
					style={{
						fontSize: 50,
						fontWeight: 700,
						color: theme.darkText,
						fontFamily: theme.fontFamily,
						marginBottom: 12,
					}}
				>
					Built for Enterprise Control
				</AnimatedText>

				<div
					style={{
						width: lineWidth,
						height: 4,
						background: theme.gradient,
						borderRadius: 2,
						marginBottom: 60,
					}}
				/>

				{/* Feature cards row */}
				<div
					style={{
						display: 'flex',
						gap: 40,
						justifyContent: 'center',
						paddingLeft: 80,
						paddingRight: 80,
					}}
				>
					<FeatureCard
						icon="🏗️"
						title="Full Deployment"
						description="Deploy on your private cloud — AWS, Azure, GCP, or on-premise. Complete data sovereignty."
						delay={10}
						index={0}
					/>
					<FeatureCard
						icon="🔓"
						title="Open Source Access"
						description="Full source code access with CI/CD integration for continuous development and customization."
						delay={20}
						index={1}
					/>
					<FeatureCard
						icon="🤖"
						title="AI Agent Platform"
						description="Build, deploy, and manage intelligent AI agents tailored to your specific business workflows."
						delay={30}
						index={2}
					/>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
