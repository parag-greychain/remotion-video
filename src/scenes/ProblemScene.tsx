import React from 'react';
import {
	AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	spring,
	interpolate,
	Sequence,
} from 'remotion';
import {theme} from '../components/theme';
import {AnimatedText} from '../components/AnimatedText';

const ProblemItem: React.FC<{
	icon: string;
	text: string;
	delay: number;
}> = ({icon, text, delay}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({
		fps,
		frame: Math.max(0, frame - delay),
		config: {damping: 200},
	});

	const x = interpolate(entrance, [0, 1], [-60, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const opacity = interpolate(entrance, [0, 1], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Strikethrough animation
	const strikeWidth = interpolate(frame, [delay + 40, delay + 55], [0, 100], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				transform: `translateX(${x}px)`,
				opacity,
				display: 'flex',
				alignItems: 'center',
				gap: 24,
				marginBottom: 28,
				position: 'relative',
			}}
		>
			<div
				style={{
					fontSize: 36,
					width: 60,
					height: 60,
					borderRadius: 16,
					background: '#FEE2E2',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{icon}
			</div>
			<div style={{position: 'relative'}}>
				<span
					style={{
						fontSize: 26,
						color: theme.darkText,
						fontFamily: theme.fontFamily,
						fontWeight: 500,
					}}
				>
					{text}
				</span>
				<div
					style={{
						position: 'absolute',
						top: '50%',
						left: 0,
						width: `${strikeWidth}%`,
						height: 3,
						background: '#EF4444',
						borderRadius: 2,
					}}
				/>
			</div>
		</div>
	);
};

export const ProblemScene: React.FC = () => {
	return (
		<AbsoluteFill style={{background: theme.white}}>
			{/* Subtle accent */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: 4,
					background: theme.gradient,
				}}
			/>

			<AbsoluteFill
				style={{
					justifyContent: 'center',
					paddingLeft: 200,
					paddingRight: 200,
				}}
			>
				<AnimatedText
					delay={0}
					style={{
						fontSize: 48,
						fontWeight: 700,
						color: theme.darkText,
						fontFamily: theme.fontFamily,
						marginBottom: 16,
					}}
				>
					Traditional AI tools fall short.
				</AnimatedText>
				<AnimatedText
					delay={6}
					style={{
						fontSize: 22,
						color: theme.midText,
						fontFamily: theme.fontFamily,
						marginBottom: 50,
					}}
				>
					Black-box systems with limited control aren't enough for the enterprise.
				</AnimatedText>

				<ProblemItem
					icon="🔒"
					text="Limited APIs and closed ecosystems"
					delay={12}
				/>
				<ProblemItem
					icon="☁️"
					text="No data sovereignty or compliance control"
					delay={20}
				/>
				<ProblemItem
					icon="📦"
					text="One-size-fits-all SaaS with no customization"
					delay={28}
				/>
				<ProblemItem
					icon="🚫"
					text="No access to source code or CI/CD pipelines"
					delay={36}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
