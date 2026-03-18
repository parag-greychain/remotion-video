import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img} from 'remotion';
import type {LogoWallSceneConfig, BrandSettings} from '../../lib/types';
import {SceneBackground, isDarkBg} from './SceneBackground';
import {AnimatedText, GradientLine} from '../shared';

export const LogoWallScene: React.FC<{config: LogoWallSceneConfig; brand: BrandSettings}> = ({config, brand}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const dark = isDarkBg(config.background);

	return (
		<AbsoluteFill>
			<SceneBackground bg={config.background} />
			<AbsoluteFill style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40}}>
				<AnimatedText delay={0} style={{fontSize: 48, fontWeight: 700, color: dark ? '#f0f2f5' : '#1A1A2E', fontFamily: 'system-ui, sans-serif'}}>
					{config.headline}
				</AnimatedText>
				<GradientLine color1={brand.primaryColor} color2={brand.accentColor} maxWidth={150} />
				<div style={{display: 'flex', gap: 48, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1200, marginTop: 20}}>
					{config.logos.map((logo, i) => {
						const entrance = spring({fps, frame: Math.max(0, frame - 10 - i * 6), config: {damping: 200}});
						const scale = interpolate(entrance, [0, 1], [0.5, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
						const opacity = interpolate(entrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

						return (
							<div key={i} style={{transform: `scale(${scale})`, opacity, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
								{logo.src ? (
									<Img src={logo.src} style={{width: 100, height: 100, objectFit: 'contain', borderRadius: 16}} />
								) : (
									<div style={{width: 100, height: 100, borderRadius: 16, background: dark ? '#1c222b' : '#E8ECF2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: dark ? '#88909c' : '#4A5568', fontFamily: 'system-ui, sans-serif', fontWeight: 600}}>
										{logo.name.slice(0, 3).toUpperCase()}
									</div>
								)}
								<span style={{fontSize: 14, color: dark ? '#88909c' : '#4A5568', fontFamily: 'system-ui, sans-serif', fontWeight: 500}}>
									{logo.name}
								</span>
							</div>
						);
					})}
				</div>
				{config.logos.length === 0 && (
					<span style={{fontSize: 20, color: dark ? '#88909c40' : '#4A556840', fontFamily: 'system-ui, sans-serif'}}>
						Upload client logos to display here
					</span>
				)}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
