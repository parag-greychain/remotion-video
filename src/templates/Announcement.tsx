import React from 'react';
import {
	AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	spring,
	interpolate,
} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {AnimatedText, GradientLine} from './shared';

interface AnnouncementProps {
	headline: string;
	subheadline: string;
	body: string;
	ctaText: string;
	ctaUrl: string;
	primaryColor: string;
	accentColor: string;
}

const HeadlineScene: React.FC<AnnouncementProps> = (props) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const gradient = `linear-gradient(135deg, ${props.primaryColor}, ${props.accentColor})`;

	const bgScale = spring({fps, frame, config: {damping: 200}});
	const ringScale = interpolate(bgScale, [0, 1], [0.3, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const rotateRing = interpolate(frame, [0, 200], [0, 360], {
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{background: '#020204'}}>
			{/* Decorative rings */}
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
				<div
					style={{
						width: 500,
						height: 500,
						border: `2px solid ${props.primaryColor}20`,
						borderRadius: '50%',
						transform: `scale(${ringScale}) rotate(${rotateRing}deg)`,
						position: 'absolute',
					}}
				/>
				<div
					style={{
						width: 400,
						height: 400,
						border: `2px solid ${props.accentColor}15`,
						borderRadius: '50%',
						transform: `scale(${ringScale}) rotate(${-rotateRing * 0.7}deg)`,
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
				<AnimatedText
					delay={0}
					style={{
						fontSize: 20,
						fontWeight: 600,
						color: props.primaryColor,
						fontFamily: 'system-ui, sans-serif',
						letterSpacing: 6,
						textTransform: 'uppercase' as const,
					}}
				>
					Announcement
				</AnimatedText>
				<AnimatedText
					delay={8}
					style={{
						fontSize: 80,
						fontWeight: 800,
						color: '#f0f2f5',
						fontFamily: 'system-ui, sans-serif',
						letterSpacing: -3,
						textAlign: 'center',
						maxWidth: 1200,
					}}
				>
					{props.headline}
				</AnimatedText>
				<AnimatedText
					delay={16}
					style={{
						fontSize: 28,
						color: '#88909c',
						fontFamily: 'system-ui, sans-serif',
						maxWidth: 800,
						textAlign: 'center',
						lineHeight: 1.5,
					}}
				>
					{props.subheadline}
				</AnimatedText>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

const BodyScene: React.FC<AnnouncementProps> = (props) => {
	const frame = useCurrentFrame();
	const gradient = `linear-gradient(135deg, ${props.primaryColor}, ${props.accentColor})`;

	return (
		<AbsoluteFill style={{background: '#020204'}}>
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					paddingLeft: 200,
					paddingRight: 200,
				}}
			>
				{/* Quote-style left border */}
				<div style={{display: 'flex', gap: 32, alignItems: 'flex-start'}}>
					<div
						style={{
							width: 6,
							minHeight: 100,
							background: gradient,
							borderRadius: 3,
							flexShrink: 0,
						}}
					/>
					<AnimatedText
						delay={5}
						style={{
							fontSize: 36,
							color: '#f0f2f5',
							fontFamily: 'system-ui, sans-serif',
							lineHeight: 1.7,
							fontWeight: 400,
						}}
					>
						{props.body}
					</AnimatedText>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

const CtaScene: React.FC<AnnouncementProps> = (props) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const gradient = `linear-gradient(135deg, ${props.primaryColor}, ${props.accentColor})`;

	const entrance = spring({fps, frame, config: {damping: 100}});
	const scale = interpolate(entrance, [0, 1], [0.7, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const buttonPulse = interpolate(frame % 45, [0, 22, 45], [1, 1.04, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				background: `linear-gradient(${135 + interpolate(frame, [0, 100], [0, 30], {extrapolateRight: 'clamp'})}deg, ${props.primaryColor}, ${props.accentColor})`,
			}}
		>
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					gap: 30,
				}}
			>
				<AnimatedText
					delay={5}
					style={{
						fontSize: 56,
						fontWeight: 800,
						color: '#ffffff',
						fontFamily: 'system-ui, sans-serif',
						transform: `scale(${scale})`,
					}}
				>
					{props.ctaText}
				</AnimatedText>
				<AnimatedText delay={15}>
					<div
						style={{
							padding: '20px 60px',
							background: '#ffffff',
							borderRadius: 50,
							fontSize: 22,
							fontWeight: 700,
							color: props.primaryColor,
							fontFamily: 'system-ui, sans-serif',
							transform: `scale(${buttonPulse})`,
							boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
						}}
					>
						{props.ctaUrl}
					</div>
				</AnimatedText>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

export const Announcement: React.FC<AnnouncementProps> = (props) => {
	return (
		<AbsoluteFill>
			<TransitionSeries>
				<TransitionSeries.Sequence durationInFrames={110}>
					<HeadlineScene {...props} />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					timing={linearTiming({durationInFrames: 15})}
					presentation={fade()}
				/>
				<TransitionSeries.Sequence durationInFrames={100}>
					<BodyScene {...props} />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					timing={linearTiming({durationInFrames: 15})}
					presentation={fade()}
				/>
				<TransitionSeries.Sequence durationInFrames={100}>
					<CtaScene {...props} />
				</TransitionSeries.Sequence>
			</TransitionSeries>
		</AbsoluteFill>
	);
};
