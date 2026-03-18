import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import type {FeatureGridSceneConfig, BrandSettings} from '../../lib/types';
import {SceneBackground, isDarkBg} from './SceneBackground';
import {AnimatedText, GradientLine} from '../shared';

const featureIcons = ['🏗️', '🔓', '🤖', '⚡', '🎯', '🛡️', '🚀', '💡', '🔧', '📊'];

const Card: React.FC<{title: string; description: string; delay: number; index: number; cardWidth: number; brand: BrandSettings; dark: boolean}> = ({title, description, delay, index, cardWidth, brand, dark}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const entrance = spring({fps, frame: Math.max(0, frame - delay), config: {damping: 200}});
	const y = interpolate(entrance, [0, 1], [80, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const opacity = interpolate(entrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<div style={{transform: `translateY(${y}px)`, opacity, width: cardWidth, background: dark ? '#0a0f1a' : '#ffffff', borderRadius: 24, padding: 36, boxShadow: `0 4px 40px ${brand.primaryColor}12`, border: `1px solid ${dark ? '#1c222b' : '#E8ECF2'}`}}>
			<div style={{width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${brand.primaryColor}, ${brand.accentColor})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 20}}>
				{featureIcons[index % featureIcons.length]}
			</div>
			<div style={{fontSize: 22, fontWeight: 700, color: dark ? '#f0f2f5' : '#1A1A2E', fontFamily: 'system-ui, sans-serif', marginBottom: 10}}>
				{title}
			</div>
			<div style={{fontSize: 15, color: dark ? '#88909c' : '#4A5568', fontFamily: 'system-ui, sans-serif', lineHeight: 1.6}}>
				{description}
			</div>
		</div>
	);
};

export const FeatureGridScene: React.FC<{config: FeatureGridSceneConfig; brand: BrandSettings}> = ({config, brand}) => {
	const dark = isDarkBg(config.background);
	const features = config.features || [];
	const maxPerRow = Math.min(features.length, 3);
	const totalGap = (maxPerRow - 1) * 36;
	const cardWidth = Math.min(420, (1920 - 120 - totalGap) / maxPerRow);

	const rows: typeof features[] = [];
	for (let i = 0; i < features.length; i += maxPerRow) {
		rows.push(features.slice(i, i + maxPerRow));
	}

	return (
		<AbsoluteFill>
			<SceneBackground bg={config.background} />
			<AbsoluteFill style={{flexDirection: 'column', alignItems: 'center', paddingTop: rows.length > 1 ? 50 : 70}}>
				<AnimatedText delay={0} style={{fontSize: 20, fontWeight: 600, color: brand.primaryColor, fontFamily: 'system-ui, sans-serif', letterSpacing: 4, textTransform: 'uppercase' as const, marginBottom: 12}}>
					Features
				</AnimatedText>
				<AnimatedText delay={4} style={{fontSize: 50, fontWeight: 700, color: dark ? '#f0f2f5' : '#1A1A2E', fontFamily: 'system-ui, sans-serif', marginBottom: 12}}>
					{config.headline}
				</AnimatedText>
				<GradientLine color1={brand.primaryColor} color2={brand.accentColor} />
				<div style={{marginBottom: rows.length > 1 ? 30 : 40}} />
				{rows.map((row, ri) => (
					<div key={ri} style={{display: 'flex', gap: 36, justifyContent: 'center', marginBottom: ri < rows.length - 1 ? 28 : 0}}>
						{row.map((f, ci) => {
							const gi = ri * maxPerRow + ci;
							return <Card key={gi} title={f.title} description={f.description} delay={10 + gi * 8} index={gi} cardWidth={cardWidth} brand={brand} dark={dark} />;
						})}
					</div>
				))}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
