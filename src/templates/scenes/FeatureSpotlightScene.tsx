import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img} from 'remotion';
import type {FeatureSpotlightSceneConfig, BrandSettings} from '../../lib/types';
import {SceneBackground, isDarkBg} from './SceneBackground';
import {AnimatedText} from '../shared';
import {RichTextRenderer} from './RichTextRenderer';

export const FeatureSpotlightScene: React.FC<{config: FeatureSpotlightSceneConfig; brand: BrandSettings}> = ({config, brand}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const dark = isDarkBg(config.background);
	const textColor = dark ? '#f0f2f5' : '#1A1A2E';
	const mutedColor = dark ? '#a0a8b4' : '#4A5568';
	const isLeft = config.layout === 'image-left';

	const imgEntrance = spring({fps, frame: Math.max(0, frame - 5), config: {damping: 100}});
	const imgX = interpolate(imgEntrance, [0, 1], [isLeft ? -80 : 80, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const imgOpacity = interpolate(imgEntrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const imageBlock = config.imageSrc ? (
		<div style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', transform: `translateX(${imgX}px)`, opacity: imgOpacity}}>
			<Img src={config.imageSrc} style={{maxWidth: '90%', maxHeight: 500, borderRadius: 20, objectFit: 'contain', boxShadow: '0 16px 48px rgba(0,0,0,0.15)'}} />
		</div>
	) : (
		<div style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
			<div style={{width: 300, height: 300, borderRadius: 24, background: `linear-gradient(135deg, ${brand.primaryColor}20, ${brand.accentColor}20)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, transform: `translateX(${imgX}px)`, opacity: imgOpacity}}>
				🔦
			</div>
		</div>
	);

	const textBlock = (
		<div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 60px'}}>
			<AnimatedText delay={10} style={{fontSize: 48, fontWeight: 700, color: textColor, fontFamily: 'system-ui, sans-serif', marginBottom: 24, lineHeight: 1.2}}>
				{config.title}
			</AnimatedText>
			<AnimatedText delay={18}>
				<RichTextRenderer content={config.descriptionContent} color={mutedColor} fontSize={22} />
			</AnimatedText>
		</div>
	);

	return (
		<AbsoluteFill>
			<SceneBackground bg={config.background} />
			<AbsoluteFill style={{display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '0 80px'}}>
				{isLeft ? <>{imageBlock}{textBlock}</> : <>{textBlock}{imageBlock}</>}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
