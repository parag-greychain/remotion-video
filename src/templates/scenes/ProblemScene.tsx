import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import type {ProblemSceneConfig, BrandSettings} from '../../lib/types';
import {SceneBackground, isDarkBg} from './SceneBackground';
import {AnimatedText} from '../shared';
import {RichTextRenderer} from './RichTextRenderer';

export const ProblemScene: React.FC<{config: ProblemSceneConfig; brand: BrandSettings}> = ({config, brand}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const dark = isDarkBg(config.background);

	const contentEntrance = spring({fps, frame: Math.max(0, frame - 12), config: {damping: 200}});
	const contentY = interpolate(contentEntrance, [0, 1], [40, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const contentOpacity = interpolate(contentEntrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill>
			<SceneBackground bg={config.background} />
			{/* Top accent line */}
			<div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${brand.primaryColor}, ${brand.accentColor})`}} />
			<AbsoluteFill style={{justifyContent: 'center', paddingLeft: 200, paddingRight: 200}}>
				<AnimatedText delay={0} style={{fontSize: 52, fontWeight: 700, color: dark ? '#f0f2f5' : '#1A1A2E', fontFamily: 'system-ui, sans-serif', marginBottom: 32}}>
					{config.headline}
				</AnimatedText>
				<div style={{transform: `translateY(${contentY}px)`, opacity: contentOpacity}}>
					<RichTextRenderer
						content={config.bodyContent}
						color={dark ? '#c0c8d4' : '#374151'}
						fontSize={26}
						style={{maxWidth: 1000}}
					/>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
