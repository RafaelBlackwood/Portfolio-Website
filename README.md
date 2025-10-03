# Portfolio Website (Next.js • Tailwind • Framer Motion)

A modern, animated developer portfolio for **Rafael Aghashirinov** built with **Next.js (App Router)**, **Tailwind CSS**, **Framer Motion**, and **lucide-react**. It features a dynamic hero, smooth parallax background, animated shapes, sections for About/Skills/Experience/Education/Projects/Contact, and quick-access CTAs.

## Tech Stack
- **Next.js** (App Router, SSR/CSR boundaries)
- **React** + **Framer Motion** (animations, parallax)
- **Tailwind CSS** (utility-first styling)
- **lucide-react** (icons)

## Features
- Animated technical background with grid, links, and slowly drifting geometric shapes that gently follow the cursor.
- Smooth section reveals and timeline-style experience cards.
- Clean component architecture: `src/app/page.jsx` renders `Portfolio`, with UI split into `src/components/portfolio/*`.
- Hydration-safe background (large animation is loaded client-side only).

## Quick Start
```bash
# install
npm i

# if you need tailwind v4 postcss plugin (first setup):
npm i -D @tailwindcss/postcss

# dev server
npm run dev
# open http://localhost:3000
