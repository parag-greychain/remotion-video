# Weaved Video Studio

## What is this?
A web-based video creation platform built with Next.js + Remotion. Non-technical users (managers, CEOs, marketing) can create professional product demo videos from the browser — no code, no designers, no video editing software.

## Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Video Engine**: Remotion 4 (`@remotion/player` for preview, `@remotion/renderer` for MP4 export)
- **Rich Text**: Tiptap (bold, italic, underline, bullet lists, numbered lists, headings, blockquotes)
- **TTS**: WaveSpeed ElevenLabs v3 API (voice: Daniel)
- **No backend, no database** — everything runs in Next.js API routes

## Brand
- **Company**: Weaved
- **Primary**: `#1F6BFF` (blue)
- **Accent**: `#16BAFF` (cyan)
- **Dark**: `#020204`
- **Font**: Plus Jakarta Sans / system-ui
- **Logo**: `public/assets/icon-512.png`

## Project Structure
```
app/                          → Next.js pages
├── page.tsx                  → Dashboard (template gallery)
├── editor/
│   ├── page.tsx              → Router (V1 vs V2 editor)
│   ├── EditorContent.tsx     → V2 scene-based editor (main)
│   ├── EditorV1.tsx          → V1 legacy form editor
│   ├── SceneFormFields.tsx   → Per-scene form fields (all 11 types)
│   ├── SceneTypePicker.tsx   → Scene type picker modal
│   ├── RichTextEditor.tsx    → Tiptap WYSIWYG editor
│   ├── ImageUpload.tsx       → Drag & drop image upload
│   └── BackgroundEditor.tsx  → Background type/color/image editor
├── api/
│   ├── render/route.ts       → Server-side MP4 rendering
│   └── upload/route.ts       → Image upload to public/uploads/

src/
├── lib/
│   ├── types.ts              → All TypeScript types (11 scene configs, VideoProject, BrandSettings, blocks)
│   ├── templates.ts          → V1 template definitions (product-demo, team-intro, announcement)
│   └── richtext-helpers.ts   → Tiptap JSON helpers
├── remotion/
│   ├── index.ts              → Remotion entry point (registerRoot)
│   └── Root.tsx              → All Remotion compositions registered
├── templates/
│   ├── DynamicComposition.tsx → Maps scene array → TransitionSeries
│   ├── shared.tsx            → AnimatedText, GlowOrb, GradientLine
│   ├── ProductDemo.tsx       → V1 product demo template
│   ├── TeamIntro.tsx         → V1 team intro template
│   ├── Announcement.tsx      → V1 announcement template
│   ├── scenes/               → 11 Remotion scene components
│   │   ├── index.tsx         → SceneRenderer (maps type → component)
│   │   ├── SceneBackground.tsx
│   │   ├── RichTextRenderer.tsx
│   │   ├── HeroScene.tsx
│   │   ├── ProblemScene.tsx
│   │   ├── SolutionScene.tsx
│   │   ├── FeatureSpotlightScene.tsx
│   │   ├── FeatureGridScene.tsx
│   │   ├── ImageTextScene.tsx
│   │   ├── StatsScene.tsx
│   │   ├── TestimonialScene.tsx
│   │   ├── LogoWallScene.tsx
│   │   ├── CtaScene.tsx
│   │   └── CustomScene.tsx
│   └── marketing/            → Pre-built marketing video (8 scenes with voiceover)
```

## 11 Scene Types
hero, problem, solution, feature-spotlight, feature-grid, image-text, stats, testimonial, logo-wall, cta, custom

## Custom Scene Builder
- 6 layout presets: centered, split-left, split-right, full-image, two-column, title-grid
- 5 block types: heading, text (rich text), image, stat, icon-text
- Blocks are add/remove/reorder within any layout

## Key Commands
```bash
npm run dev              # Start Next.js dev server
npm run build            # Production build
npm run remotion:studio  # Remotion studio (for direct composition preview)
```

## Architecture Rules
- Left panel (editor forms) = light theme (white bg, dark text)
- Right panel (player preview) = dark theme
- Left panel scrolls independently (h-screen overflow-hidden on parent)
- Remotion components must be deterministic (no Math.random, no useState, no useEffect)
- Use `useCurrentFrame()` + `interpolate()`/`spring()` for all animations
- Rich text stored as Tiptap JSON, rendered via `generateHTML()` + `dangerouslySetInnerHTML`
- Images uploaded to `public/uploads/`, served as static files
- Render API uses `@remotion/bundler` + `@remotion/renderer` in Next.js API route

## Version History
- **V1**: 3 fixed templates (Product Demo, Team Intro, Announcement) with form-based editing
- **V2**: Dynamic scene-based editor with 11 scene types, drag reorder, image uploads, rich text, custom scene builder, background editor, duration slider
- **Marketing Video**: 8-scene pre-built video with voiceover, platform screenshots
