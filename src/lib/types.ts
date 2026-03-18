// ============================================================
// Weaved Video Studio V2 — Scene Data Model
// ============================================================

/** Global brand settings applied across all scenes */
export interface BrandSettings {
	brandName: string;
	logoSrc: string; // URL or empty string
	primaryColor: string;
	accentColor: string;
}

/** Background config shared by all scenes */
export interface BackgroundConfig {
	type: 'solid' | 'gradient' | 'image';
	/** Hex color for solid, or start color for gradient */
	color1: string;
	/** End color for gradient */
	color2: string;
	/** Image URL for image backgrounds */
	imageSrc: string;
	/** Overlay darkness 0-1 for image backgrounds */
	overlayOpacity: number;
}

// ============================================================
// Scene Configs — one interface per scene type
// ============================================================

export interface HeroSceneConfig {
	type: 'hero';
	headline: string;
	subtitle: string;
	background: BackgroundConfig;
	durationInFrames: number;
}

export interface ProblemSceneConfig {
	type: 'problem';
	headline: string;
	/** Tiptap JSON — supports paragraphs, bullet lists, bold, italic */
	bodyContent: any;
	background: BackgroundConfig;
	durationInFrames: number;
}

export interface SolutionSceneConfig {
	type: 'solution';
	productName: string;
	tagline: string;
	productImageSrc: string;
	background: BackgroundConfig;
	durationInFrames: number;
}

export interface FeatureSpotlightSceneConfig {
	type: 'feature-spotlight';
	title: string;
	/** Tiptap JSON rich text */
	descriptionContent: any;
	imageSrc: string;
	layout: 'image-left' | 'image-right';
	background: BackgroundConfig;
	durationInFrames: number;
}

export interface FeatureGridSceneConfig {
	type: 'feature-grid';
	headline: string;
	features: Array<{title: string; description: string}>;
	background: BackgroundConfig;
	durationInFrames: number;
}

export interface ImageTextSceneConfig {
	type: 'image-text';
	headline: string;
	/** Tiptap JSON rich text */
	bodyContent: any;
	imageSrc: string;
	layout: 'image-left' | 'image-right';
	background: BackgroundConfig;
	durationInFrames: number;
}

export interface StatsSceneConfig {
	type: 'stats';
	headline: string;
	stats: Array<{value: string; label: string}>;
	background: BackgroundConfig;
	durationInFrames: number;
}

export interface TestimonialSceneConfig {
	type: 'testimonial';
	/** Tiptap JSON rich text */
	quoteContent: any;
	personName: string;
	personRole: string;
	avatarSrc: string;
	starRating: number; // 1-5
	background: BackgroundConfig;
	durationInFrames: number;
}

export interface LogoWallSceneConfig {
	type: 'logo-wall';
	headline: string;
	logos: Array<{src: string; name: string}>;
	background: BackgroundConfig;
	durationInFrames: number;
}

export interface CtaSceneConfig {
	type: 'cta';
	headline: string;
	/** Tiptap JSON rich text */
	subtitleContent: any;
	buttonText: string;
	buttonUrl: string;
	background: BackgroundConfig;
	durationInFrames: number;
}

// ============================================================
// Custom Scene — user-created with layout presets + blocks
// ============================================================

export type CustomLayout = 'centered' | 'split-left' | 'split-right' | 'full-image' | 'two-column' | 'title-grid';

export type ContentBlockType = 'heading' | 'text' | 'image' | 'stat' | 'icon-text';

export interface HeadingBlock {
	blockType: 'heading';
	text: string;
	size: 'large' | 'medium' | 'small';
}

export interface TextBlock {
	blockType: 'text';
	/** Tiptap JSON rich text */
	content: any;
}

export interface ImageBlock {
	blockType: 'image';
	src: string;
	caption: string;
	rounded: boolean;
}

export interface StatBlock {
	blockType: 'stat';
	value: string;
	label: string;
}

export interface IconTextBlock {
	blockType: 'icon-text';
	icon: string;
	title: string;
	description: string;
}

export type ContentBlock = HeadingBlock | TextBlock | ImageBlock | StatBlock | IconTextBlock;

export interface CustomSceneConfig {
	type: 'custom';
	layout: CustomLayout;
	blocks: ContentBlock[];
	background: BackgroundConfig;
	durationInFrames: number;
}

/** Union of all scene configs */
export type SceneConfig =
	| HeroSceneConfig
	| ProblemSceneConfig
	| SolutionSceneConfig
	| FeatureSpotlightSceneConfig
	| FeatureGridSceneConfig
	| ImageTextSceneConfig
	| StatsSceneConfig
	| TestimonialSceneConfig
	| LogoWallSceneConfig
	| CtaSceneConfig
	| CustomSceneConfig;

/** A scene instance with unique ID */
export interface Scene {
	id: string;
	config: SceneConfig;
}

/** The full video project */
export interface VideoProject {
	brand: BrandSettings;
	scenes: Scene[];
}

// ============================================================
// Scene metadata — for the scene picker UI
// ============================================================

export interface SceneTypeMeta {
	type: SceneConfig['type'];
	name: string;
	description: string;
	icon: string;
}

export const SCENE_TYPES: SceneTypeMeta[] = [
	{type: 'hero', name: 'Hero / Intro', description: 'Logo, headline, and subtitle with branded background', icon: '🎬'},
	{type: 'problem', name: 'Problem Statement', description: 'Highlight pain points with bullet points', icon: '❓'},
	{type: 'solution', name: 'Solution Reveal', description: 'Introduce your product as the answer', icon: '💡'},
	{type: 'feature-spotlight', name: 'Feature Spotlight', description: 'One feature with image and description', icon: '🔦'},
	{type: 'feature-grid', name: 'Feature Grid', description: 'Multiple features in a grid layout', icon: '📊'},
	{type: 'image-text', name: 'Image + Text', description: 'Side-by-side image and text layout', icon: '🖼️'},
	{type: 'stats', name: 'Stats / Metrics', description: 'Animated numbers and achievements', icon: '📈'},
	{type: 'testimonial', name: 'Testimonial', description: 'Customer quote with avatar and rating', icon: '💬'},
	{type: 'logo-wall', name: 'Logo Wall', description: 'Showcase client or partner logos', icon: '🏢'},
	{type: 'cta', name: 'Call to Action', description: 'Closing with CTA button and URL', icon: '🚀'},
	{type: 'custom', name: 'Custom Scene', description: 'Build your own scene with layout presets and content blocks', icon: '✨'},
];

// ============================================================
// Default configs — used when adding a new scene
// ============================================================

const defaultBg: BackgroundConfig = {
	type: 'solid',
	color1: '#ffffff',
	color2: '#16BAFF',
	imageSrc: '',
	overlayOpacity: 0.5,
};

const darkBg: BackgroundConfig = {
	type: 'solid',
	color1: '#020204',
	color2: '#1F6BFF',
	imageSrc: '',
	overlayOpacity: 0.5,
};

const gradientBg: BackgroundConfig = {
	type: 'gradient',
	color1: '#1F6BFF',
	color2: '#16BAFF',
	imageSrc: '',
	overlayOpacity: 0.5,
};

export function createDefaultScene(type: SceneConfig['type']): SceneConfig {
	switch (type) {
		case 'hero':
			return {type: 'hero', headline: 'Your Product Name', subtitle: 'The tagline that captures your vision', background: {...defaultBg}, durationInFrames: 120};
		case 'problem':
			return {type: 'problem', headline: 'The Problem', bodyContent: {type: 'doc', content: [{type: 'paragraph', content: [{type: 'text', text: 'Your audience faces real challenges every day.'}]}, {type: 'bulletList', content: [{type: 'listItem', content: [{type: 'paragraph', content: [{type: 'text', text: 'Pain point one'}]}]}, {type: 'listItem', content: [{type: 'paragraph', content: [{type: 'text', text: 'Pain point two'}]}]}, {type: 'listItem', content: [{type: 'paragraph', content: [{type: 'text', text: 'Pain point three'}]}]}]}]}, background: {...darkBg}, durationInFrames: 150};
		case 'solution':
			return {type: 'solution', productName: 'Your Product', tagline: 'The smarter way to get things done', productImageSrc: '', background: {...defaultBg}, durationInFrames: 120};
		case 'feature-spotlight':
			return {type: 'feature-spotlight', title: 'Key Feature', descriptionContent: {type: 'doc', content: [{type: 'paragraph', content: [{type: 'text', text: 'Describe what makes this feature '}, {type: 'text', marks: [{type: 'bold'}], text: 'special'}, {type: 'text', text: ' and how it helps your users.'}]}]}, imageSrc: '', layout: 'image-left', background: {...defaultBg}, durationInFrames: 120};
		case 'feature-grid':
			return {type: 'feature-grid', headline: 'Why Choose Us', features: [{title: 'Feature 1', description: 'Description'}, {title: 'Feature 2', description: 'Description'}, {title: 'Feature 3', description: 'Description'}], background: {type: 'solid', color1: '#F7F9FC', color2: '#16BAFF', imageSrc: '', overlayOpacity: 0.5}, durationInFrames: 150};
		case 'image-text':
			return {type: 'image-text', headline: 'How It Works', bodyContent: {type: 'doc', content: [{type: 'paragraph', content: [{type: 'text', text: 'Walk your audience through the key workflow or process step by step.'}]}, {type: 'bulletList', content: [{type: 'listItem', content: [{type: 'paragraph', content: [{type: 'text', text: 'Step one — describe the first action'}]}]}, {type: 'listItem', content: [{type: 'paragraph', content: [{type: 'text', text: 'Step two — explain the next step'}]}]}, {type: 'listItem', content: [{type: 'paragraph', content: [{type: 'text', text: 'Step three — show the result'}]}]}]}]}, imageSrc: '', layout: 'image-left', background: {...defaultBg}, durationInFrames: 120};
		case 'stats':
			return {type: 'stats', headline: 'By The Numbers', stats: [{value: '10x', label: 'Faster'}, {value: '99%', label: 'Uptime'}, {value: '50K+', label: 'Users'}], background: {...darkBg}, durationInFrames: 120};
		case 'testimonial':
			return {type: 'testimonial', quoteContent: {type: 'doc', content: [{type: 'paragraph', content: [{type: 'text', text: 'This product completely transformed how our team works. '}, {type: 'text', marks: [{type: 'bold'}], text: 'Highly recommended!'}]}]}, personName: 'Jane Smith', personRole: 'CEO, Acme Corp', avatarSrc: '', starRating: 5, background: {...darkBg}, durationInFrames: 120};
		case 'logo-wall':
			return {type: 'logo-wall', headline: 'Trusted By Industry Leaders', logos: [], background: {...defaultBg}, durationInFrames: 90};
		case 'cta':
			return {type: 'cta', headline: 'Ready to Get Started?', subtitleContent: {type: 'doc', content: [{type: 'paragraph', content: [{type: 'text', text: 'Join thousands of teams already using our platform.'}]}]}, buttonText: 'Start Free Trial', buttonUrl: 'yoursite.com', background: {...gradientBg}, durationInFrames: 120};
		case 'custom':
			return {type: 'custom', layout: 'centered', blocks: [{blockType: 'heading', text: 'Your Title Here', size: 'large'}, {blockType: 'text', content: {type: 'doc', content: [{type: 'paragraph', content: [{type: 'text', text: 'Add your content here. Use the toolbar to format text, add lists, and more.'}]}]}}], background: {...defaultBg}, durationInFrames: 120};
	}
}

/** Layout preset metadata for the picker UI */
export interface LayoutMeta {
	id: CustomLayout;
	name: string;
	description: string;
	icon: string;
}

export const LAYOUT_PRESETS: LayoutMeta[] = [
	{id: 'centered', name: 'Centered', description: 'Content stacked in the center', icon: '⬜'},
	{id: 'split-left', name: 'Split Left', description: 'Content left, media right', icon: '◧'},
	{id: 'split-right', name: 'Split Right', description: 'Media left, content right', icon: '◨'},
	{id: 'full-image', name: 'Full Image', description: 'Background image with text overlay', icon: '🖼'},
	{id: 'two-column', name: 'Two Column', description: 'Two equal content columns', icon: '▥'},
	{id: 'title-grid', name: 'Title + Grid', description: 'Title on top, grid of items below', icon: '▦'},
];

/** Block type metadata for the block picker */
export const BLOCK_TYPES: Array<{type: ContentBlockType; name: string; icon: string}> = [
	{type: 'heading', name: 'Heading', icon: 'H'},
	{type: 'text', name: 'Rich Text', icon: '¶'},
	{type: 'image', name: 'Image', icon: '📷'},
	{type: 'stat', name: 'Stat / Number', icon: '#'},
	{type: 'icon-text', name: 'Icon + Text', icon: '★'},
];

export function createDefaultProject(): VideoProject {
	return {
		brand: {
			brandName: 'Weaved',
			logoSrc: '',
			primaryColor: '#1F6BFF',
			accentColor: '#16BAFF',
		},
		scenes: [
			{id: 'scene-1', config: createDefaultScene('hero')},
			{id: 'scene-2', config: createDefaultScene('problem')},
			{id: 'scene-3', config: createDefaultScene('solution')},
			{id: 'scene-4', config: createDefaultScene('feature-grid')},
			{id: 'scene-5', config: createDefaultScene('cta')},
		],
	};
}
