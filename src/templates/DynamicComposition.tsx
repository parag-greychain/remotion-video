import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import type {VideoProject} from '../lib/types';
import {SceneRenderer} from './scenes';

const TRANSITION_FRAMES = 15;

interface DynamicCompositionProps {
	brand: VideoProject['brand'];
	scenes: VideoProject['scenes'];
}

export const DynamicComposition: React.FC<DynamicCompositionProps> = ({brand, scenes}) => {
	if (!scenes || scenes.length === 0) {
		return (
			<AbsoluteFill style={{background: '#020204', justifyContent: 'center', alignItems: 'center'}}>
				<span style={{fontSize: 32, color: '#88909c', fontFamily: 'system-ui, sans-serif'}}>
					Add scenes to get started
				</span>
			</AbsoluteFill>
		);
	}

	if (scenes.length === 1) {
		return (
			<AbsoluteFill>
				<SceneRenderer config={scenes[0].config} brand={brand} />
			</AbsoluteFill>
		);
	}

	return (
		<AbsoluteFill>
			<TransitionSeries>
				{scenes.map((scene, index) => (
					<React.Fragment key={scene.id}>
						{index > 0 && (
							<TransitionSeries.Transition
								timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
								presentation={fade()}
							/>
						)}
						<TransitionSeries.Sequence durationInFrames={scene.config.durationInFrames}>
							<SceneRenderer config={scene.config} brand={brand} />
						</TransitionSeries.Sequence>
					</React.Fragment>
				))}
			</TransitionSeries>
		</AbsoluteFill>
	);
};

/** Calculate total video duration from scenes */
export function calculateTotalDuration(scenes: VideoProject['scenes']): number {
	if (scenes.length === 0) return 150; // minimum
	const sceneDuration = scenes.reduce((sum, s) => sum + s.config.durationInFrames, 0);
	const transitionDuration = Math.max(0, scenes.length - 1) * TRANSITION_FRAMES;
	return Math.max(30, sceneDuration - transitionDuration);
}
