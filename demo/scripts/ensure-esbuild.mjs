#!/usr/bin/env node
/**
 * Repo directory names containing `:` break Unix PATH lookups for
 * `node_modules/.bin`. Prefer explicit binary paths in npm scripts.
 *
 * This postinstall verifies that the `esbuild` package API works (Vite needs it).
 */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

try {
  const esbuild = require('esbuild');
  const result = esbuild.transformSync('export const ok = 1', {
    loader: 'ts',
    format: 'esm',
  });
  if (!result.code.includes('ok')) {
    throw new Error('Unexpected esbuild transform output');
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`[demo] esbuild verification warning: ${message}`);
  console.warn(
    '[demo] If Vite fails to start, reinstall with: npm install --ignore-scripts',
  );
}
