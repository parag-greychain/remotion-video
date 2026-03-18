import {Composition} from 'remotion';
import {DynamicComposition, calculateTotalDuration} from '../templates/DynamicComposition';
import {createDefaultProject} from '../lib/types';
import {ProductDemo} from '../templates/ProductDemo';
import {TeamIntro} from '../templates/TeamIntro';
import {Announcement} from '../templates/Announcement';
import {MarketingVideo, MARKETING_DURATION} from '../templates/marketing/MarketingVideo';
import {getDefaultProps} from '../lib/templates';

const defaultProject = createDefaultProject();

export const RemotionRoot: React.FC = () => {
	return (
		<>
			{/* Marketing Video */}
			<Composition
				id="marketing"
				component={MarketingVideo as any}
				durationInFrames={MARKETING_DURATION}
				width={1920}
				height={1080}
				fps={30}
				defaultProps={{}}
			/>
			{/* V2: Dynamic scene-based composition */}
			<Composition
				id="product-demo-v2"
				component={DynamicComposition as any}
				durationInFrames={calculateTotalDuration(defaultProject.scenes)}
				width={1920}
				height={1080}
				fps={30}
				defaultProps={{
					brand: defaultProject.brand,
					scenes: defaultProject.scenes,
				}}
			/>
			{/* V1: Legacy templates */}
			<Composition
				id="product-demo"
				component={ProductDemo as any}
				durationInFrames={450}
				width={1920}
				height={1080}
				fps={30}
				defaultProps={getDefaultProps('product-demo')}
			/>
			<Composition
				id="team-intro"
				component={TeamIntro as any}
				durationInFrames={360}
				width={1920}
				height={1080}
				fps={30}
				defaultProps={getDefaultProps('team-intro')}
			/>
			<Composition
				id="announcement"
				component={Announcement as any}
				durationInFrames={300}
				width={1920}
				height={1080}
				fps={30}
				defaultProps={getDefaultProps('announcement')}
			/>
		</>
	);
};
