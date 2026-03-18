import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';

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
		<div
			style={{
				transform: `translateY(${y}px)`,
				opacity,
				...style,
			}}
		>
			{children}
		</div>
	);
};
