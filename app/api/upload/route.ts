import {NextRequest, NextResponse} from 'next/server';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp', 'image/gif', 'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm'];

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get('file') as File | null;

		if (!file) {
			return NextResponse.json({error: 'No file provided'}, {status: 400});
		}

		if (!ALLOWED_TYPES.includes(file.type)) {
			return NextResponse.json(
				{error: `Invalid file type: ${file.type}. Allowed: PNG, JPG, SVG, WebP, GIF`},
				{status: 400},
			);
		}

		if (file.size > MAX_SIZE) {
			return NextResponse.json(
				{error: `File too large. Maximum size: 10MB`},
				{status: 400},
			);
		}

		// Ensure upload dir exists
		if (!fs.existsSync(UPLOAD_DIR)) {
			fs.mkdirSync(UPLOAD_DIR, {recursive: true});
		}

		// Generate unique filename
		const ext = file.name.split('.').pop() || 'png';
		const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
		const filepath = path.join(UPLOAD_DIR, filename);

		// Write file
		const bytes = await file.arrayBuffer();
		fs.writeFileSync(filepath, Buffer.from(bytes));

		// Return the URL path (served from /public)
		const url = `/uploads/${filename}`;

		return NextResponse.json({url, filename, size: file.size});
	} catch (error: any) {
		console.error('[upload] Error:', error);
		return NextResponse.json({error: error.message || 'Upload failed'}, {status: 500});
	}
}
