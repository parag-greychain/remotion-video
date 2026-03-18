import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import type {StatsSceneConfig, BrandSettings} from '../../lib/types';
import {SceneBackground, isDarkBg} from './SceneBackground';
import {AnimatedText, GradientLine} from '../shared';

const StatCard: React.FC<{value: string; label: string; delay: number; color: string; dark: boolean}> = ({value, label, delay, color, dark}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const entrance = spring({fps, frame: Math.max(0, frame - delay), config: {damping: 200}});
	const scale = interpolate(entrance, [0, 1], [0.5, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const opacity = interpolate(entrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<div style={{transform: `scale(${scale})`, opacity, background: dark ? '#0a0f1a' : '#ffffff', border: `1px solid ${dark ? '#1c222b' : '#E8ECF2'}`, borderRadius: 24, padding: '40px 48px', textAlign: 'center', minWidth: 220}}>
			<div style={{fontSize: 52, fontWeight: 800, color, fontFamily: 'system-ui, sans-serif', marginBottom: 8}}>
				{value}
			</div>
			<div style={{fontSize: 17, color: dark ? '#88909c' : '#4A5568', fontFamily: 'system-ui, sans-serif', fontWeight: 500}}>
				{label}
			</div>
		</div>
	);
};

export const StatsScene: React.FC<{config: StatsSceneConfig; brand: BrandSettings}> = ({config, brand}) => {
	const dark = isDarkBg(config.background);
	const colors = [brand.primaryColor, brand.accentColor];

	return (
		<AbsoluteFill>
			<SceneBackground bg={config.background} />
			<AbsoluteFill style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30}}>
				<AnimatedText delay={0} style={{fontSize: 48, fontWeight: 700, color: dark ? '#f0f2f5' : '#1A1A2E', fontFamily: 'system-ui, sans-serif', marginBottom: 10}}>
					{config.headline}
				</AnimatedText>
				<GradientLine color1={brand.primaryColor} color2={brand.accentColor} maxWidth={150} />
				<div style={{marginBottom: 10}} />
				<div style={{display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1400}}>
					{config.stats.map((s, i) => (
						<StatCard key={i} value={s.value} label={s.label} delay={10 + i * 8} color={colors[i % colors.length]} dark={dark} />
					))}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
