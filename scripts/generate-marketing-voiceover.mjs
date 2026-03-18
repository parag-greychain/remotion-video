import fs from 'fs';
import path from 'path';
import https from 'https';

const API_KEY = process.argv[2];
if (!API_KEY) { console.error('Usage: node generate-marketing-voiceover.mjs <API_KEY>'); process.exit(1); }

// Script synced to 8 scenes (~38 seconds)
const SCRIPT = `Weaved Video Studio. Create professional videos in minutes. No designers. No video editors. No code. Just results.

Let's be honest. Creating videos is painful. Hiring designers costs thousands per video. Video editors take weeks to deliver. Complex tools have steep learning curves. And non-technical teams are left out entirely.

That changes today. Introducing Weaved Video Studio — the platform that lets anyone create professional product demo videos, in minutes, not weeks.

Here's how it works. Step one: pick from eleven scene types, or build your own custom scene from scratch. Step two: customize everything — text, images, colors, rich formatting — all with a live preview that updates instantly. Step three: render and download your video as MP4, ready to share.

The platform is packed with features. A rich text editor with bold, italic, and bullet lists. Image uploads. Custom backgrounds. Drag and reorder scenes. Brand colors and logo applied everywhere. Stats, testimonials, logo walls, and so much more.

The impact is real. Ten times faster than traditional video production. Zero design cost — your team creates videos directly. And one hundred percent control — no more waiting for revisions.

Who can use it? Everyone. CEOs creating investor updates. Marketing teams launching products. HR building onboarding videos. Sales teams crafting personalized demos. If you can fill in a form, you can create a video.

Start creating today. Professional videos. Zero learning curve. Your brand, your way. Weaved Video Studio.`;

console.log('Script length:', SCRIPT.length, 'chars');
console.log('Generating voiceover...');

const body = JSON.stringify({ text: SCRIPT, voice_id: 'Daniel', similarity: 1, stability: 0.55, use_speaker_boost: true });

function httpsRequest(options, body) {
	return new Promise((resolve, reject) => {
		const req = https.request(options, (res) => { let data = ''; res.on('data', (c) => { data += c; }); res.on('end', () => resolve({ status: res.statusCode, data })); });
		req.on('error', reject); if (body) req.write(body); req.end();
	});
}
function httpsGet(url) {
	return new Promise((resolve, reject) => {
		https.get(url, (res) => {
			if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) return httpsGet(res.headers.location).then(resolve).catch(reject);
			let data = []; res.on('data', (c) => data.push(c)); res.on('end', () => resolve({ status: res.statusCode, data: Buffer.concat(data) }));
		}).on('error', reject);
	});
}
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function main() {
	const res = await httpsRequest({ hostname: 'api.wavespeed.ai', path: '/api/v3/elevenlabs/eleven-v3', method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` } }, body);
	const json = JSON.parse(res.data);
	console.log('Status:', json.data?.status, 'ID:', json.data?.id);

	if (!json.data?.id) { console.error('API error:', json); process.exit(1); }
	const taskId = json.data.id;

	let audioUrl = null;
	if (json.data.status === 'completed' && json.data.outputs?.length) { audioUrl = json.data.outputs[0]; }
	else {
		for (let i = 0; i < 40; i++) {
			await sleep(2000);
			const poll = await httpsRequest({ hostname: 'api.wavespeed.ai', path: `/api/v3/predictions/${taskId}/result`, method: 'GET', headers: { 'Authorization': `Bearer ${API_KEY}` } });
			const p = JSON.parse(poll.data);
			console.log(`Poll ${i + 1}: ${p.data?.status}`);
			if (p.data?.status === 'completed' && p.data?.outputs?.length) { audioUrl = p.data.outputs[0]; break; }
			if (p.data?.status === 'failed') { console.error('Failed:', p); process.exit(1); }
		}
	}
	if (!audioUrl) { console.error('Timed out'); process.exit(1); }

	console.log('Downloading:', audioUrl);
	const audio = await httpsGet(audioUrl);
	const out = path.join(process.cwd(), 'public', 'assets', 'marketing-voiceover.mp3');
	fs.writeFileSync(out, audio.data);
	console.log('Saved:', out, `(${audio.data.length} bytes)`);
}
main().catch((e) => { console.error(e); process.exit(1); });
