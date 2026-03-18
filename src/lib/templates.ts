import {z} from 'zod';

const featureSchema = z.object({
	title: z.string(),
	description: z.string(),
});

export type Feature = z.infer<typeof featureSchema>;

// Template definitions — each template has an id, metadata, and Zod schema for props
export const templates = {
	'product-demo': {
		id: 'product-demo',
		name: 'Product Demo',
		description: 'Showcase your product with animated scenes, features, and a call-to-action.',
		thumbnail: '🚀',
		durationInFrames: 450,
		fps: 30,
		width: 1920,
		height: 1080,
		schema: z.object({
			brandName: z.string().default('Weaved'),
			tagline: z.string().default('AI Agents for the Connected Enterprise'),
			subtitle: z.string().default('Your AI-powered assistant for enhanced productivity and seamless task management.'),
			features: z.array(featureSchema).default([
				{title: 'Full Deployment', description: 'Deploy on your private cloud — AWS, Azure, GCP, or on-premise.'},
				{title: 'Open Source Access', description: 'Full source code access with CI/CD integration.'},
				{title: 'AI Agent Platform', description: 'Build and manage intelligent AI agents for your workflows.'},
			]),
			ctaText: z.string().default('Get Started'),
			ctaUrl: z.string().default('weaved.one'),
			primaryColor: z.string().default('#1F6BFF'),
			accentColor: z.string().default('#16BAFF'),
		}),
	},
	'team-intro': {
		id: 'team-intro',
		name: 'Team Intro',
		description: 'Introduce a team member with their role, experience, and achievements.',
		thumbnail: '👤',
		durationInFrames: 360,
		fps: 30,
		width: 1920,
		height: 1080,
		schema: z.object({
			personName: z.string().default('John Doe'),
			role: z.string().default('Frontend Developer & Team Lead'),
			bio: z.string().default('4+ years engineering scalable web applications and leading development teams.'),
			achievement1: z.string().default('20% Performance Boost'),
			achievement2: z.string().default('6 Production Projects'),
			achievement3: z.string().default('3 AI Platforms Built'),
			achievement4: z.string().default('Team Leadership'),
			contactEmail: z.string().default('hello@example.com'),
			contactLocation: z.string().default('City, Country'),
			primaryColor: z.string().default('#00c2ed'),
			accentColor: z.string().default('#783ff5'),
		}),
	},
	announcement: {
		id: 'announcement',
		name: 'Announcement',
		description: 'Make a bold announcement with eye-catching animations.',
		thumbnail: '📢',
		durationInFrames: 300,
		fps: 30,
		width: 1920,
		height: 1080,
		schema: z.object({
			headline: z.string().default('Big Announcement'),
			subheadline: z.string().default('We have exciting news to share with you.'),
			body: z.string().default('After months of hard work, we are thrilled to announce our latest product update that will transform how you work.'),
			ctaText: z.string().default('Learn More'),
			ctaUrl: z.string().default('weaved.one'),
			primaryColor: z.string().default('#1F6BFF'),
			accentColor: z.string().default('#16BAFF'),
		}),
	},
} as const;

export type TemplateId = keyof typeof templates;

export function getTemplate(id: string) {
	return templates[id as TemplateId] || null;
}

export function getTemplateList() {
	return Object.values(templates);
}

export function getDefaultProps(id: string): Record<string, unknown> {
	const template = getTemplate(id);
	if (!template) return {};
	const result = template.schema.safeParse({});
	if (result.success) return result.data as Record<string, unknown>;
	return {};
}
