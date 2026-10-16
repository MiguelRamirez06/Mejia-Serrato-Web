# AGENTS.md

Vue 3 + Vite single-page marketing site (plain JS, no TypeScript) for a stone restoration business. `README.md` (Spanish) is the detailed source; below is only what agents tend to get wrong.

## Commands

- `npm install`, `npm run dev` (Vite, host `0.0.0.0`, port `5173`)
- `npm run build` -> `dist/`, `npm run preview` (port `4173`)
- No lint, typecheck, or test tooling exists. Do not add or invoke them; verify changes with `npm run build`.

## Non-obvious facts

- `resources/` is the Vite `publicDir` (NOT `public/`). Anything there is served from root and referenced with absolute paths like `/works/work_1.webp`. Put new static assets in `resources/`, never `src/assets/`.
- `@` alias resolves to `src/` (`vite.config.js`).
- All UI text lives in `src/locales/en.json` and `src/locales/es.json` and is read with `t('section.key')` / `tm('section.items')`. Keep EN/ES in parity.
- Image paths and icon lists are hardcoded as arrays inside the section components (`src/components/sections/`), not in the locale files. When swapping media, edit the component too.
- Locale is detected from the browser and persisted in `localStorage` under `mss-locale`.
- Contact info, WhatsApp link builder, and CARTO map tiles/key live in `src/data/site.js`. The CARTO key and all values there are client-side (shipped in the bundle); the contact data is placeholder.
- Animations use GSAP + ScrollTrigger + Lenis. Components must respect `prefersReducedMotion()` from `useLenis.js`. `ScrollTrigger.refresh()` is already called on load and after 600ms in `App.vue`; add another refresh if content height changes dynamically.
- User-facing brand name is "Mejia Hernandez Stone Restoration" (see `index.html`, locales). The npm package/repo names differ — do not use them in copy.
- Deploy target is Vercel: build `npm run build`, output `dist`. No env vars.
