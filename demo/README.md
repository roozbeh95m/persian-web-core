# @persian-web/core demo

Interactive Vite + React playground for the local `@persian-web/core` package.

## Setup

```bash
npm --prefix demo install --ignore-scripts
node demo/scripts/ensure-esbuild.mjs
```

> Note: this repository directory name contains a colon (`persian-web:core`), which breaks Unix `PATH` lookups for `node_modules/.bin`. Demo scripts invoke Vite/TypeScript by explicit file path. Prefer `npm install --ignore-scripts` in `demo/`, then run the small `ensure-esbuild` check (or rely on the `postinstall` script).

## Scripts

From the repo root:

```bash
npm run demo          # or: npm run demo:dev
npm run demo:build
npm run demo:preview
npm run demo:typecheck
```

Or inside `demo/`:

```bash
npm run dev
npm run build
npm run preview
npm run typecheck
```

The Vite config aliases `@persian-web/core` (and all public subpaths) to `../src`, so the demo consumes the local library source during development and when building the static site.
