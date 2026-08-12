import { describe, expect, it } from 'vitest';

import { formatJalali, toGregorian, toJalali } from './date/index.js';
import {
  assertJalaliYear,
  assertValidJalaliDate,
  MAX_JALALI_YEAR,
  MIN_JALALI_YEAR,
} from './date/jalali-convert.js';
import { normalizePersian } from './normalize/index.js';
import { normalizePhone } from './phone/index.js';
import { fixPersianTypography } from './typography/index.js';

describe('internal helper coverage and documented edges', () => {
  describe('jalali-convert asserts', () => {
    it('assertJalaliYear rejects non-finite and out-of-range years', () => {
      expect(() => assertJalaliYear(Number.NaN)).toThrow(RangeError);
      expect(() => assertJalaliYear(Number.POSITIVE_INFINITY)).toThrow(
        RangeError,
      );
      expect(() => assertJalaliYear(MIN_JALALI_YEAR - 1)).toThrow(RangeError);
      expect(() => assertJalaliYear(MAX_JALALI_YEAR + 1)).toThrow(RangeError);
    });

    it('assertValidJalaliDate rejects invalid month and day', () => {
      expect(() => assertValidJalaliDate(1403, 0, 1)).toThrow(/month/u);
      expect(() => assertValidJalaliDate(1403, 13, 1)).toThrow(/month/u);
      expect(() => assertValidJalaliDate(1403, 12, 31)).toThrow(/day/u);
      expect(() => assertValidJalaliDate(1403, 1, 0)).toThrow(/day/u);
      expect(() => assertValidJalaliDate(1403, 1.5, 1)).toThrow(/month/u);
    });

    it('assertValidJalaliDate accepts a valid civil date', () => {
      expect(() => assertValidJalaliDate(1403, 1, 1)).not.toThrow();
      expect(toGregorian(1403, 1, 1)).toEqual({
        year: 2024,
        month: 3,
        day: 20,
      });
    });
  });

  describe('invalid IANA time zone', () => {
    it('surfaces Intl RangeError for unknown time zones', () => {
      // Documented: invalid IANA zones throw from Intl before the
      // Unable-to-read-parts guard; that guard remains a defensive fallback.
      expect(() =>
        toJalali(new Date('2024-03-20T00:00:00Z'), {
          timeZone: 'Not/AZone',
        }),
      ).toThrow(RangeError);
      expect(() =>
        formatJalali(new Date('2024-03-20T00:00:00Z'), {
          timeZone: 'Not/AZone',
        }),
      ).toThrow(RangeError);
    });
  });

  describe('phone sanitize edge', () => {
    it('rejects separator-only input that leaves no digits', () => {
      expect(normalizePhone('+---')).toBeNull();
      expect(normalizePhone('...')).toBeNull();
      expect(normalizePhone('()_-')).toBeNull();
    });
  });

  describe('normalize ZWNJ run collapse branch', () => {
    it('collapses consecutive ZWNJs between letters', () => {
      const ZWNJ = '\u200C';
      expect(normalizePersian(`ا${ZWNJ}${ZWNJ}${ZWNJ}ب`)).toBe(`ا${ZWNJ}ب`);
      expect(fixPersianTypography(`ا${ZWNJ}${ZWNJ}${ZWNJ}ب`)).toBe(`ا${ZWNJ}ب`);
    });
  });

  describe('typography word terminator', () => {
    it('does not join when a Persian word is glued to a non-terminator', () => {
      // "رود" is ≥2 letters but followed by Latin 'a' → not a word boundary.
      expect(fixPersianTypography('می رودa')).toBe('می رودa');
      // Single letter after prefix remains unchanged (length < 2).
      expect(fixPersianTypography('می آ')).toBe('می آ');
    });
  });
});
