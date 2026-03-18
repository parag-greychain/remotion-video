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

const ExperienceCard: React.FC<{
	role: string;
	company: string;
	period: string;
	description: string;
	delay: number;
	isActive?: boolean;
}> = ({role, company, period, description, delay, isActive}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({
		fps,
		frame: Math.max(0, frame - delay),
		config: {damping: 200},
	});

	const x = interpolate(entrance, [0, 1], [-80, 0], {
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
				transform: `translateX(${x}px)`,
				opacity,
				display: 'flex',
				gap: 24,
				marginBottom: 30,
			}}
		>
			{/* Timeline dot + line */}
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					paddingTop: 8,
				}}
			>
				<div
					style={{
						width: 16,
						height: 16,
						borderRadius: '50%',
						background: isActive ? pTheme.gradient : pTheme.border,
						boxShadow: isActive
							? `0 0 20px ${pTheme.primary}60`
							: 'none',
					}}
				/>
				<div
					style={{
						width: 2,
						flex: 1,
						background: pTheme.border,
						marginTop: 8,
					}}
				/>
			</div>

			{/* Content */}
			<div
				style={{
					background: pTheme.card,
					border: `1px solid ${isActive ? pTheme.primary + '30' : pTheme.border}`,
					borderRadius: 16,
					padding: 32,
					flex: 1,
				}}
			>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginBottom: 8,
					}}
				>
					<span
						style={{
							fontSize: 26,
							fontWeight: 700,
							color: pTheme.foreground,
							fontFamily: pTheme.fontFamily,
						}}
					>
						{role}
					</span>
					<span
						style={{
							fontSize: 15,
							color: pTheme.primary,
							fontFamily: pTheme.fontFamily,
							fontWeight: 500,
						}}
					>
						{period}
					</span>
				</div>
				<div
					style={{
						fontSize: 18,
						color: pTheme.accent,
						fontFamily: pTheme.fontFamily,
						fontWeight: 600,
						marginBottom: 10,
					}}
				>
					{company}
				</div>
				<div
					style={{
						fontSize: 17,
						color: pTheme.mutedText,
						fontFamily: pTheme.fontFamily,
						lineHeight: 1.5,
					}}
				>
					{description}
				</div>
			</div>
		</div>
	);
};

export const ExperienceScene: React.FC = () => {
	return (
		<AbsoluteFill style={{background: pTheme.bg}}>
			<AbsoluteFill
				style={{
					paddingLeft: 200,
					paddingRight: 200,
					paddingTop: 80,
					flexDirection: 'column',
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
					Career
				</AnimatedText>
				<AnimatedText
					delay={4}
					style={{
						fontSize: 48,
						fontWeight: 700,
						color: pTheme.foreground,
						fontFamily: pTheme.fontFamily,
						marginBottom: 40,
					}}
				>
					Where I've Worked
				</AnimatedText>

				<ExperienceCard
					role="Team Lead"
					company="Greychain"
					period="Jul 2023 — Present"
					description="Led a team to build scalable React.js applications with integrated AI functionalities."
					delay={10}
					isActive
				/>
				<ExperienceCard
					role="Frontend Developer"
					company="Albiorix Technology"
					period="Jun 2022 — Jul 2023"
					description="Built production-ready web applications with React.js and modern frontend tooling."
					delay={20}
				/>
				<ExperienceCard
					role="Frontend Developer"
					company="Search Result Media"
					period="Jan 2020 — Jun 2022"
					description="Developed responsive web solutions and established frontend best practices."
					delay={30}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
