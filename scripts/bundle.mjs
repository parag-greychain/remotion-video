import {bundle} from '@remotion/bundler';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
	console.log('Bundling Remotion compositions...');
	const bundleLocation = await bundle({
		entryPoint: path.resolve(__dirname, '../src/remotion/index.ts'),
		outDir: path.resolve(__dirname, '../.remotion-bundle'),
	});
	console.log('Bundle created at:', bundleLocation);
}

main().catch(console.error);
