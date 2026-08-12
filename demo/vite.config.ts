import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const demoRoot = path.dirname(fileURLToPath(import.meta.url));
const librarySrc = path.resolve(demoRoot, '../src');

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

export default defineConfig({
  plugins: [react()],
  base: process.env.DEMO_BASE ?? '/',
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
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },
});
