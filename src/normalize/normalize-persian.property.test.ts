import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { normalizePersian } from './index.js';
import type { NormalizePersianOptions } from './types.js';

const OPTION_SETS: NormalizePersianOptions[] = [
  {},
  { digits: 'preserve' },
  { digits: 'persian' },
  { digits: 'english' },
  { removeDiacritics: true },
  { normalizeWhitespace: true },
  {
    digits: 'english',
    removeDiacritics: true,
    normalizeWhitespace: true,
  },
  {
    digits: 'persian',
    removeDiacritics: true,
    normalizeWhitespace: true,
  },
];

describe('normalizePersian property-based', () => {
  it('is idempotent for arbitrary Unicode under all option sets', () => {
    fc.assert(
      fc.property(
        fc.string({ unit: 'binary' }),
        fc.constantFrom(...OPTION_SETS),
        (input, options) => {
          const once = normalizePersian(input, options);
          expect(normalizePersian(once, options)).toBe(once);
        },
      ),
      { numRuns: 200 },
    );
  });

  it('never introduces Arabic Yeh or Arabic Kaf after normalization', () => {
    fc.assert(
      fc.property(fc.string({ unit: 'binary' }), (input) => {
        const result = normalizePersian(input);
        expect(result).not.toMatch(/[\u064A\u0643\u0649\u06C0]/u);
      }),
      { numRuns: 100 },
    );
  });

  it('whitespace-only input collapses to empty when normalizeWhitespace is on', () => {
    fc.assert(
      fc.property(
        fc.string({ unit: fc.constantFrom(' ', '\t', '\n', '\r', '\u00A0') }),
        (input) => {
          expect(normalizePersian(input, { normalizeWhitespace: true })).toBe(
            '',
          );
        },
      ),
      { numRuns: 50 },
    );
  });

  it('preserves Latin letters and digits when digits are preserve', () => {
    fc.assert(
      fc.property(fc.stringMatching(/^[A-Za-z0-9 .,!?-]*$/), (input) => {
        expect(normalizePersian(input)).toBe(input);
      }),
      { numRuns: 50 },
    );
  });
});

describe('normalizePersian Unicode edge cases', () => {
  it('handles NBSP, BOM, and zero-width characters without crashing', () => {
    const input = `\uFEFFسلام\u00A0دنیا\u200B\u200D`;
    expect(normalizePersian(input)).toBe(input);
    // BOM and NBSP are Unicode whitespace; ZWSP/ZWJ are not, so they remain.
    expect(normalizePersian(input, { normalizeWhitespace: true })).toBe(
      'سلام دنیا\u200B\u200D',
    );
  });

  it('handles supplementary-plane characters (emoji) as opaque content', () => {
    expect(normalizePersian('کیبورد 🎹 تست')).toBe('کیبورد 🎹 تست');
    expect(normalizePersian('كي 🎹', { digits: 'persian' })).toBe('کی 🎹');
  });

  it('handles rare Arabic diacritic ranges when removal is enabled', () => {
    // U+0670 (superscript alef), U+06D6–U+06ED subset used by isArabicDiacritic
    expect(
      normalizePersian('ا\u0670ب\u06D6ج\u06EAد', { removeDiacritics: true }),
    ).toBe('ابجد');
  });

  it('leaves unrelated Arabic letters (أ إ ؤ ة ئ) unchanged', () => {
    expect(normalizePersian('أإؤئة')).toBe('أإؤئة');
  });

  it('collapses ZWNJ next to NBSP as whitespace-adjacent', () => {
    const ZWNJ = '\u200C';
    expect(normalizePersian(`می\u00A0${ZWNJ}روم`)).toBe('می\u00A0روم');
    expect(normalizePersian(`می${ZWNJ}\u00A0روم`)).toBe('می\u00A0روم');
  });
});
