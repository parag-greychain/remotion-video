import React from 'react';
import {Img, staticFile} from 'remotion';

export const WeavedLogo: React.FC<{size?: number}> = ({size = 80}) => {
	return (
		<Img
			src={staticFile('assets/icon-512.png')}
			style={{width: size, height: size, borderRadius: size / 2}}
		/>
	);
};
