import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img} from 'remotion';
import type {CtaSceneConfig, BrandSettings} from '../../lib/types';
import {SceneBackground, isDarkBg} from './SceneBackground';
import {AnimatedText} from '../shared';
import {RichTextRenderer} from './RichTextRenderer';

export const CtaScene: React.FC<{config: CtaSceneConfig; brand: BrandSettings}> = ({config, brand}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const dark = isDarkBg(config.background);

	const buttonPulse = interpolate(frame % 45, [0, 22, 45], [1, 1.04, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const logoEntrance = spring({fps, frame, config: {damping: 100, mass: 0.6}});
	const logoScale = interpolate(logoEntrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const isGradient = config.background.type === 'gradient';
	const textColor = isGradient || dark ? '#ffffff' : '#1A1A2E';
	const mutedColor = isGradient || dark ? 'rgba(255,255,255,0.8)' : '#4A5568';
	const buttonBg = isGradient || dark ? '#ffffff' : brand.primaryColor;
	const buttonTextColor = isGradient || dark ? brand.primaryColor : '#ffffff';

	return (
		<AbsoluteFill>
			<SceneBackground bg={config.background} />
			<div style={{position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)'}} />
			<div style={{position: 'absolute', bottom: -150, left: -100, width: 600, height: 600, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)'}} />

			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 24}}>
				{brand.logoSrc && (
					<div style={{transform: `scale(${logoScale})`, marginBottom: 10}}>
						<Img src={brand.logoSrc} style={{width: 80, height: 80, borderRadius: 40, objectFit: 'cover', border: '3px solid rgba(255,255,255,0.3)'}} />
					</div>
				)}
				<AnimatedText delay={8} style={{fontSize: 64, fontWeight: 800, color: textColor, fontFamily: 'system-ui, sans-serif', letterSpacing: -2, textAlign: 'center', maxWidth: 1000}}>
					{config.headline}
				</AnimatedText>
				<AnimatedText delay={14} style={{textAlign: 'center', maxWidth: 600}}>
					<RichTextRenderer content={config.subtitleContent} color={mutedColor} fontSize={24} style={{lineHeight: 1.5}} />
				</AnimatedText>
				<AnimatedText delay={22}>
					<div style={{marginTop: 20, padding: '20px 56px', background: buttonBg, borderRadius: 50, fontSize: 22, fontWeight: 700, color: buttonTextColor, fontFamily: 'system-ui, sans-serif', transform: `scale(${buttonPulse})`, boxShadow: '0 8px 32px rgba(0,0,0,0.15)'}}>
						{config.buttonText}
					</div>
				</AnimatedText>
				<AnimatedText delay={28} style={{fontSize: 18, color: mutedColor, fontFamily: 'system-ui, sans-serif'}}>
					{config.buttonUrl}
				</AnimatedText>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
