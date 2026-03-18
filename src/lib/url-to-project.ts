import type {VideoProject, Scene, SceneConfig, BackgroundConfig} from './types';
import {createDefaultScene} from './types';
import {plainToRichText, bulletsToRichText} from './richtext-helpers';

interface ScrapeData {
	url: string;
	title: string;
	description: string;
	ogImage: string;
	favicon: string;
	screenshotUrl: string;
	brandColors: string[];
	headings: string[];
	features: string[];
	domain: string;
}

export function scrapeDataToProject(data: ScrapeData): VideoProject {
	const primaryColor = data.brandColors[0] || '#1F6BFF';
	const accentColor = data.brandColors[1] || '#16BAFF';

	const brand = {
		brandName: data.title.split(/[|\-–—]/).map(s => s.trim())[0] || data.domain,
		logoSrc: data.favicon || '',
		primaryColor,
		accentColor,
	};

	const scenes: Scene[] = [];
	let sceneIdx = 0;
	const nextId = () => `url-scene-${++sceneIdx}`;

	// Scene 1: Hero
	scenes.push({
		id: nextId(),
		config: {
			type: 'hero',
			headline: brand.brandName,
			subtitle: data.description || data.headings[0] || 'Welcome to ' + data.domain,
			background: {type: 'solid', color1: '#ffffff', color2: accentColor, imageSrc: '', overlayOpacity: 0.5},
			durationInFrames: 120,
		},
	});

	// Scene 2: Product Screenshot (if we have it)
	if (data.screenshotUrl || data.ogImage) {
		scenes.push({
			id: nextId(),
			config: {
				type: 'solution',
				productName: brand.brandName,
				tagline: data.headings[0] || data.description.slice(0, 80) || 'Discover what we offer',
				productImageSrc: data.screenshotUrl || data.ogImage,
				background: {type: 'solid', color1: '#ffffff', color2: accentColor, imageSrc: '', overlayOpacity: 0.5},
				durationInFrames: 120,
			},
		});
	}

	// Scene 3: Key points / problem (from headings)
	if (data.headings.length > 1) {
		const bulletContent = bulletsToRichText(data.headings.slice(0, 5));
		scenes.push({
			id: nextId(),
			config: {
				type: 'problem',
				headline: 'What We Do',
				bodyContent: bulletContent,
				background: {type: 'solid', color1: '#020204', color2: primaryColor, imageSrc: '', overlayOpacity: 0.5},
				durationInFrames: 150,
			},
		});
	}

	// Scene 4: Features (if scraped)
	if (data.features.length >= 2) {
		scenes.push({
			id: nextId(),
			config: {
				type: 'feature-grid',
				headline: 'Key Features',
				features: data.features.slice(0, 6).map(f => ({
					title: f.length > 40 ? f.slice(0, 40) + '...' : f,
					description: f.length > 40 ? f : '',
				})),
				background: {type: 'solid', color1: '#F7F9FC', color2: accentColor, imageSrc: '', overlayOpacity: 0.5},
				durationInFrames: 150,
			},
		});
	}

	// Scene 5: Image + Text (if we have OG image)
	if (data.ogImage && data.description) {
		scenes.push({
			id: nextId(),
			config: {
				type: 'image-text',
				headline: data.headings[1] || 'Learn More',
				bodyContent: plainToRichText(data.description),
				imageSrc: data.ogImage,
				layout: 'image-left',
				background: {type: 'solid', color1: '#ffffff', color2: accentColor, imageSrc: '', overlayOpacity: 0.5},
				durationInFrames: 120,
			},
		});
	}

	// Scene 6: CTA
	scenes.push({
		id: nextId(),
		config: {
			type: 'cta',
			headline: 'Get Started Today',
			subtitleContent: plainToRichText(data.description ? data.description.slice(0, 120) : `Visit ${data.domain} to learn more.`),
			buttonText: 'Visit ' + data.domain,
			buttonUrl: data.domain,
			background: {type: 'gradient', color1: primaryColor, color2: accentColor, imageSrc: '', overlayOpacity: 0.5},
			durationInFrames: 120,
		},
	});

	return {brand, scenes};
}
