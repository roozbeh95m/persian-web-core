# @persian-web/core documentation site

Developer documentation and interactive playground for the local `@persian-web/core` package.

## Sections

- **Guides** — Introduction, Installation, Quick Start, TypeScript, Browser support, Common use cases, FAQ
- **API Reference** — Catalog generated from real package exports; each module page includes docs + playground
- **Examples / Playground** — Executable snippets and live multi-module playground

API examples call the library at runtime and include a copy button.

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

> Note: this repository folder name contains `:`. Prefer `npm run demo` from the root, or `node ./node_modules/vite/bin/vite.js` inside `demo/`, so PATH splitting does not break the Vite binary.

The Vite config aliases `@persian-web/core` (and subpaths) to `../src`, so every playground and docs example calls the real library source.
