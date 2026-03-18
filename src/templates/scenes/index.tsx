import React from 'react';
import type {SceneConfig, BrandSettings} from '../../lib/types';
import {HeroScene} from './HeroScene';
import {ProblemScene} from './ProblemScene';
import {SolutionScene} from './SolutionScene';
import {FeatureSpotlightScene} from './FeatureSpotlightScene';
import {FeatureGridScene} from './FeatureGridScene';
import {ImageTextScene} from './ImageTextScene';
import {StatsScene} from './StatsScene';
import {TestimonialScene} from './TestimonialScene';
import {LogoWallScene} from './LogoWallScene';
import {CtaScene} from './CtaScene';
import {CustomScene} from './CustomScene';

/** Renders any scene config to its corresponding component */
export const SceneRenderer: React.FC<{config: SceneConfig; brand: BrandSettings}> = ({config, brand}) => {
	switch (config.type) {
		case 'hero':
			return <HeroScene config={config} brand={brand} />;
		case 'problem':
			return <ProblemScene config={config} brand={brand} />;
		case 'solution':
			return <SolutionScene config={config} brand={brand} />;
		case 'feature-spotlight':
			return <FeatureSpotlightScene config={config} brand={brand} />;
		case 'feature-grid':
			return <FeatureGridScene config={config} brand={brand} />;
		case 'image-text':
			return <ImageTextScene config={config} brand={brand} />;
		case 'stats':
			return <StatsScene config={config} brand={brand} />;
		case 'testimonial':
			return <TestimonialScene config={config} brand={brand} />;
		case 'logo-wall':
			return <LogoWallScene config={config} brand={brand} />;
		case 'cta':
			return <CtaScene config={config} brand={brand} />;
		case 'custom':
			return <CustomScene config={config} brand={brand} />;
		default:
			return null;
	}
};
