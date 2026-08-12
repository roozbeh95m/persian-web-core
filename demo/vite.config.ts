import { copyFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

const demoRoot = path.dirname(fileURLToPath(import.meta.url));
const librarySrc = path.resolve(demoRoot, '../src');
const libraryPkg = JSON.parse(
  readFileSync(path.resolve(demoRoot, '../package.json'), 'utf8'),
) as { version: string };

const subpaths = [
  'digits',
  'normalize',
  'format',
  'currency',
  'phone',
  'national-id',
  'search',
  'slug',
  'typography',
  'sort',
  'date',
  'direction',
] as const;

/** Copy index.html → 404.html so GitHub Pages serves the SPA for unknown paths. */
function githubPagesSpaFallback(): Plugin {
  return {
    name: 'github-pages-spa-fallback',
    closeBundle() {
      const indexHtml = path.join(demoRoot, 'dist/index.html');
      copyFileSync(indexHtml, path.join(demoRoot, 'dist/404.html'));
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), githubPagesSpaFallback()],
  // GitHub Pages project sites need e.g. DEMO_BASE=/persian-web-core/
  base: process.env.DEMO_BASE ?? '/',
  define: {
    __LIB_VERSION__: JSON.stringify(libraryPkg.version),
  },
  resolve: {
    // More-specific subpath aliases must come before the package root.
    // String finds are prefix matches in Vite.
    alias: [
      ...subpaths.map((name) => ({
        find: `@persian-web/core/${name}`,
        replacement: path.join(librarySrc, name, 'index.ts'),
      })),
      {
        find: /^@persian-web\/core$/,
        replacement: path.join(librarySrc, 'index.ts'),
      },
    ],
  },
  server: {
    port: 5173,
    open: false,
    // Path contains `:` (folder name), which breaks Vite's default FS allowlist.
    fs: {
      allow: [demoRoot, path.resolve(demoRoot, '..')],
      strict: false,
    },
  },
  preview: {
    port: 4173,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Keep maps opt-in for production deploys (smaller artifact by default).
    sourcemap: process.env.DEMO_SOURCEMAP === 'true' || mode === 'development',
    target: 'es2022',
    cssCodeSplit: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom')) {
            return 'react-dom';
          }
          if (id.includes('node_modules/react')) {
            return 'react';
          }
          if (id.includes('/src/') && !id.includes('/demo/')) {
            return 'persian-web-core';
          }
          return undefined;
        },
      },
    },
  },
}));
