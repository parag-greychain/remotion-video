import {Composition} from 'remotion';
import {MyComp} from './MyComp';
import {PortfolioVideo} from './portfolio/PortfolioVideo';

export const Root: React.FC = () => {
	return (
		<>
			<Composition
				id="MyComp"
				component={MyComp}
				durationInFrames={1410}
				width={1920}
				height={1080}
				fps={30}
				defaultProps={{}}
			/>
			<Composition
				id="PortfolioVideo"
				component={PortfolioVideo}
				durationInFrames={1760}
				width={1920}
				height={1080}
				fps={30}
				defaultProps={{}}
			/>
		</>
	);
};
