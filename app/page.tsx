'use client';

import {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

export default function Dashboard() {
	const router = useRouter();
	const [url, setUrl] = useState('');
	const [scraping, setScraping] = useState(false);
	const [error, setError] = useState('');

	const handleUrlToVideo = async () => {
		if (!url.trim()) return;
		setScraping(true);
		setError('');

		try {
			const res = await fetch('/api/scrape', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({url: url.trim()}),
			});

			if (!res.ok) {
				const data = await res.json();
				setError(data.error || 'Failed to scrape URL');
				return;
			}

			const scrapeData = await res.json();
			// Store scraped data in sessionStorage and navigate to editor
			sessionStorage.setItem('scrape-data', JSON.stringify(scrapeData));
			router.push('/editor?template=product-demo-v2&source=url');
		} catch (err: any) {
			setError(err.message || 'Something went wrong');
		} finally {
			setScraping(false);
		}
	};

	return (
		<div className="min-h-screen">
			{/* Header */}
			<header className="border-b border-weaved-border px-8 py-4 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-weaved-blue to-weaved-cyan flex items-center justify-center">
						<span className="text-white font-bold text-lg italic font-serif">W</span>
					</div>
					<span className="text-xl font-bold text-weaved-light">
						Weaved <span className="text-weaved-muted font-normal">Video Studio</span>
					</span>
				</div>
				<span className="text-sm text-weaved-muted">v2.0</span>
			</header>

			{/* Hero */}
			<section className="px-8 py-14 text-center max-w-4xl mx-auto">
				<h1 className="text-5xl font-extrabold text-weaved-light mb-4 tracking-tight">
					Create Professional Videos
				</h1>
				<p className="text-xl text-weaved-muted mb-2">
					Build stunning product demos with a visual scene editor.
				</p>
				<p className="text-sm text-weaved-muted">Add scenes, upload images, customize everything — no code needed.</p>
			</section>

			{/* URL-to-Video */}
			<section className="px-8 pb-12 max-w-3xl mx-auto">
				<div className="bg-weaved-card border border-weaved-border rounded-2xl p-8">
					<div className="flex items-center gap-3 mb-4">
						<span className="text-2xl">🔗</span>
						<div>
							<h2 className="text-lg font-bold text-weaved-light">URL to Video</h2>
							<p className="text-sm text-weaved-muted">Paste any website URL — we'll auto-generate a video from it</p>
						</div>
					</div>

					<div className="flex gap-3">
						<input
							type="text"
							value={url}
							onChange={(e) => {setUrl(e.target.value); setError('');}}
							onKeyDown={(e) => e.key === 'Enter' && handleUrlToVideo()}
							placeholder="https://example.com"
							disabled={scraping}
							className="flex-1 px-4 py-3 rounded-xl bg-weaved-surface border border-weaved-border text-weaved-light text-sm placeholder:text-weaved-muted/50 focus:border-weaved-blue focus:outline-none focus:ring-1 focus:ring-weaved-blue/30 transition-colors disabled:opacity-50"
						/>
						<button
							onClick={handleUrlToVideo}
							disabled={scraping || !url.trim()}
							className="px-6 py-3 rounded-xl bg-gradient-to-r from-weaved-blue to-weaved-cyan text-white font-semibold text-sm disabled:opacity-50 hover:shadow-lg hover:shadow-weaved-blue/20 transition-all whitespace-nowrap"
						>
							{scraping ? (
								<span className="flex items-center gap-2">
									<span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
									Analyzing...
								</span>
							) : (
								'Generate Video'
							)}
						</button>
					</div>

					{error && (
						<p className="mt-3 text-sm text-red-400">{error}</p>
					)}

					{scraping && (
						<div className="mt-4">
							<div className="h-1.5 bg-weaved-border rounded-full overflow-hidden">
								<div className="h-full bg-gradient-to-r from-weaved-blue to-weaved-cyan rounded-full animate-pulse" style={{width: '100%'}} />
							</div>
							<p className="text-xs text-weaved-muted mt-2">Scraping website content, extracting colors, taking screenshot...</p>
						</div>
					)}
				</div>
			</section>

			{/* Divider */}
			<div className="max-w-3xl mx-auto px-8 pb-8">
				<div className="flex items-center gap-4">
					<div className="flex-1 h-px bg-weaved-border" />
					<span className="text-xs text-weaved-muted font-medium uppercase tracking-widest">or choose a template</span>
					<div className="flex-1 h-px bg-weaved-border" />
				</div>
			</div>

			{/* Templates */}
			<section className="px-8 pb-20 max-w-6xl mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{/* V2 Product Demo — Featured */}
					<Link
						href="/editor?template=product-demo-v2"
						className="group block bg-weaved-card border-2 border-weaved-blue/30 rounded-2xl p-6 hover:border-weaved-blue transition-all duration-200 hover:shadow-lg hover:shadow-weaved-blue/10 relative overflow-hidden"
					>
						<div className="absolute top-3 right-3 px-2 py-0.5 bg-weaved-blue text-white text-xs font-bold rounded">NEW</div>
						<div className="w-full h-48 rounded-xl bg-gradient-to-br from-weaved-blue/10 to-weaved-cyan/10 flex items-center justify-center mb-5 text-6xl group-hover:scale-105 transition-transform duration-200">
							🚀
						</div>
						<h3 className="text-xl font-bold text-weaved-light mb-2">
							Product Demo
						</h3>
						<p className="text-sm text-weaved-muted leading-relaxed">
							11 scene types, drag & drop, image uploads, custom backgrounds. Fully customizable.
						</p>
						<div className="mt-4 flex items-center gap-2 text-sm text-weaved-blue font-medium">
							<span>Open Editor</span>
							<span className="group-hover:translate-x-1 transition-transform">→</span>
						</div>
					</Link>

					{/* V1 Templates */}
					{[
						{id: 'team-intro', name: 'Team Intro', icon: '👤', desc: 'Introduce a team member with role, achievements, and contact info.'},
						{id: 'announcement', name: 'Announcement', icon: '📢', desc: 'Make a bold announcement with eye-catching animations.'},
					].map((t) => (
						<Link
							key={t.id}
							href={`/editor?template=${t.id}`}
							className="group block bg-weaved-card border border-weaved-border rounded-2xl p-6 hover:border-weaved-blue/50 transition-all duration-200 hover:shadow-lg hover:shadow-weaved-blue/5"
						>
							<div className="w-full h-48 rounded-xl bg-weaved-surface flex items-center justify-center mb-5 text-6xl group-hover:scale-105 transition-transform duration-200">
								{t.icon}
							</div>
							<h3 className="text-xl font-bold text-weaved-light mb-2">{t.name}</h3>
							<p className="text-sm text-weaved-muted leading-relaxed">{t.desc}</p>
							<div className="mt-4 flex items-center gap-2 text-sm text-weaved-blue font-medium">
								<span>Use Template</span>
								<span className="group-hover:translate-x-1 transition-transform">→</span>
							</div>
						</Link>
					))}
				</div>
			</section>
		</div>
	);
}
