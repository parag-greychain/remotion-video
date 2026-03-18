import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img} from 'remotion';
import type {CustomSceneConfig, BrandSettings, ContentBlock} from '../../lib/types';
import {SceneBackground, isDarkBg} from './SceneBackground';
import {RichTextRenderer} from './RichTextRenderer';

// ============================================================
// Block Renderers
// ============================================================

const BlockRenderer: React.FC<{block: ContentBlock; brand: BrandSettings; dark: boolean; delay: number}> = ({block, brand, dark, delay}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const entrance = spring({fps, frame: Math.max(0, frame - delay), config: {damping: 200}});
	const y = interpolate(entrance, [0, 1], [30, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const opacity = interpolate(entrance, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const textColor = dark ? '#f0f2f5' : '#1A1A2E';
	const mutedColor = dark ? '#a0a8b4' : '#4A5568';

	const content = (() => {
		switch (block.blockType) {
			case 'heading': {
				const sizes = {large: 64, medium: 44, small: 32};
				return (
					<div style={{fontSize: sizes[block.size], fontWeight: 800, color: textColor, fontFamily: 'system-ui, sans-serif', letterSpacing: -1, lineHeight: 1.2}}>
						{block.text}
					</div>
				);
			}
			case 'text':
				return <RichTextRenderer content={block.content} color={mutedColor} fontSize={22} />;
			case 'image':
				return block.src ? (
					<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
						<Img src={block.src} style={{maxWidth: '100%', maxHeight: 450, borderRadius: block.rounded ? 20 : 4, objectFit: 'contain', boxShadow: '0 12px 40px rgba(0,0,0,0.12)'}} />
						{block.caption && <span style={{fontSize: 15, color: mutedColor, fontFamily: 'system-ui, sans-serif'}}>{block.caption}</span>}
					</div>
				) : (
					<div style={{width: 300, height: 200, borderRadius: 16, background: `linear-gradient(135deg, ${brand.primaryColor}15, ${brand.accentColor}15)`, border: `2px dashed ${brand.primaryColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<span style={{fontSize: 40, opacity: 0.3}}>📷</span>
					</div>
				);
			case 'stat':
				return (
					<div style={{textAlign: 'center', padding: '20px 32px', background: dark ? '#0a0f1a' : '#ffffff', borderRadius: 20, border: `1px solid ${dark ? '#1c222b' : '#E8ECF2'}`, minWidth: 160}}>
						<div style={{fontSize: 48, fontWeight: 800, color: brand.primaryColor, fontFamily: 'system-ui, sans-serif'}}>{block.value}</div>
						<div style={{fontSize: 16, color: mutedColor, fontFamily: 'system-ui, sans-serif', marginTop: 4}}>{block.label}</div>
					</div>
				);
			case 'icon-text':
				return (
					<div style={{display: 'flex', gap: 16, alignItems: 'flex-start'}}>
						<div style={{width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${brand.primaryColor}, ${brand.accentColor})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0}}>
							{block.icon}
						</div>
						<div>
							<div style={{fontSize: 22, fontWeight: 700, color: textColor, fontFamily: 'system-ui, sans-serif', marginBottom: 4}}>{block.title}</div>
							<div style={{fontSize: 16, color: mutedColor, fontFamily: 'system-ui, sans-serif', lineHeight: 1.5}}>{block.description}</div>
						</div>
					</div>
				);
		}
	})();

	return (
		<div style={{transform: `translateY(${y}px)`, opacity}}>
			{content}
		</div>
	);
};

// ============================================================
// Layout Renderers
// ============================================================

const CenteredLayout: React.FC<{blocks: ContentBlock[]; brand: BrandSettings; dark: boolean}> = ({blocks, brand, dark}) => (
	<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 28, padding: '60px 200px'}}>
		{blocks.map((b, i) => <BlockRenderer key={i} block={b} brand={brand} dark={dark} delay={i * 8} />)}
	</AbsoluteFill>
);

const SplitLayout: React.FC<{blocks: ContentBlock[]; brand: BrandSettings; dark: boolean; imageRight: boolean}> = ({blocks, brand, dark, imageRight}) => {
	const imageBlocks = blocks.filter((b) => b.blockType === 'image');
	const otherBlocks = blocks.filter((b) => b.blockType !== 'image');

	const textSide = (
		<div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20, padding: '0 60px'}}>
			{otherBlocks.map((b, i) => <BlockRenderer key={i} block={b} brand={brand} dark={dark} delay={i * 8} />)}
		</div>
	);

	const imageSide = (
		<div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20, padding: '0 40px'}}>
			{imageBlocks.length > 0 ? (
				imageBlocks.map((b, i) => <BlockRenderer key={i} block={b} brand={brand} dark={dark} delay={(otherBlocks.length + i) * 8} />)
			) : (
				<div style={{width: 350, height: 300, borderRadius: 20, background: `linear-gradient(135deg, ${brand.primaryColor}10, ${brand.accentColor}10)`, border: `2px dashed ${brand.primaryColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<span style={{fontSize: 48, opacity: 0.2}}>🖼️</span>
				</div>
			)}
		</div>
	);

	return (
		<AbsoluteFill style={{display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '0 60px'}}>
			{imageRight ? <>{textSide}{imageSide}</> : <>{imageSide}{textSide}</>}
		</AbsoluteFill>
	);
};

const FullImageLayout: React.FC<{blocks: ContentBlock[]; brand: BrandSettings; dark: boolean}> = ({blocks, brand}) => (
	<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 24, padding: '60px 200px'}}>
		{blocks.map((b, i) => <BlockRenderer key={i} block={b} brand={brand} dark={true} delay={i * 8} />)}
	</AbsoluteFill>
);

const TwoColumnLayout: React.FC<{blocks: ContentBlock[]; brand: BrandSettings; dark: boolean}> = ({blocks, brand, dark}) => {
	const mid = Math.ceil(blocks.length / 2);
	const left = blocks.slice(0, mid);
	const right = blocks.slice(mid);

	return (
		<AbsoluteFill style={{display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '60px 100px', gap: 60}}>
			<div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 20}}>
				{left.map((b, i) => <BlockRenderer key={i} block={b} brand={brand} dark={dark} delay={i * 8} />)}
			</div>
			<div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 20}}>
				{right.map((b, i) => <BlockRenderer key={i} block={b} brand={brand} dark={dark} delay={(mid + i) * 8} />)}
			</div>
		</AbsoluteFill>
	);
};

const TitleGridLayout: React.FC<{blocks: ContentBlock[]; brand: BrandSettings; dark: boolean}> = ({blocks, brand, dark}) => {
	const headings = blocks.filter((b) => b.blockType === 'heading');
	const rest = blocks.filter((b) => b.blockType !== 'heading');

	return (
		<AbsoluteFill style={{flexDirection: 'column', alignItems: 'center', paddingTop: 80, padding: '80px 100px'}}>
			{/* Title area */}
			{headings.map((b, i) => <BlockRenderer key={i} block={b} brand={brand} dark={dark} delay={i * 6} />)}
			<div style={{height: 40}} />
			{/* Grid */}
			<div style={{display: 'flex', flexWrap: 'wrap', gap: 28, justifyContent: 'center', maxWidth: 1400}}>
				{rest.map((b, i) => (
					<div key={i} style={{minWidth: 200, maxWidth: 400, flex: '1 1 280px'}}>
						<BlockRenderer block={b} brand={brand} dark={dark} delay={(headings.length + i) * 8} />
					</div>
				))}
			</div>
		</AbsoluteFill>
	);
};

// ============================================================
// Main Custom Scene Component
// ============================================================

export const CustomScene: React.FC<{config: CustomSceneConfig; brand: BrandSettings}> = ({config, brand}) => {
	const dark = isDarkBg(config.background);

	const layoutComponent = (() => {
		switch (config.layout) {
			case 'centered':
				return <CenteredLayout blocks={config.blocks} brand={brand} dark={dark} />;
			case 'split-left':
				return <SplitLayout blocks={config.blocks} brand={brand} dark={dark} imageRight={true} />;
			case 'split-right':
				return <SplitLayout blocks={config.blocks} brand={brand} dark={dark} imageRight={false} />;
			case 'full-image':
				return <FullImageLayout blocks={config.blocks} brand={brand} dark={dark} />;
			case 'two-column':
				return <TwoColumnLayout blocks={config.blocks} brand={brand} dark={dark} />;
			case 'title-grid':
				return <TitleGridLayout blocks={config.blocks} brand={brand} dark={dark} />;
		}
	})();

	return (
		<AbsoluteFill>
			<SceneBackground bg={config.background} />
			{layoutComponent}
		</AbsoluteFill>
	);
};
