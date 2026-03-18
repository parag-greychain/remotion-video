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

const CloudIcon: React.FC<{
	label: string;
	delay: number;
	x: number;
	y: number;
}> = ({label, delay, x, y}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({
		fps,
		frame: Math.max(0, frame - delay),
		config: {damping: 200},
	});

	const scale = interpolate(entrance, [0, 1], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const opacity = interpolate(entrance, [0, 1], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Subtle float
	const floatY = Math.sin((frame + delay * 10) * 0.05) * 4;

	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				transform: `scale(${scale}) translateY(${floatY}px)`,
				opacity,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 12,
			}}
		>
			<div
				style={{
					width: 100,
					height: 100,
					borderRadius: 24,
					background: theme.white,
					boxShadow: '0 8px 40px rgba(31, 107, 255, 0.12)',
					border: '2px solid ' + theme.lightGray,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: 44,
				}}
			>
				☁️
			</div>
			<span
				style={{
					fontSize: 18,
					fontWeight: 600,
					color: theme.darkText,
					fontFamily: theme.fontFamily,
				}}
			>
				{label}
			</span>
		</div>
	);
};

export const DeployScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Connection lines animation
	const lineProgress = interpolate(frame, [30, 60], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Center hub pulse
	const pulse = spring({
		fps,
		frame: Math.max(0, frame - 15),
		config: {damping: 200},
	});

	return (
		<AbsoluteFill style={{background: theme.white}}>
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
						color: theme.blue,
						fontFamily: theme.fontFamily,
						letterSpacing: 4,
						textTransform: 'uppercase',
						marginBottom: 12,
					}}
				>
					Infrastructure
				</AnimatedText>
				<AnimatedText
					delay={5}
					style={{
						fontSize: 50,
						fontWeight: 700,
						color: theme.darkText,
						fontFamily: theme.fontFamily,
						marginBottom: 60,
					}}
				>
					Deploy Anywhere, Own Everything
				</AnimatedText>
			</AbsoluteFill>

			{/* Connection lines (SVG) */}
			<AbsoluteFill>
				<svg width="1920" height="1080" style={{position: 'absolute'}}>
					{/* Lines from center to clouds */}
					{[
						{x2: 380, y2: 520},
						{x2: 780, y2: 520},
						{x2: 1140, y2: 520},
						{x2: 1540, y2: 520},
					].map((line, i) => (
						<line
							key={i}
							x1={960}
							y1={680}
							x2={line.x2}
							y2={line.y2 + 50}
							stroke={theme.blue}
							strokeWidth={2}
							strokeDasharray="8 4"
							opacity={lineProgress * 0.4}
						/>
					))}
				</svg>
			</AbsoluteFill>

			{/* Cloud providers */}
			<CloudIcon label="AWS" delay={15} x={330} y={460} />
			<CloudIcon label="Azure" delay={22} x={730} y={460} />
			<CloudIcon label="GCP" delay={29} x={1090} y={460} />
			<CloudIcon label="On-Premise" delay={36} x={1490} y={460} />

			{/* Center Weaved hub */}
			<div
				style={{
					position: 'absolute',
					left: '50%',
					top: 620,
					transform: `translate(-50%, 0) scale(${interpolate(pulse, [0, 1], [0.5, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})})`,
					opacity: interpolate(pulse, [0, 1], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}),
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 16,
				}}
			>
				<div
					style={{
						width: 130,
						height: 130,
						borderRadius: 32,
						background: theme.gradient,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						boxShadow: '0 12px 48px rgba(31, 107, 255, 0.3)',
					}}
				>
					<span
						style={{
							fontSize: 48,
							fontWeight: 800,
							color: theme.white,
							fontFamily: 'Georgia, serif',
							fontStyle: 'italic',
						}}
					>
						W
					</span>
				</div>
				<span
					style={{
						fontSize: 22,
						fontWeight: 700,
						color: theme.darkText,
						fontFamily: theme.fontFamily,
					}}
				>
					Weaved Platform
				</span>
			</div>
		</AbsoluteFill>
	);
};
