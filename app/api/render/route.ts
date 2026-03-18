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

/**
 * Convert all relative /uploads/ paths in props to absolute HTTP URLs
 * so the Remotion renderer (headless Chrome) can fetch them from the running Next.js server.
 */
function resolveUploadUrls(obj: any, baseUrl: string): any {
	if (typeof obj === 'string') {
		if (obj.startsWith('/uploads/')) {
			return `${baseUrl}${obj}`;
		}
		return obj;
	}
	if (Array.isArray(obj)) {
		return obj.map(item => resolveUploadUrls(item, baseUrl));
	}
	if (obj && typeof obj === 'object') {
		const result: any = {};
		for (const [key, value] of Object.entries(obj)) {
			result[key] = resolveUploadUrls(value, baseUrl);
		}
		return result;
	}
	return obj;
}

export async function POST(request: NextRequest) {
	try {
		const {templateId, props, format = 'mp4'} = await request.json();

		if (!templateId) {
			return NextResponse.json({error: 'Missing templateId'}, {status: 400});
		}

		console.log(`[render] Starting render for template: ${templateId}, format: ${format}`);

		const serveUrl = await getBundleLocation();

		// Resolve all /uploads/ paths to absolute HTTP URLs so Remotion's headless Chrome can access them
		const baseUrl = `http://localhost:${process.env.PORT || 3001}`;
		const inputProps = resolveUploadUrls(props || {}, baseUrl);

		console.log('[render] Resolved upload URLs with base:', baseUrl);

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

		// Format-specific settings
		const formatConfig = {
			mp4:  {codec: 'h264' as const,  ext: 'mp4',  mime: 'video/mp4'},
			webm: {codec: 'vp8' as const,   ext: 'webm', mime: 'video/webm'},
			gif:  {codec: 'gif' as const,   ext: 'gif',  mime: 'image/gif'},
		};
		const fmt = formatConfig[format as keyof typeof formatConfig] || formatConfig.mp4;

		// GIF: limit to 10 seconds and lower resolution
		if (format === 'gif') {
			composition.durationInFrames = Math.min(composition.durationInFrames, 300);
		}

		const outputPath = path.join(os.tmpdir(), `weaved-${templateId}-${Date.now()}.${fmt.ext}`);

		await renderMedia({
			composition,
			serveUrl,
			codec: fmt.codec,
			outputLocation: outputPath,
			inputProps,
			...(format === 'gif' ? {scale: 0.5} : {}),
		});

		console.log(`[render] Render complete: ${outputPath}`);

		const file = fs.readFileSync(outputPath);
		fs.unlinkSync(outputPath);

		return new NextResponse(file, {
			headers: {
				'Content-Type': fmt.mime,
				'Content-Disposition': `attachment; filename="${templateId}-video.${fmt.ext}"`,
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
