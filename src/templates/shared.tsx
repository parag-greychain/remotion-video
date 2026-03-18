import React from 'react';
import {
	useCurrentFrame,
	useVideoConfig,
	spring,
	interpolate,
	random,
} from 'remotion';

export const AnimatedText: React.FC<{
	children: React.ReactNode;
	delay?: number;
	style?: React.CSSProperties;
}> = ({children, delay = 0, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({
		fps,
		frame: Math.max(0, frame - delay),
		config: {damping: 200},
	});

	const y = interpolate(entrance, [0, 1], [40, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const opacity = interpolate(entrance, [0, 1], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div style={{transform: `translateY(${y}px)`, opacity, ...style}}>
			{children}
		</div>
	);
};

export const GlowOrb: React.FC<{
	index: number;
	color: string;
}> = ({index, color}) => {
	const frame = useCurrentFrame();
	const x = random(`orb-x-${index}`) * 1920;
	const y = random(`orb-y-${index}`) * 1080;
	const size = 200 + random(`orb-size-${index}`) * 400;

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
				background: color,
				opacity: pulse,
				filter: 'blur(80px)',
			}}
		/>
	);
};

export const GradientLine: React.FC<{
	color1: string;
	color2: string;
	maxWidth?: number;
}> = ({color1, color2, maxWidth = 120}) => {
	const frame = useCurrentFrame();
	const width = interpolate(frame, [0, 30], [0, maxWidth], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				width,
				height: 4,
				background: `linear-gradient(90deg, ${color1}, ${color2})`,
				borderRadius: 2,
			}}
		/>
	);
};
