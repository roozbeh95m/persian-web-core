import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const packageJson = JSON.parse(
  readFileSync(join(packageRoot, 'package.json'), 'utf8'),
) as {
  sideEffects: boolean;
  exports: Record<string, { types: string; import: string }>;
};

describe('package exports and build layout', () => {
  it('marks the package as side-effect free for tree shaking', () => {
    expect(packageJson.sideEffects).toBe(false);
  });

  it('exposes the format subpath export', () => {
    expect(packageJson.exports['./format']).toEqual({
      types: './dist/format/index.d.ts',
      import: './dist/format/index.js',
    });
  });

  it('includes format in the root export graph only via explicit re-exports', () => {
    const rootSource = readFileSync(join(packageRoot, 'src/index.ts'), 'utf8');
    expect(rootSource).toContain("from './format/index.js'");
  });

  it('emits standalone format build artifacts', () => {
    const formatEntry = join(packageRoot, 'dist/format/index.js');
    const formatSource = readFileSync(formatEntry, 'utf8');
    expect(formatSource).toContain('formatNumber');
    expect(formatSource).not.toContain('normalizePersian');
  });
});
