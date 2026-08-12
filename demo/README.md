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
npm run demo              # or: npm run demo:dev
npm run demo:build        # production build → demo/dist (base `/`)
npm run demo:build:pages  # production build with DEMO_BASE=/persian-web-core/
npm run demo:preview
npm run demo:typecheck
```

> Note: this repository folder name may contain `:`. Prefer `npm run demo` from the root, or `node ./node_modules/vite/bin/vite.js` inside `demo/`, so PATH splitting does not break the Vite binary.

The Vite config aliases `@persian-web/core` (and subpaths) to `../src`, so every playground and docs example calls the real library source.

## Production build notes

- Output: `demo/dist` (includes `index.html`, `404.html` for SPA fallback, favicon, robots.txt)
- Hash routing (`#/introduction`, …) works on static hosts without server rewrites
- Set `DEMO_BASE` when the site is not served from domain root (GitHub Pages project site)
- Set `DEMO_SOURCEMAP=true` if you need production source maps

## Deploy: Vercel

1. Push the repository to GitHub (or connect another Git provider).
2. In [Vercel](https://vercel.com): **Add New Project** → import `persian-web-core`.
3. Keep **Root Directory** as the repository root (uses root `vercel.json`).
4. Confirm settings from `vercel.json`:
   - **Install Command:** `npm ci --ignore-scripts && npm --prefix demo ci --ignore-scripts`
   - **Build Command:** `npm run demo:build`
   - **Output Directory:** `demo/dist`
5. Environment variables (optional):
   - `DEMO_BASE=/` (default; only change if the docs are behind a path prefix)
6. Deploy. Open the deployment URL — you should land on `#/introduction`.
7. Optional: set a custom domain under Project → Settings → Domains.

Local check before deploying:

```bash
npm ci --ignore-scripts
npm --prefix demo ci --ignore-scripts
npm run demo:build
npm run demo:preview
```

## Deploy: GitHub Pages

The docs use **hash routing**, so GitHub Pages only needs a correct `base` path and static files under `demo/dist`.

### One-time GitHub settings

1. Repo → **Settings** → **Pages**
2. **Source:** GitHub Actions
3. Ensure the repo name is `persian-web-core` (base path `/persian-web-core/`).  
   If the repo name differs, change `DEMO_BASE` in `package.json` script `demo:build:pages` and in `demo/public/sitemap.txt` / `robots.txt`.

### Option A — Manual workflow (prepared in-repo)

1. Open **Actions** → **Deploy docs**
2. Click **Run workflow**
3. After it finishes, the site is at:  
   `https://<user>.github.io/persian-web-core/`

Workflow file: `.github/workflows/deploy-docs.yml` (manual `workflow_dispatch` only — it does not publish on every push).

### Option B — Build locally and upload

```bash
npm ci --ignore-scripts
npm --prefix demo ci --ignore-scripts
npm run demo:build:pages
```

Then upload `demo/dist` with any Pages method you prefer (Actions artifact, `peaceiris/actions-gh-pages`, etc.). The build already writes `404.html` (copy of `index.html`) for unknown paths.

### Verify

- `https://<user>.github.io/persian-web-core/` redirects into `#/introduction`
- Deep link: `https://<user>.github.io/persian-web-core/#/digits`
- Favicon and assets load under `/persian-web-core/assets/...`
