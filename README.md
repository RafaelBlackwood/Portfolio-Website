# Rafael Portfolio

A fantasy-themed React portfolio with an embedded Doom Tower card-combat game, designed and built by Rafael Aghashirinov as a full custom web experience.

## What Is Included

- Animated portfolio landing experience with themed content sections.
- Doom Tower game mode with class selection, floor exploration, hidden cells, treasure, merchants, equipment, and turn-based combat.
- Persistent class skill bar for attacks, defense, healing, utility, and debuffs.
- Dice-driven combat where player hit rolls resolve before damage rolls.
- Local Vite, Tailwind CSS, Framer Motion, Three.js, and Lucide React setup.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

- `src/pages` - top-level application pages, including the Doom Tower game.
- `src/components` - shared UI, portfolio sections, and game components.
- `src/lib` - game data, combat rules, tower map generation, auth shims, and utilities.
- `src/components/ui` - Radix/shadcn-style reusable primitives used by the app.

## Notes

The repository intentionally excludes `node_modules`, production builds, local logs, environment files, editor folders, and cache directories. After cloning, run `npm install` to restore dependencies.
