import {NextRequest, NextResponse} from 'next/server';
import path from 'path';
import fs from 'fs';
import https from 'https';

function httpsRequest(options: https.RequestOptions, body?: string): Promise<{status: number; data: string}> {
	return new Promise((resolve, reject) => {
		const req = https.request(options, (res) => {
			let data = '';
			res.on('data', (c) => { data += c; });
			res.on('end', () => resolve({status: res.statusCode || 0, data}));
		});
		req.on('error', reject);
		if (body) req.write(body);
		req.end();
	});
}

function httpsGet(url: string): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		const get = (u: string) => {
			https.get(u, (res) => {
				if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
					return get(res.headers.location);
				}
				const chunks: Buffer[] = [];
				res.on('data', (c) => chunks.push(c));
				res.on('end', () => resolve(Buffer.concat(chunks)));
			}).on('error', reject);
		};
		get(url);
	});
}

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

export const VOICES = [
	{id: 'Aria', name: 'Aria', gender: 'Female'},
	{id: 'Roger', name: 'Roger', gender: 'Male'},
	{id: 'Sarah', name: 'Sarah', gender: 'Female'},
	{id: 'Laura', name: 'Laura', gender: 'Female'},
	{id: 'Charlie', name: 'Charlie', gender: 'Male'},
	{id: 'George', name: 'George', gender: 'Male'},
	{id: 'Callum', name: 'Callum', gender: 'Male'},
	{id: 'River', name: 'River', gender: 'Non-binary'},
	{id: 'Liam', name: 'Liam', gender: 'Male'},
	{id: 'Charlotte', name: 'Charlotte', gender: 'Female'},
	{id: 'Alice', name: 'Alice', gender: 'Female'},
	{id: 'Matilda', name: 'Matilda', gender: 'Female'},
	{id: 'Will', name: 'Will', gender: 'Male'},
	{id: 'Jessica', name: 'Jessica', gender: 'Female'},
	{id: 'Eric', name: 'Eric', gender: 'Male'},
	{id: 'Chris', name: 'Chris', gender: 'Male'},
	{id: 'Brian', name: 'Brian', gender: 'Male'},
	{id: 'Daniel', name: 'Daniel', gender: 'Male'},
	{id: 'Lily', name: 'Lily', gender: 'Female'},
	{id: 'Bill', name: 'Bill', gender: 'Male'},
];

export async function POST(request: NextRequest) {
	try {
		const {text, voiceId, apiKey} = await request.json();

		if (!text || !apiKey) {
			return NextResponse.json({error: 'Missing text or API key'}, {status: 400});
		}

		console.log(`[voiceover] Generating TTS: ${text.length} chars, voice: ${voiceId || 'Daniel'}`);

		const body = JSON.stringify({
			text,
			voice_id: voiceId || 'Daniel',
			similarity: 1,
			stability: 0.55,
			use_speaker_boost: true,
		});

		// Submit TTS request
		const res = await httpsRequest({
			hostname: 'api.wavespeed.ai',
			path: '/api/v3/elevenlabs/eleven-v3',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${apiKey}`,
			},
		}, body);

		const json = JSON.parse(res.data);

		if (!json.data?.id) {
			return NextResponse.json({error: json.message || 'TTS API error'}, {status: 500});
		}

		const taskId = json.data.id;

		// Check if already completed
		let audioUrl = null;
		if (json.data.status === 'completed' && json.data.outputs?.length) {
			audioUrl = json.data.outputs[0];
		} else {
			// Poll for result
			for (let i = 0; i < 40; i++) {
				await sleep(2000);
				const poll = await httpsRequest({
					hostname: 'api.wavespeed.ai',
					path: `/api/v3/predictions/${taskId}/result`,
					method: 'GET',
					headers: {'Authorization': `Bearer ${apiKey}`},
				});
				const p = JSON.parse(poll.data);
				if (p.data?.status === 'completed' && p.data?.outputs?.length) {
					audioUrl = p.data.outputs[0];
					break;
				}
				if (p.data?.status === 'failed') {
					return NextResponse.json({error: 'TTS generation failed'}, {status: 500});
				}
			}
		}

		if (!audioUrl) {
			return NextResponse.json({error: 'TTS timed out'}, {status: 504});
		}

		// Download and save audio
		const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
		if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, {recursive: true});

		const filename = `voiceover-${Date.now()}.mp3`;
		const audioData = await httpsGet(audioUrl);
		fs.writeFileSync(path.join(uploadsDir, filename), audioData);

		console.log(`[voiceover] Done: ${filename} (${audioData.length} bytes)`);

		return NextResponse.json({
			audioUrl: `/uploads/${filename}`,
			size: audioData.length,
		});
	} catch (error: any) {
		console.error('[voiceover] Error:', error);
		return NextResponse.json({error: error.message || 'Voiceover failed'}, {status: 500});
	}
}
