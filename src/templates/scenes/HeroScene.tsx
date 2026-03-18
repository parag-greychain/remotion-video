import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img} from 'remotion';
import type {HeroSceneConfig, BrandSettings} from '../../lib/types';
import {SceneBackground, isDarkBg} from './SceneBackground';
import {AnimatedText} from '../shared';

export const HeroScene: React.FC<{config: HeroSceneConfig; brand: BrandSettings}> = ({config, brand}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const dark = isDarkBg(config.background);
	const textColor = dark ? '#f0f2f5' : '#1A1A2E';
	const mutedColor = dark ? '#88909c' : '#4A5568';

	const logoScale = spring({fps, frame, config: {damping: 100, mass: 0.8}});
	const rotateAccent = interpolate(frame, [0, 150], [0, 360], {extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill>
			<SceneBackground bg={config.background} />
			{/* Rotating accent ring */}
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
				<div style={{width: 300, height: 300, border: `2px solid ${brand.primaryColor}20`, borderRadius: 20, transform: `rotate(${rotateAccent}deg)`, position: 'absolute'}} />
			</AbsoluteFill>
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 24}}>
				{brand.logoSrc && (
					<div style={{transform: `scale(${logoScale})`}}>
						<Img src={brand.logoSrc} style={{width: 100, height: 100, borderRadius: 50, objectFit: 'cover'}} />
					</div>
				)}
				<AnimatedText delay={8} style={{fontSize: 88, fontWeight: 800, color: textColor, fontFamily: 'system-ui, sans-serif', letterSpacing: -3, textAlign: 'center', maxWidth: 1400, padding: '0 80px'}}>
					{config.headline}
				</AnimatedText>
				<AnimatedText delay={18} style={{fontSize: 32, fontWeight: 400, color: mutedColor, fontFamily: 'system-ui, sans-serif', maxWidth: 800, textAlign: 'center', lineHeight: 1.5}}>
					{config.subtitle}
				</AnimatedText>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
