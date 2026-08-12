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

  it('exposes the currency subpath export', () => {
    expect(packageJson.exports['./currency']).toEqual({
      types: './dist/currency/index.d.ts',
      import: './dist/currency/index.js',
    });
  });

  it('exposes the phone subpath export', () => {
    expect(packageJson.exports['./phone']).toEqual({
      types: './dist/phone/index.d.ts',
      import: './dist/phone/index.js',
    });
  });

  it('exposes the national-id subpath export', () => {
    expect(packageJson.exports['./national-id']).toEqual({
      types: './dist/national-id/index.d.ts',
      import: './dist/national-id/index.js',
    });
  });

  it('exposes the search subpath export', () => {
    expect(packageJson.exports['./search']).toEqual({
      types: './dist/search/index.d.ts',
      import: './dist/search/index.js',
    });
  });

  it('exposes the typography subpath export', () => {
    expect(packageJson.exports['./typography']).toEqual({
      types: './dist/typography/index.d.ts',
      import: './dist/typography/index.js',
    });
  });

  it('includes format in the root export graph only via explicit re-exports', () => {
    const rootSource = readFileSync(join(packageRoot, 'src/index.ts'), 'utf8');
    expect(rootSource).toContain("from './format/index.js'");
    expect(rootSource).toContain("from './currency/index.js'");
    expect(rootSource).toContain("from './phone/index.js'");
    expect(rootSource).toContain("from './national-id/index.js'");
    expect(rootSource).toContain("from './search/index.js'");
    expect(rootSource).toContain("from './typography/index.js'");
  });

  it('emits standalone format build artifacts', () => {
    const formatEntry = join(packageRoot, 'dist/format/index.js');
    const formatSource = readFileSync(formatEntry, 'utf8');
    expect(formatSource).toContain('formatNumber');
    expect(formatSource).not.toContain('normalizePersian');
  });

  it('emits standalone currency build artifacts', () => {
    const currencyEntry = join(packageRoot, 'dist/currency/index.js');
    const currencySource = readFileSync(currencyEntry, 'utf8');
    expect(currencySource).toContain('formatCurrency');
    expect(currencySource).not.toContain('normalizePersian');
  });

  it('emits standalone phone build artifacts', () => {
    const phoneEntry = join(packageRoot, 'dist/phone/index.js');
    const phoneSource = readFileSync(phoneEntry, 'utf8');
    expect(phoneSource).toContain('normalizePhone');
    expect(phoneSource).not.toContain('normalizePersian');
  });

  it('emits standalone national-id build artifacts', () => {
    const nationalIdEntry = join(packageRoot, 'dist/national-id/index.js');
    const nationalIdSource = readFileSync(nationalIdEntry, 'utf8');
    expect(nationalIdSource).toContain('validateNationalId');
    expect(nationalIdSource).not.toContain('normalizePersian');
  });

  it('emits standalone search build artifacts', () => {
    const searchEntry = join(packageRoot, 'dist/search/index.js');
    const searchSource = readFileSync(searchEntry, 'utf8');
    expect(searchSource).toContain('normalizeForSearch');
    expect(searchSource).toContain('includesPersian');
    expect(searchSource).not.toContain('formatNumber');
  });

  it('emits standalone typography build artifacts', () => {
    const typographyEntry = join(packageRoot, 'dist/typography/index.js');
    const typographySource = readFileSync(typographyEntry, 'utf8');
    expect(typographySource).toContain('fixPersianTypography');
    expect(typographySource).not.toContain('normalizePersian');
  });
});
