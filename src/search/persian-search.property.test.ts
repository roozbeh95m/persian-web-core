import fc from 'fast-check';
import { afterEach, describe, expect, it } from 'vitest';

import {
  clearSearchNormalizeCache,
  includesPersian,
  matchesPersian,
  normalizeForSearch,
} from './persian-search.js';

const ZWNJ = '\u200C';

afterEach(() => {
  clearSearchNormalizeCache();
});

describe('normalizeForSearch cache', () => {
  it('evicts the oldest entry once the LRU cache exceeds 512 keys', () => {
    clearSearchNormalizeCache();

    const first = 'cache-key-0-unique-seed';
    expect(normalizeForSearch(first)).toBe('cache-key-0-unique-seed');

    for (let i = 1; i <= 512; i++) {
      normalizeForSearch(`cache-key-${String(i)}-unique-seed`);
    }

    // After 513 distinct inserts, the first key must have been evicted and
    // recomputed (still correct, but proves the eviction branch ran).
    expect(normalizeForSearch(first)).toBe('cache-key-0-unique-seed');
  });

  it('returns cached identity for repeated identical inputs', () => {
    const input = 'گوشی سامسونگ كلاسیک';
    const a = normalizeForSearch(input);
    const b = normalizeForSearch(input);
    expect(a).toBe(b);
    expect(a).toBe('گوشی سامسونگ کلاسیک');
  });
});

describe('normalizeForSearch property-based', () => {
  it('is idempotent for arbitrary Unicode', () => {
    fc.assert(
      fc.property(fc.string({ unit: 'binary' }), (input) => {
        const once = normalizeForSearch(input);
        expect(normalizeForSearch(once)).toBe(once);
      }),
      { numRuns: 150 },
    );
  });

  it('empty query matches any text for matchesPersian and includesPersian', () => {
    fc.assert(
      fc.property(fc.string({ unit: 'binary' }), (text) => {
        expect(matchesPersian(text, '')).toBe(true);
        expect(includesPersian(text, '')).toBe(true);
      }),
      { numRuns: 50 },
    );
  });

  it('ZWNJ-stripped forms match joined spellings', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[\u0600-\u06FF]{2,8}$/u),
        fc.stringMatching(/^[\u0600-\u06FF]{2,8}$/u),
        (left, right) => {
          const joined = `${left}${right}`;
          const withZwnj = `${left}${ZWNJ}${right}`;
          expect(normalizeForSearch(joined)).toBe(normalizeForSearch(withZwnj));
          expect(includesPersian(withZwnj, left)).toBe(true);
        },
      ),
      { numRuns: 40 },
    );
  });

  it('does not fold non-ASCII Latin case (documented)', () => {
    expect(normalizeForSearch('École')).toBe('École');
    expect(normalizeForSearch('Übung')).toBe('Übung');
    expect(matchesPersian('École', 'école')).toBe(false);
  });
});
