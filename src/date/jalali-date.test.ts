import { describe, expect, it } from 'vitest';

import {
  COMMON_JALALI_YEARS,
  KNOWN_CONVERSIONS,
  LEAP_JALALI_YEARS,
} from './fixtures.js';
import {
  MAX_JALALI_YEAR,
  MIN_JALALI_YEAR,
  isLeapJalaliYear,
  isValidJalaliDate,
} from './jalali-convert.js';
import { formatJalali, toGregorian, toJalali } from './jalali-date.js';

describe('toJalali', () => {
  describe('known conversion fixtures', () => {
    it.each(KNOWN_CONVERSIONS)(
      'converts $label (Gregorian → Jalali)',
      ({ gregorian, jalali }) => {
        expect(
          toJalali(gregorian.year, gregorian.month, gregorian.day),
        ).toEqual(jalali);
      },
    );
  });

  describe('round-trip', () => {
    it.each(KNOWN_CONVERSIONS)(
      'Gregorian → Jalali → Gregorian for $label',
      ({ gregorian, jalali }) => {
        const converted = toJalali(
          gregorian.year,
          gregorian.month,
          gregorian.day,
        );
        expect(converted).toEqual(jalali);
        expect(
          toGregorian(converted.year, converted.month, converted.day),
        ).toEqual(gregorian);
      },
    );

    it.each(KNOWN_CONVERSIONS)(
      'Jalali → Gregorian → Jalali for $label',
      ({ gregorian, jalali }) => {
        const converted = toGregorian(jalali.year, jalali.month, jalali.day);
        expect(converted).toEqual(gregorian);
        expect(
          toJalali(converted.year, converted.month, converted.day),
        ).toEqual(jalali);
      },
    );
  });

  describe('Date input', () => {
    it('reads the civil date in UTC when timeZone is UTC', () => {
      const date = new Date('2024-03-20T23:59:59Z');
      expect(toJalali(date, { timeZone: 'UTC' })).toEqual({
        year: 1403,
        month: 1,
        day: 1,
      });
    });

    it('reads the next civil day in Asia/Tehran for late UTC evening', () => {
      const date = new Date('2024-03-20T23:59:59Z');
      expect(toJalali(date, { timeZone: 'Asia/Tehran' })).toEqual({
        year: 1403,
        month: 1,
        day: 2,
      });
    });

    it('uses local civil date parts when timeZone is omitted', () => {
      const date = new Date(2024, 2, 20);
      expect(toJalali(date)).toEqual({
        year: 1403,
        month: 1,
        day: 1,
      });
    });

    it('throws for an invalid Date', () => {
      expect(() => toJalali(new Date(Number.NaN))).toThrow(RangeError);
      expect(() => toJalali(new Date('not-a-date'))).toThrow(RangeError);
    });
  });

  describe('invalid Gregorian numeric input', () => {
    it('rejects non-integer components', () => {
      expect(() => toJalali(2024, 3.5, 20)).toThrow(RangeError);
      expect(() => toJalali(2024.2, 3, 20)).toThrow(RangeError);
    });

    it('rejects out-of-range month and day', () => {
      expect(() => toJalali(2024, 0, 1)).toThrow(RangeError);
      expect(() => toJalali(2024, 13, 1)).toThrow(RangeError);
      expect(() => toJalali(2024, 1, 0)).toThrow(RangeError);
      expect(() => toJalali(2024, 1, 32)).toThrow(RangeError);
    });

    it('rejects wrong arity', () => {
      expect(() =>
        (toJalali as (value: Date) => unknown)(new Date()),
      ).not.toThrow();
      expect(() =>
        (toJalali as unknown as (year: number, month: number) => unknown)(
          2024,
          3,
        ),
      ).toThrow(TypeError);
    });
  });
});

describe('toGregorian', () => {
  describe('known conversion fixtures', () => {
    it.each(KNOWN_CONVERSIONS)(
      'converts $label (Jalali → Gregorian)',
      ({ gregorian, jalali }) => {
        expect(toGregorian(jalali.year, jalali.month, jalali.day)).toEqual(
          gregorian,
        );
      },
    );
  });

  describe('leap years', () => {
    it.each(LEAP_JALALI_YEARS)('accepts Esfand 30 in leap year %i', (year) => {
      expect(isLeapJalaliYear(year)).toBe(true);
      expect(() => toGregorian(year, 12, 30)).not.toThrow();
      const gregorian = toGregorian(year, 12, 30);
      expect(toJalali(gregorian.year, gregorian.month, gregorian.day)).toEqual({
        year,
        month: 12,
        day: 30,
      });
    });

    it.each(COMMON_JALALI_YEARS)(
      'rejects Esfand 30 in common year %i',
      (year) => {
        expect(isLeapJalaliYear(year)).toBe(false);
        expect(() => toGregorian(year, 12, 30)).toThrow(RangeError);
      },
    );
  });

  describe('invalid Jalali dates', () => {
    it('rejects Esfand 30 in a common year', () => {
      expect(() => toGregorian(1394, 12, 30)).toThrow(RangeError);
    });

    it('rejects month 0 and 13', () => {
      expect(() => toGregorian(1403, 0, 1)).toThrow(RangeError);
      expect(() => toGregorian(1403, 13, 1)).toThrow(RangeError);
    });

    it('rejects day 0', () => {
      expect(() => toGregorian(1403, 1, 0)).toThrow(RangeError);
    });

    it('rejects day 31 in a 30-day month', () => {
      expect(() => toGregorian(1403, 7, 31)).toThrow(RangeError);
    });

    it('rejects out-of-range years', () => {
      expect(() => toGregorian(MIN_JALALI_YEAR - 1, 1, 1)).toThrow(RangeError);
      expect(() => toGregorian(MAX_JALALI_YEAR + 1, 1, 1)).toThrow(RangeError);
    });

    it('rejects non-integer components through validation', () => {
      expect(isValidJalaliDate(1403, 1.5, 1)).toBe(false);
      expect(() => toGregorian(1403, 1.5, 1)).toThrow(RangeError);
    });
  });
});

describe('formatJalali', () => {
  it('formats Jalali parts with the default pattern', () => {
    expect(formatJalali({ year: 1403, month: 1, day: 1 })).toBe('1403/01/01');
  });

  it('supports custom patterns and Persian digits', () => {
    expect(
      formatJalali(
        { year: 1403, month: 1, day: 5 },
        { pattern: 'YYYY-MM-DD', digits: 'persian' },
      ),
    ).toBe('۱۴۰۳-۰۱-۰۵');
  });

  it('supports unpadded M and D tokens', () => {
    expect(
      formatJalali({ year: 1403, month: 1, day: 5 }, { pattern: 'Y-M-D' }),
    ).toBe('Y-1-5');
    expect(
      formatJalali({ year: 1403, month: 1, day: 5 }, { pattern: 'YY/M/D' }),
    ).toBe('03/1/5');
  });

  it('formats from Date input using timeZone', () => {
    expect(
      formatJalali(new Date('2024-03-20T00:00:00Z'), {
        timeZone: 'UTC',
        pattern: 'YYYY-MM-DD',
      }),
    ).toBe('1403-01-01');
  });

  it('throws for invalid Jalali parts', () => {
    expect(() => formatJalali({ year: 1394, month: 12, day: 30 })).toThrow(
      RangeError,
    );
  });

  it('throws for invalid Date input', () => {
    expect(() => formatJalali(new Date(Number.NaN))).toThrow(RangeError);
  });

  it('throws for unsupported input types', () => {
    expect(() =>
      formatJalali(
        null as unknown as { year: number; month: number; day: number },
      ),
    ).toThrow(TypeError);
  });
});

describe('boundary dates', () => {
  it('converts the first supported Jalali day', () => {
    const gregorian = toGregorian(MIN_JALALI_YEAR, 1, 1);
    expect(toJalali(gregorian.year, gregorian.month, gregorian.day)).toEqual({
      year: MIN_JALALI_YEAR,
      month: 1,
      day: 1,
    });
  });

  it('converts the last supported Jalali day', () => {
    const lastDay = isLeapJalaliYear(MAX_JALALI_YEAR) ? 30 : 29;
    const gregorian = toGregorian(MAX_JALALI_YEAR, 12, lastDay);
    expect(toJalali(gregorian.year, gregorian.month, gregorian.day)).toEqual({
      year: MAX_JALALI_YEAR,
      month: 12,
      day: lastDay,
    });
  });

  it('handles month boundaries across the 31-day / 30-day split', () => {
    expect(toJalali(2024, 8, 21)).toEqual({ year: 1403, month: 5, day: 31 });
    expect(toJalali(2024, 8, 22)).toEqual({ year: 1403, month: 6, day: 1 });
  });
});

describe('leap year correctness', () => {
  it.each(LEAP_JALALI_YEARS)('year %i has 30-day Esfand', (year) => {
    expect(isValidJalaliDate(year, 12, 30)).toBe(true);
    expect(isValidJalaliDate(year, 12, 31)).toBe(false);
  });

  it.each(COMMON_JALALI_YEARS)('year %i has 29-day Esfand', (year) => {
    expect(isValidJalaliDate(year, 12, 29)).toBe(true);
    expect(isValidJalaliDate(year, 12, 30)).toBe(false);
  });
});
