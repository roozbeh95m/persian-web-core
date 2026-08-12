# @persian-web/core demo

Documentation site and interactive playground for the local `@persian-web/core` package.

## Setup

```bash
npm --prefix demo install
```

## Scripts

From the repository root:

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

> Note: this repository folder name contains `:`. Prefer `npm run demo` from the root, or `node ./node_modules/vite/bin/vite.js` inside `demo/`, so PATH splitting does not break the Vite binary.

The Vite config aliases `@persian-web/core` (and subpaths) to `../src`, so every playground example calls the real library source.
