import React from 'react';
import {
	AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	spring,
	interpolate,
} from 'remotion';
import {pTheme} from './theme';
import {AnimatedText} from './AnimatedText';

const ProjectCard: React.FC<{
	title: string;
	client: string;
	delay: number;
	accentColor: string;
}> = ({title, client, delay, accentColor}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({
		fps,
		frame: Math.max(0, frame - delay),
		config: {damping: 200},
	});

	const y = interpolate(entrance, [0, 1], [60, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const opacity = interpolate(entrance, [0, 1], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				transform: `translateY(${y}px)`,
				opacity,
				background: pTheme.card,
				border: `1px solid ${pTheme.border}`,
				borderRadius: 20,
				padding: 32,
				width: 280,
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			{/* Top accent bar */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: 3,
					background: accentColor,
				}}
			/>
			<div
				style={{
					fontSize: 14,
					fontWeight: 600,
					color: accentColor,
					fontFamily: pTheme.fontFamily,
					letterSpacing: 2,
					textTransform: 'uppercase',
					marginBottom: 12,
				}}
			>
				{client}
			</div>
			<div
				style={{
					fontSize: 22,
					fontWeight: 700,
					color: pTheme.foreground,
					fontFamily: pTheme.fontFamily,
					lineHeight: 1.3,
				}}
			>
				{title}
			</div>
		</div>
	);
};

export const ProjectsScene: React.FC = () => {
	return (
		<AbsoluteFill style={{background: pTheme.bg}}>
			<AbsoluteFill
				style={{
					flexDirection: 'column',
					alignItems: 'center',
					paddingTop: 80,
				}}
			>
				<AnimatedText
					delay={0}
					style={{
						fontSize: 20,
						fontWeight: 600,
						color: pTheme.primary,
						fontFamily: pTheme.fontFamily,
						letterSpacing: 4,
						textTransform: 'uppercase',
						marginBottom: 8,
					}}
				>
					Portfolio
				</AnimatedText>
				<AnimatedText
					delay={4}
					style={{
						fontSize: 48,
						fontWeight: 700,
						color: pTheme.foreground,
						fontFamily: pTheme.fontFamily,
						marginBottom: 50,
					}}
				>
					Production Projects
				</AnimatedText>

				{/* Row 1 */}
				<div style={{display: 'flex', gap: 30, marginBottom: 30}}>
					<ProjectCard
						title="AI — Proposal Accelerator"
						client="Accenture"
						delay={10}
						accentColor={pTheme.primary}
					/>
					<ProjectCard
						title="AI — Knowledge Management"
						client="Accenture"
						delay={16}
						accentColor={pTheme.accent}
					/>
					<ProjectCard
						title="AI — SurveyOps"
						client="BCG"
						delay={22}
						accentColor={pTheme.emerald}
					/>
				</div>

				{/* Row 2 */}
				<div style={{display: 'flex', gap: 30}}>
					<ProjectCard
						title="WOW Health Express"
						client="Healthcare"
						delay={28}
						accentColor={pTheme.accent}
					/>
					<ProjectCard
						title="FLUUS"
						client="Fintech"
						delay={34}
						accentColor={pTheme.primary}
					/>
					<ProjectCard
						title="X CARE"
						client="Healthcare"
						delay={40}
						accentColor={pTheme.emerald}
					/>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
