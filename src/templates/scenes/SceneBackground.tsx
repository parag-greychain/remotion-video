import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import type {BackgroundConfig} from '../../lib/types';

/** Renders the background layer for any scene */
export const SceneBackground: React.FC<{bg: BackgroundConfig}> = ({bg}) => {
	if (bg.type === 'image' && bg.imageSrc) {
		return (
			<AbsoluteFill>
				<Img
					src={bg.imageSrc}
					style={{width: '100%', height: '100%', objectFit: 'cover'}}
				/>
				<AbsoluteFill
					style={{background: `rgba(0, 0, 0, ${bg.overlayOpacity})`}}
				/>
			</AbsoluteFill>
		);
	}

	if (bg.type === 'gradient') {
		return (
			<AbsoluteFill
				style={{
					background: `linear-gradient(135deg, ${bg.color1} 0%, ${bg.color2} 100%)`,
				}}
			/>
		);
	}

	// solid
	return <AbsoluteFill style={{background: bg.color1}} />;
};

/** Is this a dark background? Used to decide text color */
export function isDarkBg(bg: BackgroundConfig): boolean {
	const color = bg.type === 'image' ? '#000000' : bg.color1;
	const hex = color.replace('#', '');
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	return bg.type === 'image' ? bg.overlayOpacity > 0.3 : luminance < 0.5;
}
