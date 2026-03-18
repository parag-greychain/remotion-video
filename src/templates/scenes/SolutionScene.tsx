import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img} from 'remotion';
import type {SolutionSceneConfig, BrandSettings} from '../../lib/types';
import {SceneBackground, isDarkBg} from './SceneBackground';
import {AnimatedText} from '../shared';

export const SolutionScene: React.FC<{config: SolutionSceneConfig; brand: BrandSettings}> = ({config, brand}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const dark = isDarkBg(config.background);
	const textColor = dark ? '#f0f2f5' : '#1A1A2E';

	const imgEntrance = spring({fps, frame: Math.max(0, frame - 15), config: {damping: 100}});
	const imgScale = interpolate(imgEntrance, [0, 1], [0.8, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const imgOpacity = interpolate(imgEntrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill>
			<SceneBackground bg={config.background} />
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 30}}>
				<AnimatedText delay={0} style={{fontSize: 24, fontWeight: 600, color: brand.primaryColor, fontFamily: 'system-ui, sans-serif', letterSpacing: 4, textTransform: 'uppercase' as const}}>
					Introducing
				</AnimatedText>
				<AnimatedText delay={6} style={{fontSize: 76, fontWeight: 800, color: textColor, fontFamily: 'system-ui, sans-serif', letterSpacing: -2}}>
					{config.productName}
				</AnimatedText>
				<AnimatedText delay={14} style={{fontSize: 28, color: dark ? '#88909c' : '#4A5568', fontFamily: 'system-ui, sans-serif'}}>
					{config.tagline}
				</AnimatedText>
				{config.productImageSrc && (
					<div style={{transform: `scale(${imgScale})`, opacity: imgOpacity, marginTop: 20}}>
						<Img src={config.productImageSrc} style={{maxWidth: 700, maxHeight: 400, borderRadius: 16, objectFit: 'contain', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'}} />
					</div>
				)}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
