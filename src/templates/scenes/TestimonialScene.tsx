import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img} from 'remotion';
import type {TestimonialSceneConfig, BrandSettings} from '../../lib/types';
import {SceneBackground, isDarkBg} from './SceneBackground';
import {AnimatedText} from '../shared';
import {RichTextRenderer} from './RichTextRenderer';

export const TestimonialScene: React.FC<{config: TestimonialSceneConfig; brand: BrandSettings}> = ({config, brand}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const dark = isDarkBg(config.background);
	const textColor = dark ? '#f0f2f5' : '#1A1A2E';
	const mutedColor = dark ? '#88909c' : '#4A5568';

	const quoteEntrance = spring({fps, frame: Math.max(0, frame - 5), config: {damping: 200}});
	const quoteScale = interpolate(quoteEntrance, [0, 1], [0.9, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const stars = '★'.repeat(config.starRating) + '☆'.repeat(5 - config.starRating);

	return (
		<AbsoluteFill>
			<SceneBackground bg={config.background} />
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '0 200px'}}>
				<AnimatedText delay={0} style={{fontSize: 120, color: `${brand.primaryColor}30`, fontFamily: 'Georgia, serif', lineHeight: 0.8, marginBottom: -20}}>
					"
				</AnimatedText>
				<AnimatedText delay={5} style={{transform: `scale(${quoteScale})`, textAlign: 'center', maxWidth: 900}}>
					<RichTextRenderer content={config.quoteContent} color={textColor} fontSize={32} style={{fontStyle: 'italic', lineHeight: 1.7}} />
				</AnimatedText>

				<div style={{marginTop: 40, display: 'flex', alignItems: 'center', gap: 20}}>
					{config.avatarSrc ? (
						<AnimatedText delay={20}>
							<Img src={config.avatarSrc} style={{width: 64, height: 64, borderRadius: 32, objectFit: 'cover', border: `3px solid ${brand.primaryColor}`}} />
						</AnimatedText>
					) : (
						<AnimatedText delay={20}>
							<div style={{width: 64, height: 64, borderRadius: 32, background: `linear-gradient(135deg, ${brand.primaryColor}, ${brand.accentColor})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#fff'}}>
								{config.personName.charAt(0)}
							</div>
						</AnimatedText>
					)}
					<AnimatedText delay={25} style={{display: 'flex', flexDirection: 'column'}}>
						<span style={{fontSize: 20, fontWeight: 700, color: textColor, fontFamily: 'system-ui, sans-serif'}}>
							{config.personName}
						</span>
						<span style={{fontSize: 16, color: mutedColor, fontFamily: 'system-ui, sans-serif'}}>
							{config.personRole}
						</span>
					</AnimatedText>
				</div>

				<AnimatedText delay={30} style={{marginTop: 16, fontSize: 24, color: '#F59E0B', letterSpacing: 4}}>
					{stars}
				</AnimatedText>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
