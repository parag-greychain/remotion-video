import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import {execSync} from 'child_process';

// Find Chrome installed by Remotion
function findChrome() {
	const remotionCache = path.join(process.env.LOCALAPPDATA || '', 'remotion-chrome-headless-shell');
	if (fs.existsSync(remotionCache)) {
		const dirs = fs.readdirSync(remotionCache).filter(d => d.startsWith('chrome-'));
		if (dirs.length > 0) {
			const chromeDir = path.join(remotionCache, dirs[dirs.length - 1]);
			const exe = path.join(chromeDir, 'chrome-headless-shell-win64', 'chrome-headless-shell.exe');
			if (fs.existsSync(exe)) return exe;
		}
	}
	// Fallback to system Chrome
	const paths = [
		'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
		'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
		path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
	];
	for (const p of paths) {
		if (fs.existsSync(p)) return p;
	}
	return null;
}

const outDir = path.join(process.cwd(), 'public', 'assets', 'screenshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true});

async function main() {
	const chromePath = findChrome();
	console.log('Chrome:', chromePath);

	const browser = await puppeteer.launch({
		executablePath: chromePath,
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	});

	const page = await browser.newPage();
	await page.setViewport({width: 1920, height: 1080, deviceScaleFactor: 1});

	// Screenshot 1: Dashboard
	console.log('Capturing dashboard...');
	await page.goto('http://localhost:3001', {waitUntil: 'networkidle0', timeout: 15000});
	await page.screenshot({path: path.join(outDir, 'dashboard.png'), type: 'png'});
	console.log('✓ dashboard.png');

	// Screenshot 2: Editor with scenes
	console.log('Capturing editor...');
	await page.goto('http://localhost:3001/editor?template=product-demo-v2', {waitUntil: 'networkidle0', timeout: 15000});
	await new Promise(r => setTimeout(r, 2000)); // wait for player to load
	await page.screenshot({path: path.join(outDir, 'editor.png'), type: 'png'});
	console.log('✓ editor.png');

	// Screenshot 3: Scene picker modal - click Add Scene button
	console.log('Capturing scene picker...');
	try {
		const addBtn = await page.$('button:has-text("Add Scene")');
		if (addBtn) {
			await addBtn.click();
			await new Promise(r => setTimeout(r, 500));
		} else {
			// Try finding by content
			const buttons = await page.$$('button');
			for (const btn of buttons) {
				const text = await page.evaluate(el => el.textContent, btn);
				if (text && text.includes('Add Scene')) {
					await btn.click();
					await new Promise(r => setTimeout(r, 500));
					break;
				}
			}
		}
		await page.screenshot({path: path.join(outDir, 'scene-picker.png'), type: 'png'});
		console.log('✓ scene-picker.png');

		// Close modal
		await page.keyboard.press('Escape');
		await new Promise(r => setTimeout(r, 300));
	} catch (e) {
		console.log('Scene picker capture failed, using editor instead');
		await page.screenshot({path: path.join(outDir, 'scene-picker.png'), type: 'png'});
	}

	// Screenshot 4: Expanded scene editing
	console.log('Capturing scene editing...');
	try {
		const sceneCards = await page.$$('[draggable="true"]');
		if (sceneCards.length > 2) {
			await sceneCards[2].click(); // click 3rd scene
			await new Promise(r => setTimeout(r, 500));
		}
		await page.screenshot({path: path.join(outDir, 'scene-editing.png'), type: 'png'});
		console.log('✓ scene-editing.png');
	} catch (e) {
		console.log('Scene editing capture failed');
	}

	await browser.close();
	console.log('\nAll screenshots saved to:', outDir);
	fs.readdirSync(outDir).forEach(f => console.log(' ', f, '-', fs.statSync(path.join(outDir, f)).size, 'bytes'));
}

main().catch(e => { console.error(e); process.exit(1); });
