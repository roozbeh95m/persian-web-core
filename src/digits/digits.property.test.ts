import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { toEnglishDigits, toPersianDigits } from './index.js';

const ENGLISH = '0123456789';
const ARABIC_INDIC = '٠١٢٣٤٥٦٧٨٩';
const PERSIAN = '۰۱۲۳۴۵۶۷۸۹';

describe('digits property-based', () => {
  it('toPersianDigits is idempotent on any string', () => {
    fc.assert(
      fc.property(fc.string({ unit: 'binary' }), (input) => {
        const once = toPersianDigits(input);
        expect(toPersianDigits(once)).toBe(once);
      }),
      { numRuns: 100 },
    );
  });

  it('toEnglishDigits is idempotent on any string', () => {
    fc.assert(
      fc.property(fc.string({ unit: 'binary' }), (input) => {
        const once = toEnglishDigits(input);
        expect(toEnglishDigits(once)).toBe(once);
      }),
      { numRuns: 100 },
    );
  });

  it('English → Persian → English preserves English digits and non-digits', () => {
    fc.assert(
      fc.property(fc.string({ unit: 'binary' }), (input) => {
        const englishOnly = toEnglishDigits(input);
        expect(toEnglishDigits(toPersianDigits(englishOnly))).toBe(englishOnly);
      }),
      { numRuns: 100 },
    );
  });

  it('maps every English digit code point to Persian and back', () => {
    for (let i = 0; i < 10; i++) {
      const en = ENGLISH[i]!;
      const fa = PERSIAN[i]!;
      expect(toPersianDigits(en)).toBe(fa);
      expect(toEnglishDigits(fa)).toBe(en);
      expect(toEnglishDigits(ARABIC_INDIC[i]!)).toBe(en);
      expect(toPersianDigits(ARABIC_INDIC[i]!)).toBe(fa);
    }
  });

  it('never changes string length for digit-only mapping', () => {
    fc.assert(
      fc.property(fc.string({ unit: 'binary' }), (input) => {
        expect(toPersianDigits(input).length).toBe(input.length);
        expect(toEnglishDigits(input).length).toBe(input.length);
      }),
      { numRuns: 100 },
    );
  });

  it('preserves non-digit Unicode including surrogates and combining marks', () => {
    const samples = [
      'سلام\u0301',
      '🙂🎉',
      '東京',
      'שלום',
      '\uD83D\uDE00abc',
      'A\u0308',
      '\u200B\u200C\u200D',
    ];
    for (const sample of samples) {
      expect(toPersianDigits(sample)).toBe(sample);
      expect(toEnglishDigits(sample)).toBe(sample);
    }
  });

  it('stringifies finite numbers the same as String(value) then maps digits', () => {
    fc.assert(
      fc.property(fc.double({ noNaN: true, noDefaultInfinity: true }), (n) => {
        expect(toPersianDigits(n)).toBe(toPersianDigits(String(n)));
        expect(toEnglishDigits(n)).toBe(toEnglishDigits(String(n)));
      }),
      { numRuns: 50 },
    );
  });
});
