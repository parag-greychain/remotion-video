import React from 'react';
import {
	AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	spring,
	interpolate,
	random,
} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {AnimatedText, GlowOrb} from './shared';

interface TeamIntroProps {
	personName: string;
	role: string;
	bio: string;
	achievement1: string;
	achievement2: string;
	achievement3: string;
	achievement4: string;
	contactEmail: string;
	contactLocation: string;
	primaryColor: string;
	accentColor: string;
}

const HeroScene: React.FC<TeamIntroProps> = (props) => {
	const frame = useCurrentFrame();
	const gradient = `linear-gradient(135deg, ${props.primaryColor}, ${props.accentColor})`;
	const cursorOpacity = Math.floor(frame / 15) % 2 === 0 ? 1 : 0;

	return (
		<AbsoluteFill style={{background: '#020204'}}>
			{[0, 1, 2, 3, 4].map((i) => (
				<GlowOrb
					key={i}
					index={i}
					color={i % 2 === 0 ? props.primaryColor : props.accentColor}
				/>
			))}
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					gap: 24,
				}}
			>
				<AnimatedText
					delay={5}
					style={{
						fontSize: 92,
						fontWeight: 800,
						color: '#f0f2f5',
						fontFamily: 'system-ui, sans-serif',
						letterSpacing: -3,
					}}
				>
					{props.personName}
				</AnimatedText>
				<AnimatedText
					delay={12}
					style={{
						fontSize: 36,
						fontWeight: 600,
						background: gradient,
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						fontFamily: 'system-ui, sans-serif',
					}}
				>
					{props.role}
				</AnimatedText>
				<AnimatedText
					delay={20}
					style={{
						fontSize: 22,
						color: '#88909c',
						fontFamily: 'system-ui, sans-serif',
						maxWidth: 750,
						textAlign: 'center',
						lineHeight: 1.6,
					}}
				>
					{props.bio}
				</AnimatedText>
				<div
					style={{
						width: 3,
						height: 32,
						background: props.primaryColor,
						opacity: cursorOpacity,
						marginTop: 10,
						borderRadius: 2,
					}}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

const StatCard: React.FC<{
	value: string;
	delay: number;
	color: string;
}> = ({value, delay, color}) => {
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
				background: '#05070d',
				border: '1px solid #1c222b',
				borderRadius: 20,
				padding: '32px 40px',
				textAlign: 'center',
				minWidth: 280,
			}}
		>
			<div
				style={{
					fontSize: 20,
					fontWeight: 600,
					color,
					fontFamily: 'system-ui, sans-serif',
				}}
			>
				{value}
			</div>
		</div>
	);
};

const AchievementsScene: React.FC<TeamIntroProps> = (props) => {
	return (
		<AbsoluteFill style={{background: '#020204'}}>
			<AbsoluteFill
				style={{
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 30,
				}}
			>
				<AnimatedText
					delay={0}
					style={{
						fontSize: 48,
						fontWeight: 700,
						color: '#f0f2f5',
						fontFamily: 'system-ui, sans-serif',
						marginBottom: 20,
					}}
				>
					Impact & Achievements
				</AnimatedText>
				<div style={{display: 'flex', gap: 24}}>
					<StatCard value={props.achievement1} delay={10} color={props.primaryColor} />
					<StatCard value={props.achievement2} delay={18} color={props.accentColor} />
				</div>
				<div style={{display: 'flex', gap: 24}}>
					<StatCard value={props.achievement3} delay={26} color={props.accentColor} />
					<StatCard value={props.achievement4} delay={34} color={props.primaryColor} />
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

const CtaScene: React.FC<TeamIntroProps> = (props) => {
	const frame = useCurrentFrame();
	const glowOpacity = interpolate(frame % 60, [0, 30, 60], [0.15, 0.3, 0.15], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const buttonPulse = interpolate(frame % 45, [0, 22, 45], [1, 1.03, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{background: '#020204'}}>
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
				<div
					style={{
						width: 600,
						height: 600,
						borderRadius: '50%',
						background: `radial-gradient(circle, ${props.primaryColor}40 0%, transparent 70%)`,
						position: 'absolute',
						filter: 'blur(60px)',
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
						color: '#f0f2f5',
						fontFamily: 'system-ui, sans-serif',
					}}
				>
					Let's Connect
				</AnimatedText>
				<AnimatedText delay={10} style={{display: 'flex', gap: 40, marginTop: 20}}>
					<span style={{fontSize: 18, color: props.primaryColor, fontFamily: 'system-ui, sans-serif', fontWeight: 500}}>
						{props.contactEmail}
					</span>
					<span style={{fontSize: 18, color: props.accentColor, fontFamily: 'system-ui, sans-serif', fontWeight: 500}}>
						{props.contactLocation}
					</span>
				</AnimatedText>
				<AnimatedText delay={18}>
					<div
						style={{
							marginTop: 24,
							padding: '18px 52px',
							background: `linear-gradient(135deg, ${props.primaryColor}, ${props.accentColor})`,
							borderRadius: 50,
							fontSize: 20,
							fontWeight: 700,
							color: '#ffffff',
							fontFamily: 'system-ui, sans-serif',
							transform: `scale(${buttonPulse})`,
						}}
					>
						Get in Touch
					</div>
				</AnimatedText>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

export const TeamIntro: React.FC<TeamIntroProps> = (props) => {
	return (
		<AbsoluteFill>
			<TransitionSeries>
				<TransitionSeries.Sequence durationInFrames={130}>
					<HeroScene {...props} />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					timing={linearTiming({durationInFrames: 15})}
					presentation={fade()}
				/>
				<TransitionSeries.Sequence durationInFrames={130}>
					<AchievementsScene {...props} />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					timing={linearTiming({durationInFrames: 15})}
					presentation={fade()}
				/>
				<TransitionSeries.Sequence durationInFrames={120}>
					<CtaScene {...props} />
				</TransitionSeries.Sequence>
			</TransitionSeries>
		</AbsoluteFill>
	);
};
