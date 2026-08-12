import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { persianSlug } from './index.js';

const ZWNJ = '\u200C';
const SLUG_SAFE = /^(?:[\p{Script=Arabic}a-z0-9]|-)*$/u;

describe('persianSlug property-based', () => {
  it('is idempotent for arbitrary Unicode', () => {
    fc.assert(
      fc.property(fc.string({ unit: 'binary' }), (input) => {
        const once = persianSlug(input);
        expect(persianSlug(once)).toBe(once);
      }),
      { numRuns: 150 },
    );
  });

  it('never starts or ends with a hyphen and never contains "--"', () => {
    fc.assert(
      fc.property(fc.string({ unit: 'binary' }), (input) => {
        const slug = persianSlug(input);
        if (slug.length === 0) {
          return;
        }
        expect(slug.startsWith('-')).toBe(false);
        expect(slug.endsWith('-')).toBe(false);
        expect(slug.includes('--')).toBe(false);
        expect(slug).toMatch(SLUG_SAFE);
      }),
      { numRuns: 150 },
    );
  });

  it('collapses consecutive ZWNJ into a single hyphen between letters', () => {
    expect(persianSlug(`می${ZWNJ}${ZWNJ}رود`)).toBe('می-رود');
    expect(persianSlug(`می${ZWNJ}${ZWNJ}${ZWNJ}رود`)).toBe('می-رود');
  });

  it('strips emoji and underscores to hyphen boundaries', () => {
    expect(persianSlug('گوشی_سامسونگ 📱')).toBe('گوشی-سامسونگ');
    expect(persianSlug('___')).toBe('');
    expect(persianSlug('🎹')).toBe('');
  });

  it('normalizes Alef Maksura and ۀ via normalizePersian', () => {
    expect(persianSlug('خانه‌اى')).toBe('خانه-ای');
    expect(persianSlug('خانۀ بزرگ')).toBe('خانه-بزرگ');
  });
});
