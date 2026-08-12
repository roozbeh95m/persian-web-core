import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { formatJalali, toGregorian, toJalali } from './index.js';
import {
  jalaliMonthLength,
  MAX_JALALI_YEAR,
  MIN_JALALI_YEAR,
} from './jalali-convert.js';

const jalaliYearArb = fc.integer({
  min: MIN_JALALI_YEAR,
  max: MAX_JALALI_YEAR,
});

const jalaliDateArb = jalaliYearArb.chain((year) =>
  fc.integer({ min: 1, max: 12 }).chain((month) =>
    fc.integer({ min: 1, max: jalaliMonthLength(year, month) }).map((day) => ({
      year,
      month,
      day,
    })),
  ),
);

describe('Jalali conversion property-based', () => {
  it('Jalali → Gregorian → Jalali is identity within supported range', () => {
    fc.assert(
      fc.property(jalaliDateArb, (jalali) => {
        const gregorian = toGregorian(jalali.year, jalali.month, jalali.day);
        expect(
          toJalali(gregorian.year, gregorian.month, gregorian.day),
        ).toEqual(jalali);
      }),
      { numRuns: 300 },
    );
  });

  it('formatJalali tokens reconstruct year/month/day for non-negative years', () => {
    fc.assert(
      fc.property(
        jalaliDateArb.filter((d) => d.year >= 0),
        (jalali) => {
          const formatted = formatJalali(jalali, { pattern: 'YYYY-MM-DD' });
          const [y, m, d] = formatted.split('-').map(Number);
          expect({ year: y, month: m, day: d }).toEqual(jalali);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('formatJalali preserves the sign of negative Jalali years', () => {
    expect(formatJalali({ year: -1, month: 1, day: 1 })).toBe('-1/01/01');
    expect(
      formatJalali({ year: -1, month: 1, day: 1 }, { pattern: 'YYYY-MM-DD' }),
    ).toBe('-1-01-01');
  });

  it('formatJalali with persian digits round-trips via ASCII pattern length', () => {
    fc.assert(
      fc.property(jalaliDateArb, (jalali) => {
        const ascii = formatJalali(jalali, { pattern: 'YYYY/MM/DD' });
        const persian = formatJalali(jalali, {
          pattern: 'YYYY/MM/DD',
          digits: 'persian',
        });
        expect(persian.length).toBe(ascii.length);
        expect(persian).not.toMatch(/[0-9]/u);
      }),
      { numRuns: 50 },
    );
  });
});

describe('Jalali range and civil-date contracts', () => {
  it('rejects Gregorian dates outside the supported Jalali JDN range', () => {
    expect(() => toJalali(1, 1, 1)).toThrow(RangeError);
    expect(() => toJalali(9999, 1, 1)).toThrow(RangeError);
    expect(() => toJalali(1, 1, 1)).toThrow(
      /outside the supported Jalali range/u,
    );
  });

  it('rejects Jalali years below MIN and above MAX', () => {
    expect(() => toGregorian(MIN_JALALI_YEAR - 1, 1, 1)).toThrow(RangeError);
    expect(() => toGregorian(MAX_JALALI_YEAR + 1, 1, 1)).toThrow(RangeError);
  });

  /**
   * Contract note (documented behavior):
   * Numeric Gregorian overload only checks month ∈ [1,12] and day ∈ [1,31].
   * It does **not** validate civil calendar existence (e.g. 2023-02-30).
   * Such inputs are converted via JDN math and may yield a nearby valid Jalali
   * date rather than throwing. Callers needing civil validation should check
   * before calling.
   */
  it('accepts non-existent Gregorian civil dates when day is 1–31 (documented)', () => {
    expect(toJalali(2023, 2, 30)).toEqual({
      year: 1401,
      month: 12,
      day: 11,
    });
  });

  it('still rejects Gregorian day outside 1–31', () => {
    expect(() => toJalali(2023, 2, 0)).toThrow(RangeError);
    expect(() => toJalali(2023, 2, 32)).toThrow(RangeError);
  });

  it('rejects non-integer Gregorian components', () => {
    expect(() => toJalali(2024.5, 3, 20)).toThrow(RangeError);
    expect(() => toJalali(2024, 3.2, 20)).toThrow(RangeError);
    expect(() => toJalali(2024, 3, 20.1)).toThrow(RangeError);
  });
});
