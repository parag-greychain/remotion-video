import {NextRequest, NextResponse} from 'next/server';
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
import os from 'os';

let bundleLocation: string | null = null;

async function getBundleLocation() {
	if (bundleLocation && fs.existsSync(bundleLocation)) {
		return bundleLocation;
	}

	console.log('[render] Bundling Remotion compositions...');
	bundleLocation = await bundle({
		entryPoint: path.resolve(process.cwd(), 'src/remotion/index.ts'),
	});
	console.log('[render] Bundle ready at:', bundleLocation);
	return bundleLocation;
}

export async function POST(request: NextRequest) {
	try {
		const {templateId, props} = await request.json();

		if (!templateId) {
			return NextResponse.json({error: 'Missing templateId'}, {status: 400});
		}

		console.log(`[render] Starting render for template: ${templateId}`);

		const serveUrl = await getBundleLocation();

		const inputProps = props || {};

		const composition = await selectComposition({
			serveUrl,
			id: templateId,
			inputProps,
		});

		// For V2 dynamic compositions, recalculate duration from scenes
		if (templateId === 'product-demo-v2' && inputProps.scenes) {
			const scenes = inputProps.scenes as Array<{config: {durationInFrames: number}}>;
			const sceneDuration = scenes.reduce((sum: number, s: any) => sum + s.config.durationInFrames, 0);
			const transitionDuration = Math.max(0, scenes.length - 1) * 15;
			composition.durationInFrames = Math.max(30, sceneDuration - transitionDuration);
		}

		const outputPath = path.join(os.tmpdir(), `weaved-${templateId}-${Date.now()}.mp4`);

		await renderMedia({
			composition,
			serveUrl,
			codec: 'h264',
			outputLocation: outputPath,
			inputProps: props || {},
		});

		console.log(`[render] Render complete: ${outputPath}`);

		const file = fs.readFileSync(outputPath);

		// Clean up temp file
		fs.unlinkSync(outputPath);

		return new NextResponse(file, {
			headers: {
				'Content-Type': 'video/mp4',
				'Content-Disposition': `attachment; filename="${templateId}-video.mp4"`,
			},
		});
	} catch (error: any) {
		console.error('[render] Error:', error);
		return NextResponse.json(
			{error: error.message || 'Render failed'},
			{status: 500},
		);
	}
}
