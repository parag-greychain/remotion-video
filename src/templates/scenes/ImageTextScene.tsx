import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img} from 'remotion';
import type {ImageTextSceneConfig, BrandSettings} from '../../lib/types';
import {SceneBackground, isDarkBg} from './SceneBackground';
import {AnimatedText} from '../shared';
import {RichTextRenderer} from './RichTextRenderer';

export const ImageTextScene: React.FC<{config: ImageTextSceneConfig; brand: BrandSettings}> = ({config, brand}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const dark = isDarkBg(config.background);
	const textColor = dark ? '#f0f2f5' : '#1A1A2E';
	const mutedColor = dark ? '#a0a8b4' : '#4A5568';
	const isLeft = config.layout === 'image-left';

	const imgEntrance = spring({fps, frame: Math.max(0, frame - 5), config: {damping: 100}});
	const imgX = interpolate(imgEntrance, [0, 1], [isLeft ? -60 : 60, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const imgOpacity = interpolate(imgEntrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const imageBlock = config.imageSrc ? (
		<div style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', transform: `translateX(${imgX}px)`, opacity: imgOpacity}}>
			<Img src={config.imageSrc} style={{maxWidth: '85%', maxHeight: 550, borderRadius: 20, objectFit: 'contain', boxShadow: '0 16px 48px rgba(0,0,0,0.12)'}} />
		</div>
	) : (
		<div style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
			<div style={{width: 400, height: 300, borderRadius: 20, background: `linear-gradient(135deg, ${brand.primaryColor}15, ${brand.accentColor}15)`, border: `2px dashed ${brand.primaryColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: imgOpacity, transform: `translateX(${imgX}px)`}}>
				<span style={{fontSize: 48, opacity: 0.3}}>🖼️</span>
			</div>
		</div>
	);

	const textBlock = (
		<div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 60px'}}>
			<AnimatedText delay={8} style={{fontSize: 48, fontWeight: 700, color: textColor, fontFamily: 'system-ui, sans-serif', marginBottom: 24, lineHeight: 1.2}}>
				{config.headline}
			</AnimatedText>
			<AnimatedText delay={16}>
				<RichTextRenderer content={config.bodyContent} color={mutedColor} fontSize={22} />
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
