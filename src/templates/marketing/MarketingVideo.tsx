import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {Hero} from './01_Hero';
import {Problem} from './02_Problem';
import {Solution} from './03_Solution';
import {HowItWorks} from './04_HowItWorks';
import {Features} from './05_Features';
import {Stats} from './06_Stats';
import {WhoCanUse} from './07_WhoCanUse';
import {CTA} from './08_CTA';

const T = 15; // transition duration

// Voiceover: 2:18 = 138.45s = 4154 frames
// Durations proportional to script text length per section:
// Hero:       114 chars → 315f (10.5s)
// Problem:    214 chars → 600f (20.0s)
// Solution:   147 chars → 405f (13.5s)
// HowItWorks: 293 chars → 825f (27.5s)
// Features:   246 chars → 690f (23.0s)
// Stats:      190 chars → 525f (17.5s)
// WhoCanUse:  216 chars → 600f (20.0s)
// CTA:        106 chars → 300f (10.0s)
// Total: 4260f - 7*15 = 4155f effective

export const MarketingVideo: React.FC = () => {
	return (
		<AbsoluteFill>
			<Audio src={staticFile('assets/marketing-voiceover.mp3')} volume={1} />
			<TransitionSeries>
				<TransitionSeries.Sequence durationInFrames={315}>
					<Hero />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition timing={linearTiming({durationInFrames: T})} presentation={fade()} />
				<TransitionSeries.Sequence durationInFrames={600}>
					<Problem />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition timing={linearTiming({durationInFrames: T})} presentation={fade()} />
				<TransitionSeries.Sequence durationInFrames={405}>
					<Solution />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition timing={linearTiming({durationInFrames: T})} presentation={fade()} />
				<TransitionSeries.Sequence durationInFrames={825}>
					<HowItWorks />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition timing={linearTiming({durationInFrames: T})} presentation={fade()} />
				<TransitionSeries.Sequence durationInFrames={690}>
					<Features />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition timing={linearTiming({durationInFrames: T})} presentation={fade()} />
				<TransitionSeries.Sequence durationInFrames={525}>
					<Stats />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition timing={linearTiming({durationInFrames: T})} presentation={fade()} />
				<TransitionSeries.Sequence durationInFrames={600}>
					<WhoCanUse />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition timing={linearTiming({durationInFrames: T})} presentation={fade()} />
				<TransitionSeries.Sequence durationInFrames={300}>
					<CTA />
				</TransitionSeries.Sequence>
			</TransitionSeries>
		</AbsoluteFill>
	);
};

// 315+600+405+825+690+525+600+300 = 4260 - 7*15 = 4155
export const MARKETING_DURATION = 4155;
