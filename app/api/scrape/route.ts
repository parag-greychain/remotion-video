import {NextRequest, NextResponse} from 'next/server';
import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

function findChrome(): string | null {
	const paths = [
		'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
		'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
		path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
		'/usr/bin/google-chrome',
		'/usr/bin/chromium-browser',
		'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	];
	for (const p of paths) {
		if (fs.existsSync(p)) return p;
	}
	return null;
}

export interface ScrapeResult {
	url: string;
	title: string;
	description: string;
	ogImage: string;
	favicon: string;
	screenshotUrl: string;
	brandColors: string[];
	headings: string[];
	features: string[];
	domain: string;
}

export async function POST(request: NextRequest) {
	try {
		const {url} = await request.json();

		if (!url || typeof url !== 'string') {
			return NextResponse.json({error: 'Missing URL'}, {status: 400});
		}

		// Validate URL
		let parsedUrl: URL;
		try {
			parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
		} catch {
			return NextResponse.json({error: 'Invalid URL'}, {status: 400});
		}

		const chromePath = findChrome();
		if (!chromePath) {
			return NextResponse.json({error: 'Chrome not found on system'}, {status: 500});
		}

		console.log('[scrape] Starting:', parsedUrl.href);

		const browser = await puppeteer.launch({
			executablePath: chromePath,
			headless: true,
			args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
		});

		const page = await browser.newPage();
		await page.setViewport({width: 1920, height: 1080, deviceScaleFactor: 1});

		await page.goto(parsedUrl.href, {waitUntil: 'networkidle0', timeout: 20000}).catch(() => {
			// Fallback to domcontentloaded if networkidle times out
			return page.goto(parsedUrl.href, {waitUntil: 'domcontentloaded', timeout: 15000});
		});

		// Extract all metadata in one evaluate call
		const data = await page.evaluate(() => {
			const getMeta = (name: string): string => {
				const el = document.querySelector(`meta[property="${name}"], meta[name="${name}"]`);
				return el?.getAttribute('content') || '';
			};

			// Get title
			const title = getMeta('og:title') || document.title || '';

			// Get description
			const description = getMeta('og:description') || getMeta('description') || '';

			// Get OG image
			const ogImage = getMeta('og:image') || '';

			// Get favicon
			const faviconEl = document.querySelector('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]');
			const favicon = faviconEl?.getAttribute('href') || '/favicon.ico';

			// Extract brand colors from CSS custom properties and computed styles
			const colors: string[] = [];
			const root = getComputedStyle(document.documentElement);

			// Check common CSS variable names for brand colors
			const colorVars = ['--primary', '--accent', '--brand', '--color-primary', '--color-accent', '--theme-color'];
			for (const v of colorVars) {
				const val = root.getPropertyValue(v).trim();
				if (val && val.startsWith('#')) colors.push(val);
			}

			// Get theme-color meta
			const themeColor = getMeta('theme-color');
			if (themeColor) colors.push(themeColor);

			// Extract colors from prominent elements
			const hero = document.querySelector('header, [class*="hero"], [class*="header"], main > section:first-child');
			if (hero) {
				const style = getComputedStyle(hero);
				if (style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
					const rgb = style.backgroundColor;
					// Convert rgb to hex
					const match = rgb.match(/\d+/g);
					if (match && match.length >= 3) {
						const hex = '#' + match.slice(0, 3).map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
						colors.push(hex);
					}
				}
			}

			// Get link/button colors
			const links = document.querySelectorAll('a, button');
			for (let i = 0; i < Math.min(links.length, 5); i++) {
				const style = getComputedStyle(links[i]);
				const bg = style.backgroundColor;
				if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'rgb(255, 255, 255)') {
					const match = bg.match(/\d+/g);
					if (match && match.length >= 3) {
						const hex = '#' + match.slice(0, 3).map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
						if (!colors.includes(hex)) colors.push(hex);
					}
				}
			}

			// Extract headings
			const headings: string[] = [];
			document.querySelectorAll('h1, h2, h3').forEach((el, i) => {
				if (i < 10 && el.textContent) {
					const text = el.textContent.trim();
					if (text.length > 3 && text.length < 200) headings.push(text);
				}
			});

			// Extract feature-like content (list items, short paragraphs near icons)
			const features: string[] = [];
			document.querySelectorAll('li, [class*="feature"] p, [class*="card"] h3, [class*="benefit"] h3').forEach((el, i) => {
				if (i < 10 && el.textContent) {
					const text = el.textContent.trim();
					if (text.length > 5 && text.length < 150) features.push(text);
				}
			});

			return {title, description, ogImage, favicon, colors, headings, features};
		});

		// Take screenshot
		const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
		if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, {recursive: true});

		const screenshotFilename = `scrape-${Date.now()}.png`;
		const screenshotPath = path.join(uploadsDir, screenshotFilename);
		await page.screenshot({path: screenshotPath, type: 'png'});

		await browser.close();

		// Resolve relative URLs
		const resolveUrl = (u: string): string => {
			if (!u) return '';
			if (u.startsWith('http')) return u;
			if (u.startsWith('//')) return `https:${u}`;
			return new URL(u, parsedUrl.origin).href;
		};

		// Deduplicate and limit colors
		const uniqueColors = [...new Set(data.colors)].filter(c => c !== '#000000' && c !== '#ffffff').slice(0, 4);

		const result: ScrapeResult = {
			url: parsedUrl.href,
			title: data.title,
			description: data.description,
			ogImage: resolveUrl(data.ogImage),
			favicon: resolveUrl(data.favicon),
			screenshotUrl: `/uploads/${screenshotFilename}`,
			brandColors: uniqueColors,
			headings: data.headings.slice(0, 8),
			features: data.features.slice(0, 6),
			domain: parsedUrl.hostname.replace('www.', ''),
		};

		console.log('[scrape] Done:', result.title, '| Colors:', result.brandColors.length, '| Headings:', result.headings.length);

		return NextResponse.json(result);
	} catch (error: any) {
		console.error('[scrape] Error:', error);
		return NextResponse.json({error: error.message || 'Scrape failed'}, {status: 500});
	}
}
