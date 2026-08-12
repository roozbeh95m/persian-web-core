import { describe, expect, it } from 'vitest';

import { toEnglishDigits } from '../digits/to-english-digits.js';
import { relativeTime } from './relative-time.js';

/** Fixed reference instant for deterministic tests. */
const NOW = new Date('2024-06-15T12:00:00.000Z');

function atOffset(ms: number): Date {
  return new Date(NOW.getTime() + ms);
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

describe('relativeTime', () => {
  describe('past', () => {
    it('formats seconds ago', () => {
      expect(relativeTime(atOffset(-45 * SECOND), { now: NOW })).toBe(
        '۴۵ ثانیه پیش',
      );
    });

    it('formats minutes ago', () => {
      expect(relativeTime(atOffset(-3 * MINUTE), { now: NOW })).toBe(
        '۳ دقیقه پیش',
      );
    });

    it('formats hours ago', () => {
      expect(relativeTime(atOffset(-2 * HOUR), { now: NOW })).toBe(
        '۲ ساعت پیش',
      );
    });

    it('formats yesterday with numeric auto', () => {
      expect(relativeTime(atOffset(-1 * DAY), { now: NOW })).toBe('دیروز');
    });

    it('formats days ago beyond special phrases', () => {
      expect(relativeTime(atOffset(-3 * DAY), { now: NOW })).toBe(
        '۳ روز پیش',
      );
    });

    it('formats weeks ago', () => {
      expect(relativeTime(atOffset(-2 * WEEK), { now: NOW })).toBe(
        '۲ هفته پیش',
      );
    });

    it('formats months ago', () => {
      expect(relativeTime(atOffset(-60 * DAY), { now: NOW })).toBe(
        '۲ ماه پیش',
      );
    });

    it('formats years ago', () => {
      expect(relativeTime(atOffset(-400 * DAY), { now: NOW })).toBe(
        'سال گذشته',
      );
    });
  });

  describe('future', () => {
    it('formats seconds ahead', () => {
      expect(relativeTime(atOffset(45 * SECOND), { now: NOW })).toBe(
        '۴۵ ثانیه بعد',
      );
    });

    it('formats minutes ahead', () => {
      expect(relativeTime(atOffset(5 * MINUTE), { now: NOW })).toBe(
        '۵ دقیقه بعد',
      );
    });

    it('formats hours ahead', () => {
      expect(relativeTime(atOffset(3 * HOUR), { now: NOW })).toBe(
        '۳ ساعت بعد',
      );
    });

    it('formats tomorrow with numeric auto', () => {
      expect(relativeTime(atOffset(1 * DAY), { now: NOW })).toBe('فردا');
    });

    it('formats days ahead beyond special phrases', () => {
      expect(relativeTime(atOffset(3 * DAY), { now: NOW })).toBe(
        '۳ روز دیگر',
      );
    });

    it('formats weeks ahead', () => {
      expect(relativeTime(atOffset(2 * WEEK), { now: NOW })).toBe(
        '۲ هفته بعد',
      );
    });

    it('formats months ahead', () => {
      expect(relativeTime(atOffset(60 * DAY), { now: NOW })).toBe(
        '۲ ماه بعد',
      );
    });

    it('formats years ahead', () => {
      expect(relativeTime(atOffset(400 * DAY), { now: NOW })).toBe(
        'سال آینده',
      );
    });
  });

  describe('unit thresholds', () => {
    it('uses seconds below one minute', () => {
      expect(relativeTime(atOffset(-59 * SECOND), { now: NOW })).toBe(
        '۵۹ ثانیه پیش',
      );
    });

    it('switches to minutes at one minute', () => {
      expect(relativeTime(atOffset(-60 * SECOND), { now: NOW })).toBe(
        '۱ دقیقه پیش',
      );
    });

    it('rounds 90 seconds to one minute', () => {
      expect(relativeTime(atOffset(-90 * SECOND), { now: NOW })).toBe(
        '۱ دقیقه پیش',
      );
    });

    it('uses minutes below one hour', () => {
      expect(relativeTime(atOffset(-59 * MINUTE), { now: NOW })).toBe(
        '۵۹ دقیقه پیش',
      );
    });

    it('switches to hours at one hour', () => {
      expect(relativeTime(atOffset(-60 * MINUTE), { now: NOW })).toBe(
        '۱ ساعت پیش',
      );
    });

    it('uses hours below one day', () => {
      expect(relativeTime(atOffset(-23 * HOUR), { now: NOW })).toBe(
        '۲۳ ساعت پیش',
      );
    });

    it('switches to days at one day', () => {
      expect(relativeTime(atOffset(-24 * HOUR), { now: NOW })).toBe('دیروز');
    });

    it('uses days below one week', () => {
      expect(relativeTime(atOffset(-6 * DAY), { now: NOW })).toBe('۶ روز پیش');
    });

    it('switches to weeks at one week', () => {
      expect(relativeTime(atOffset(-7 * DAY), { now: NOW })).toBe(
        'هفتهٔ گذشته',
      );
    });

    it('uses weeks below roughly one month', () => {
      expect(relativeTime(atOffset(-3 * WEEK), { now: NOW })).toBe(
        '۳ هفته پیش',
      );
    });
  });

  describe('same instant', () => {
    it('formats equal dates as now', () => {
      expect(relativeTime(NOW, { now: NOW })).toBe('اکنون');
    });

    it('formats sub-second differences as now when rounded to zero seconds', () => {
      expect(relativeTime(atOffset(200), { now: NOW })).toBe('اکنون');
      expect(relativeTime(atOffset(-200), { now: NOW })).toBe('اکنون');
    });
  });

  describe('numeric option', () => {
    it('defaults to auto locale phrases for nearby days', () => {
      expect(relativeTime(atOffset(1 * DAY), { now: NOW })).toBe('فردا');
      expect(relativeTime(atOffset(-1 * DAY), { now: NOW })).toBe('دیروز');
      expect(relativeTime(atOffset(2 * DAY), { now: NOW })).toBe('پس‌فردا');
      expect(relativeTime(atOffset(-2 * DAY), { now: NOW })).toBe('پریروز');
    });

    it('uses always for numeric day values', () => {
      expect(
        relativeTime(atOffset(1 * DAY), { now: NOW, numeric: 'always' }),
      ).toBe('۱ روز دیگر');
      expect(
        relativeTime(atOffset(-1 * DAY), { now: NOW, numeric: 'always' }),
      ).toBe('۱ روز پیش');
    });

    it('keeps numeric minute/hour strings under always', () => {
      expect(
        relativeTime(atOffset(-3 * MINUTE), {
          now: NOW,
          numeric: 'always',
        }),
      ).toBe('۳ دقیقه پیش');
      expect(
        relativeTime(atOffset(2 * HOUR), { now: NOW, numeric: 'always' }),
      ).toBe('۲ ساعت بعد');
    });
  });

  describe('digits', () => {
    it('defaults to Persian digits', () => {
      const result = relativeTime(atOffset(-3 * MINUTE), { now: NOW });
      expect(result).toBe('۳ دقیقه پیش');
      expect(result).toMatch(/[۰-۹]/);
      expect(result).not.toMatch(/[0-9]/);
    });

    it('supports explicit Persian digits', () => {
      expect(
        relativeTime(atOffset(-12 * HOUR), {
          now: NOW,
          digits: 'persian',
        }),
      ).toBe('۱۲ ساعت پیش');
    });

    it('supports English digits', () => {
      expect(
        relativeTime(atOffset(-3 * MINUTE), {
          now: NOW,
          digits: 'english',
        }),
      ).toBe('3 دقیقه پیش');
      expect(
        relativeTime(atOffset(2 * WEEK), {
          now: NOW,
          digits: 'english',
        }),
      ).toBe('2 هفته بعد');
    });

    it('leaves non-numeric phrases unchanged when converting digits', () => {
      expect(
        relativeTime(atOffset(1 * DAY), { now: NOW, digits: 'english' }),
      ).toBe('فردا');
      expect(
        relativeTime(atOffset(1 * DAY), { now: NOW, digits: 'persian' }),
      ).toBe('فردا');
    });

    it('english digits round-trip from the default Persian output', () => {
      const persian = relativeTime(atOffset(-45 * SECOND), { now: NOW });
      const english = relativeTime(atOffset(-45 * SECOND), {
        now: NOW,
        digits: 'english',
      });
      expect(toEnglishDigits(persian)).toBe(english);
    });
  });

  describe('timezone behavior', () => {
    it('depends only on absolute instants, not civil time zones', () => {
      // Same UTC instants; wall-clock labels in Tehran vs UTC differ, but the
      // millisecond delta (and therefore relativeTime) is identical.
      const tehranLikeLocal = new Date('2024-06-15T15:30:00+03:30');
      const utcInstant = new Date('2024-06-15T12:00:00.000Z');
      expect(tehranLikeLocal.getTime()).toBe(utcInstant.getTime());

      const past = new Date(utcInstant.getTime() - 2 * HOUR);
      expect(relativeTime(past, { now: utcInstant })).toBe('۲ ساعت پیش');
      expect(relativeTime(past, { now: tehranLikeLocal })).toBe(
        '۲ ساعت پیش',
      );
    });

    it('is unchanged when the same delta crosses a civil midnight', () => {
      // 23:30 UTC vs 00:30 UTC next day — different calendar days everywhere,
      // but a 1-hour absolute delta stays “۱ ساعت بعد”.
      const evening = new Date('2024-06-15T23:30:00.000Z');
      const nextMorning = new Date('2024-06-16T00:30:00.000Z');
      expect(relativeTime(nextMorning, { now: evening })).toBe('۱ ساعت بعد');
    });
  });

  describe('invalid dates', () => {
    it('throws RangeError for an invalid target date', () => {
      expect(() => relativeTime(new Date(Number.NaN), { now: NOW })).toThrow(
        RangeError,
      );
      expect(() => relativeTime(new Date('not-a-date'), { now: NOW })).toThrow(
        RangeError,
      );
    });

    it('throws RangeError for an invalid now option', () => {
      expect(() =>
        relativeTime(NOW, { now: new Date(Number.NaN) }),
      ).toThrow(RangeError);
      expect(() =>
        relativeTime(NOW, { now: new Date('not-a-date') }),
      ).toThrow(RangeError);
    });

    it('rejects non-Date values via instanceof check', () => {
      expect(() =>
        relativeTime({ getTime: () => NOW.getTime() } as Date, {
          now: NOW,
        }),
      ).toThrow(RangeError);
    });

    it('mentions which argument was invalid', () => {
      expect(() => relativeTime(new Date(Number.NaN), { now: NOW })).toThrow(
        /date must be a valid Date/,
      );
      expect(() =>
        relativeTime(NOW, { now: new Date(Number.NaN) }),
      ).toThrow(/options\.now must be a valid Date/);
    });
  });

  describe('now option', () => {
    it('defaults to the current time when now is omitted', () => {
      const almostNow = new Date(Date.now() - 2 * MINUTE);
      expect(relativeTime(almostNow)).toBe('۲ دقیقه پیش');
    });

    it('uses the provided now for both past and future', () => {
      const customNow = new Date('2020-01-01T00:00:00.000Z');
      expect(
        relativeTime(new Date('2019-12-31T23:00:00.000Z'), {
          now: customNow,
        }),
      ).toBe('۱ ساعت پیش');
      expect(
        relativeTime(new Date('2020-01-01T00:05:00.000Z'), {
          now: customNow,
        }),
      ).toBe('۵ دقیقه بعد');
    });
  });

  describe('documented examples', () => {
    it('matches the README-style examples', () => {
      expect(relativeTime(atOffset(-3 * MINUTE), { now: NOW })).toBe(
        '۳ دقیقه پیش',
      );
      expect(relativeTime(atOffset(-2 * HOUR), { now: NOW })).toBe(
        '۲ ساعت پیش',
      );
      expect(relativeTime(atOffset(1 * DAY), { now: NOW })).toBe('فردا');
      expect(relativeTime(atOffset(2 * WEEK), { now: NOW })).toBe(
        '۲ هفته بعد',
      );
    });
  });
});
