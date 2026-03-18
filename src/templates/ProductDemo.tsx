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
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {AnimatedText, GradientLine} from './shared';

interface Feature {
	title: string;
	description: string;
}

interface ProductDemoProps {
	brandName: string;
	tagline: string;
	subtitle: string;
	features: Feature[];
	ctaText: string;
	ctaUrl: string;
	primaryColor: string;
	accentColor: string;
}

const featureIcons = ['🏗️', '🔓', '🤖', '⚡', '🎯', '🛡️', '🚀', '💡', '🔧', '📊'];

const HeroScene: React.FC<ProductDemoProps> = (props) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const gradient = `linear-gradient(135deg, ${props.primaryColor} 0%, ${props.accentColor} 100%)`;

	const logoScale = spring({fps, frame, config: {damping: 100, mass: 0.8}});
	const circleOpacity = interpolate(frame, [0, 30], [0, 0.08], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const rotateAccent = interpolate(frame, [0, 150], [0, 360], {
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{background: '#ffffff'}}>
			<div
				style={{
					position: 'absolute',
					top: -200,
					right: -200,
					width: 700,
					height: 700,
					borderRadius: '50%',
					background: gradient,
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
					background: gradient,
					opacity: circleOpacity * 0.7,
				}}
			/>
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
				<div
					style={{
						width: 300,
						height: 300,
						border: `2px solid ${props.primaryColor}15`,
						borderRadius: 20,
						transform: `rotate(${rotateAccent}deg)`,
						position: 'absolute',
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
				<div style={{transform: `scale(${logoScale})`}}>
					<Img
						src={staticFile('assets/icon-512.png')}
						style={{width: 100, height: 100, borderRadius: 50}}
					/>
				</div>
				<AnimatedText
					delay={8}
					style={{
						fontSize: 88,
						fontWeight: 800,
						color: '#1A1A2E',
						fontFamily: 'system-ui, sans-serif',
						letterSpacing: -3,
					}}
				>
					{props.brandName}
				</AnimatedText>
				<AnimatedText
					delay={16}
					style={{
						fontSize: 34,
						fontWeight: 500,
						color: props.primaryColor,
						fontFamily: 'system-ui, sans-serif',
						letterSpacing: 2,
					}}
				>
					{props.tagline}
				</AnimatedText>
				<AnimatedText
					delay={24}
					style={{
						fontSize: 22,
						color: '#4A5568',
						fontFamily: 'system-ui, sans-serif',
						maxWidth: 700,
						textAlign: 'center',
						lineHeight: 1.5,
					}}
				>
					{props.subtitle}
				</AnimatedText>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

const FeatureCard: React.FC<{
	icon: string;
	title: string;
	description: string;
	delay: number;
	primaryColor: string;
	accentColor: string;
	cardWidth: number;
}> = ({icon, title, description, delay, primaryColor, accentColor, cardWidth}) => {
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

	return (
		<div
			style={{
				transform: `translateY(${y}px)`,
				opacity,
				width: cardWidth,
				background: '#ffffff',
				borderRadius: 24,
				padding: 36,
				boxShadow: `0 4px 40px ${primaryColor}12`,
				border: '1px solid #E8ECF2',
			}}
		>
			<div
				style={{
					width: 56,
					height: 56,
					borderRadius: 14,
					background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: 28,
					marginBottom: 20,
				}}
			>
				{icon}
			</div>
			<div
				style={{
					fontSize: 22,
					fontWeight: 700,
					color: '#1A1A2E',
					fontFamily: 'system-ui, sans-serif',
					marginBottom: 10,
				}}
			>
				{title}
			</div>
			<div
				style={{
					fontSize: 15,
					color: '#4A5568',
					fontFamily: 'system-ui, sans-serif',
					lineHeight: 1.6,
				}}
			>
				{description}
			</div>
		</div>
	);
};

const FeaturesScene: React.FC<ProductDemoProps> = (props) => {
	const features = props.features || [];
	const count = features.length;

	// Dynamic layout: calculate card width and rows
	const maxPerRow = Math.min(count, 3);
	const totalGap = (maxPerRow - 1) * 36;
	const availableWidth = 1920 - 120; // padding
	const cardWidth = Math.min(420, (availableWidth - totalGap) / maxPerRow);

	const rows: Feature[][] = [];
	for (let i = 0; i < features.length; i += maxPerRow) {
		rows.push(features.slice(i, i + maxPerRow));
	}

	return (
		<AbsoluteFill style={{background: '#F7F9FC'}}>
			<AbsoluteFill
				style={{
					flexDirection: 'column',
					alignItems: 'center',
					paddingTop: rows.length > 1 ? 50 : 70,
				}}
			>
				<AnimatedText
					delay={0}
					style={{
						fontSize: 20,
						fontWeight: 600,
						color: props.primaryColor,
						fontFamily: 'system-ui, sans-serif',
						letterSpacing: 4,
						textTransform: 'uppercase' as const,
						marginBottom: 12,
					}}
				>
					Features
				</AnimatedText>
				<AnimatedText
					delay={4}
					style={{
						fontSize: 50,
						fontWeight: 700,
						color: '#1A1A2E',
						fontFamily: 'system-ui, sans-serif',
						marginBottom: 12,
					}}
				>
					Why Choose Us
				</AnimatedText>
				<GradientLine color1={props.primaryColor} color2={props.accentColor} />
				<div style={{marginBottom: rows.length > 1 ? 30 : 40}} />

				{rows.map((row, rowIndex) => (
					<div
						key={rowIndex}
						style={{
							display: 'flex',
							gap: 36,
							justifyContent: 'center',
							marginBottom: rowIndex < rows.length - 1 ? 28 : 0,
						}}
					>
						{row.map((feature, colIndex) => {
							const globalIndex = rowIndex * maxPerRow + colIndex;
							return (
								<FeatureCard
									key={globalIndex}
									icon={featureIcons[globalIndex % featureIcons.length]}
									title={feature.title}
									description={feature.description}
									delay={10 + globalIndex * 8}
									primaryColor={props.primaryColor}
									accentColor={props.accentColor}
									cardWidth={cardWidth}
								/>
							);
						})}
					</div>
				))}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

const CtaScene: React.FC<ProductDemoProps> = (props) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const entrance = spring({fps, frame, config: {damping: 100, mass: 0.6}});
	const logoScale = interpolate(entrance, [0, 1], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const buttonPulse = interpolate(frame % 45, [0, 22, 45], [1, 1.04, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const bgShift = interpolate(frame, [0, 120], [0, 30], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				background: `linear-gradient(${135 + bgShift}deg, ${props.primaryColor} 0%, ${props.accentColor} 60%, ${props.primaryColor} 100%)`,
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: -100,
					right: -100,
					width: 500,
					height: 500,
					borderRadius: '50%',
					border: '1px solid rgba(255,255,255,0.1)',
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
				<div style={{transform: `scale(${logoScale})`, marginBottom: 10}}>
					<Img
						src={staticFile('assets/icon-512.png')}
						style={{
							width: 100,
							height: 100,
							borderRadius: 50,
							border: '3px solid rgba(255,255,255,0.3)',
						}}
					/>
				</div>
				<AnimatedText
					delay={8}
					style={{
						fontSize: 64,
						fontWeight: 800,
						color: '#ffffff',
						fontFamily: 'system-ui, sans-serif',
						letterSpacing: -2,
					}}
				>
					{props.ctaText}
				</AnimatedText>
				<AnimatedText
					delay={14}
					style={{
						fontSize: 24,
						color: 'rgba(255,255,255,0.85)',
						fontFamily: 'system-ui, sans-serif',
					}}
				>
					{props.ctaUrl}
				</AnimatedText>
				<AnimatedText delay={22}>
					<div
						style={{
							marginTop: 20,
							padding: '20px 56px',
							background: '#ffffff',
							borderRadius: 50,
							fontSize: 22,
							fontWeight: 700,
							color: props.primaryColor,
							fontFamily: 'system-ui, sans-serif',
							transform: `scale(${buttonPulse})`,
							boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
						}}
					>
						Visit {props.ctaUrl}
					</div>
				</AnimatedText>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

export const ProductDemo: React.FC<ProductDemoProps> = (props) => {
	return (
		<AbsoluteFill>
			<TransitionSeries>
				<TransitionSeries.Sequence durationInFrames={150}>
					<HeroScene {...props} />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					timing={linearTiming({durationInFrames: 15})}
					presentation={fade()}
				/>
				<TransitionSeries.Sequence durationInFrames={160}>
					<FeaturesScene {...props} />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					timing={linearTiming({durationInFrames: 15})}
					presentation={fade()}
				/>
				<TransitionSeries.Sequence durationInFrames={150}>
					<CtaScene {...props} />
				</TransitionSeries.Sequence>
			</TransitionSeries>
		</AbsoluteFill>
	);
};
