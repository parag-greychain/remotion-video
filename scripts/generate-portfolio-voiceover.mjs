import fs from 'fs';
import path from 'path';
import https from 'https';

const API_KEY = process.argv[2];
if (!API_KEY) {
	console.error('Usage: node generate-portfolio-voiceover.mjs <API_KEY>');
	process.exit(1);
}

const SCRIPT = `Parag Baldaniya. Frontend Developer and Team Lead.

With over four years of experience engineering scalable web applications, leading development teams, and integrating AI functionalities.

From Search Result Media to Albiorix Technology, and now leading a team at Greychain — building production-ready React applications with cutting-edge AI integration.

The impact speaks for itself. A twenty percent performance boost. Three AI platforms built. Six production projects delivered across Accenture, BCG, healthcare, and fintech.

From AI Proposal Accelerators to real-time health platforms — every project built with code quality, team leadership, and full-stack delivery in mind.

Let's build something great together. Get in touch today.`;

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
				headers: { 'Authorization': `Bearer ${API_KEY}` },
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

	const outputPath = path.join(process.cwd(), 'public', 'assets', 'portfolio-voiceover.mp3');
	console.log('Downloading audio...');
	const audioRes = await httpsGet(audioUrl);
	fs.writeFileSync(outputPath, audioRes.data);
	console.log(`Saved to: ${outputPath} (${audioRes.data.length} bytes)`);
}

main().catch((err) => {
	console.error('Error:', err);
	process.exit(1);
});
