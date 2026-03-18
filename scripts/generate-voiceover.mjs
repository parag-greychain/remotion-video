import fs from 'fs';
import path from 'path';
import https from 'https';

const API_KEY = process.argv[2];
if (!API_KEY) {
	console.error('Usage: node generate-voiceover.mjs <API_KEY>');
	process.exit(1);
}

const SCRIPT = `Weaved. AI Agents for the Connected Enterprise.

Traditional AI tools lock you into black-box systems. Limited APIs. No data sovereignty. No customization. No source code access.

Weaved changes everything. Full deployment on your private cloud — AWS, Azure, GCP, or on-premise. Complete source code access with CI/CD integration. And a powerful AI agent platform tailored to your business workflows.

Deploy anywhere. Own everything. Enterprise AI that's truly yours.

Get started today at weaved dot one.`;

console.log('Voiceover script:');
console.log('---');
console.log(SCRIPT);
console.log('---');
console.log(`Character count: ${SCRIPT.length}`);
console.log('');
console.log('Generating audio with WaveSpeed ElevenLabs v3...');

const body = JSON.stringify({
	text: SCRIPT,
	voice_id: 'Daniel',
	similarity: 1,
	stability: 0.55,
	use_speaker_boost: true,
});

const options = {
	hostname: 'api.wavespeed.ai',
	path: '/api/v3/elevenlabs/eleven-v3',
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${API_KEY}`,
	},
};

function httpsRequest(options, body) {
	return new Promise((resolve, reject) => {
		const req = https.request(options, (res) => {
			let data = '';
			res.on('data', (chunk) => { data += chunk; });
			res.on('end', () => resolve({ status: res.statusCode, data }));
		});
		req.on('error', reject);
		if (body) req.write(body);
		req.end();
	});
}

function httpsGet(url) {
	return new Promise((resolve, reject) => {
		https.get(url, (res) => {
			if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
				return httpsGet(res.headers.location).then(resolve).catch(reject);
			}
			let data = [];
			res.on('data', (chunk) => data.push(chunk));
			res.on('end', () => resolve({ status: res.statusCode, data: Buffer.concat(data) }));
		}).on('error', reject);
	});
}

function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

async function main() {
	// Step 1: Submit TTS request
	const res = await httpsRequest(options, body);
	console.log('API Response status:', res.status);

	const json = JSON.parse(res.data);
	console.log('Response:', JSON.stringify(json, null, 2));

	if (json.code !== 200 && !json.data?.id) {
		console.error('API error:', json);
		process.exit(1);
	}

	const taskId = json.data.id;
	console.log('Task ID:', taskId);

	// Step 2: Poll for result
	let audioUrl = null;
	if (json.data.status === 'completed' && json.data.outputs?.length) {
		audioUrl = json.data.outputs[0];
	} else {
		console.log('Polling for result...');
		for (let i = 0; i < 30; i++) {
			await sleep(2000);
			const pollRes = await httpsRequest({
				hostname: 'api.wavespeed.ai',
				path: `/api/v3/predictions/${taskId}/result`,
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${API_KEY}`,
				},
			});
			const pollJson = JSON.parse(pollRes.data);
			console.log(`Poll ${i + 1}: status=${pollJson.data?.status}`);

			if (pollJson.data?.status === 'completed' && pollJson.data?.outputs?.length) {
				audioUrl = pollJson.data.outputs[0];
				break;
			}
			if (pollJson.data?.status === 'failed') {
				console.error('Task failed:', pollJson);
				process.exit(1);
			}
		}
	}

	if (!audioUrl) {
		console.error('Timed out waiting for audio');
		process.exit(1);
	}

	console.log('Audio URL:', audioUrl);

	// Step 3: Download the audio file
	const outputDir = path.join(process.cwd(), 'public', 'assets');
	const outputPath = path.join(outputDir, 'voiceover.mp3');

	console.log('Downloading audio...');
	const audioRes = await httpsGet(audioUrl);
	fs.writeFileSync(outputPath, audioRes.data);
	console.log(`Saved to: ${outputPath} (${audioRes.data.length} bytes)`);
}

main().catch((err) => {
	console.error('Error:', err);
	process.exit(1);
});
