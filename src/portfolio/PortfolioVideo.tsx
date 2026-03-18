import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {HeroScene} from './HeroScene';
import {ExperienceScene} from './ExperienceScene';
import {AchievementsScene} from './AchievementsScene';
import {ProjectsScene} from './ProjectsScene';
import {CtaScene} from './CtaScene';

// Voiceover timing breakdown (58.44s total):
// 0-14s:  "Parag Baldaniya... integrating AI functionalities."    → Hero
// 14-25s: "From Search Result Media... AI integration."           → Experience
// 25-37s: "The impact speaks... healthcare, and fintech."         → Achievements
// 37-48s: "From AI Proposal Accelerators... delivery in mind."    → Projects
// 48-58s: "Let's build something great... Get in touch today."    → CTA

export const PortfolioVideo: React.FC = () => {
	return (
		<AbsoluteFill>
			<Audio src={staticFile('assets/portfolio-voiceover.mp3')} volume={1} />
			<TransitionSeries>
				<TransitionSeries.Sequence durationInFrames={420}>
					<HeroScene />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					timing={linearTiming({durationInFrames: 15})}
					presentation={fade()}
				/>
				<TransitionSeries.Sequence durationInFrames={350}>
					<ExperienceScene />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					timing={linearTiming({durationInFrames: 15})}
					presentation={fade()}
				/>
				<TransitionSeries.Sequence durationInFrames={370}>
					<AchievementsScene />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					timing={linearTiming({durationInFrames: 15})}
					presentation={fade()}
				/>
				<TransitionSeries.Sequence durationInFrames={340}>
					<ProjectsScene />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					timing={linearTiming({durationInFrames: 15})}
					presentation={fade()}
				/>
				<TransitionSeries.Sequence durationInFrames={340}>
					<CtaScene />
				</TransitionSeries.Sequence>
			</TransitionSeries>
		</AbsoluteFill>
	);
};
