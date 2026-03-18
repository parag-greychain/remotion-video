'use client';

import Link from 'next/link';

export default function Dashboard() {
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
			<section className="px-8 py-16 text-center max-w-4xl mx-auto">
				<h1 className="text-5xl font-extrabold text-weaved-light mb-4 tracking-tight">
					Create Professional Videos
				</h1>
				<p className="text-xl text-weaved-muted mb-2">
					Build stunning product demos with a visual scene editor.
				</p>
				<p className="text-sm text-weaved-muted">Add scenes, upload images, customize everything — no code needed.</p>
			</section>

			{/* Templates */}
			<section className="px-8 pb-20 max-w-6xl mx-auto">
				<h2 className="text-lg font-semibold text-weaved-muted mb-6 uppercase tracking-widest">
					Choose a Template
				</h2>
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
							10 scene types, drag & drop, image uploads, custom backgrounds. Fully customizable.
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
