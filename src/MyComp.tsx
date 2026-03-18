import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {HeroScene} from './scenes/HeroScene';
import {ProblemScene} from './scenes/ProblemScene';
import {FeaturesScene} from './scenes/FeaturesScene';
import {DeployScene} from './scenes/DeployScene';
import {CtaScene} from './scenes/CtaScene';

export const MyComp: React.FC = () => {
	return (
		<AbsoluteFill>
			<Audio src={staticFile('assets/voiceover.mp3')} volume={1} />
			<TransitionSeries>
				<TransitionSeries.Sequence durationInFrames={180}>
					<HeroScene />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					timing={linearTiming({durationInFrames: 15})}
					presentation={fade()}
				/>
				<TransitionSeries.Sequence durationInFrames={330}>
					<ProblemScene />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					timing={linearTiming({durationInFrames: 15})}
					presentation={fade()}
				/>
				<TransitionSeries.Sequence durationInFrames={420}>
					<FeaturesScene />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					timing={linearTiming({durationInFrames: 15})}
					presentation={fade()}
				/>
				<TransitionSeries.Sequence durationInFrames={270}>
					<DeployScene />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					timing={linearTiming({durationInFrames: 15})}
					presentation={fade()}
				/>
				<TransitionSeries.Sequence durationInFrames={270}>
					<CtaScene />
				</TransitionSeries.Sequence>
			</TransitionSeries>
		</AbsoluteFill>
	);
};
