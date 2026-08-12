import { describe, expect, it } from 'vitest';

import { toEnglishDigits, toPersianDigits } from '../digits/index.js';
import { formatNumber } from './format-number.js';

describe('formatNumber', () => {
  describe('default (en-US)', () => {
    it('formats integers with thousands separators', () => {
      expect(formatNumber(1234567)).toBe('1,234,567');
    });

    it('formats zero', () => {
      expect(formatNumber(0)).toBe('0');
    });

    it('formats negative numbers', () => {
      expect(formatNumber(-1234567)).toBe('-1,234,567');
    });

    it('formats decimal values', () => {
      expect(formatNumber(1234.56)).toBe('1,234.56');
    });
  });

  describe('fa-IR locale', () => {
    it('uses Persian digits and Persian grouping separators', () => {
      expect(formatNumber(1234567, { locale: 'fa-IR' })).toBe('۱٬۲۳۴٬۵۶۷');
    });

    it('uses the Arabic decimal separator for fractional values', () => {
      const result = formatNumber(1234.56, { locale: 'fa-IR' });
      expect(result).toContain('٫');
      expect(toEnglishDigits(result)).toBe('1٬234٫56');
    });

    it('formats negative fa-IR values', () => {
      const result = formatNumber(-1234.56, { locale: 'fa-IR' });
      expect(result).toContain('−');
      expect(toEnglishDigits(result)).toBe('\u200e−1٬234٫56');
    });

    it('formats zero with Persian digits', () => {
      expect(formatNumber(0, { locale: 'fa-IR' })).toBe('۰');
    });
  });

  describe('digit script override', () => {
    it('converts en-US output to Persian digits', () => {
      expect(formatNumber(1234567, { digits: 'persian' })).toBe('۱,۲۳۴,۵۶۷');
    });

    it('converts fa-IR output to English digits', () => {
      expect(
        formatNumber(1234567, { locale: 'fa-IR', digits: 'english' }),
      ).toBe('1٬234٬567');
    });
  });

  describe('grouping', () => {
    it('can disable thousands separators', () => {
      expect(formatNumber(1234567, { useGrouping: false })).toBe('1234567');
      expect(
        formatNumber(1234567, { locale: 'fa-IR', useGrouping: false }),
      ).toBe('۱۲۳۴۵۶۷');
    });
  });

  describe('decimal precision', () => {
    it('supports fixed precision', () => {
      expect(formatNumber(1.2, { precision: 2 })).toBe('1.20');
      expect(formatNumber(1.2345, { precision: 2 })).toBe('1.23');
    });

    it('supports minimum and maximum fraction digits', () => {
      expect(
        formatNumber(1.2, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 3,
        }),
      ).toBe('1.2');
      expect(
        formatNumber(1.23456, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }),
      ).toBe('1.23');
    });

    it('prefers precision over min/max fraction digits', () => {
      expect(
        formatNumber(1.2345, {
          precision: 1,
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        }),
      ).toBe('1.2');
    });

    it('supports only minimumFractionDigits', () => {
      expect(formatNumber(1, { minimumFractionDigits: 2 })).toBe('1.00');
    });

    it('supports only maximumFractionDigits', () => {
      expect(formatNumber(1.239, { maximumFractionDigits: 2 })).toBe('1.24');
    });

    it('formats fa-IR decimals with precision', () => {
      const result = formatNumber(1.2, { locale: 'fa-IR', precision: 2 });
      expect(toEnglishDigits(result)).toBe('1٫20');
    });
  });

  describe('compact notation', () => {
    it('formats compact English output', () => {
      expect(formatNumber(1_200_000, { notation: 'compact' })).toBe('1.2M');
      expect(formatNumber(987, { notation: 'compact' })).toBe('987');
    });

    it('formats compact fa-IR output', () => {
      const result = formatNumber(1_200_000, {
        locale: 'fa-IR',
        notation: 'compact',
      });
      expect(toEnglishDigits(result)).toBe('1٫2\u00a0میلیون');
      expect(result).toMatch(/میلیون/);
    });

    it('supports long compact display', () => {
      const result = formatNumber(1_200_000, {
        locale: 'fa-IR',
        notation: 'compact',
        compactDisplay: 'long',
      });
      expect(result).toMatch(/میلیون/);
    });

    it('distinguishes short vs long compact display in en-US', () => {
      expect(
        formatNumber(1_200_000, {
          notation: 'compact',
          compactDisplay: 'short',
        }),
      ).toBe('1.2M');
      expect(
        formatNumber(1_200_000, {
          notation: 'compact',
          compactDisplay: 'long',
        }),
      ).toBe('1.2 million');
    });
  });

  describe('non-finite values', () => {
    it('formats NaN in en-US', () => {
      expect(formatNumber(Number.NaN)).toBe('NaN');
    });

    it('formats NaN in fa-IR', () => {
      expect(formatNumber(Number.NaN, { locale: 'fa-IR' })).toBe('ناعدد');
    });

    it('formats Infinity in en-US', () => {
      expect(formatNumber(Number.POSITIVE_INFINITY)).toBe('∞');
    });

    it('formats Infinity in fa-IR', () => {
      expect(formatNumber(Number.POSITIVE_INFINITY, { locale: 'fa-IR' })).toBe(
        '∞',
      );
    });

    it('formats negative Infinity', () => {
      expect(formatNumber(Number.NEGATIVE_INFINITY)).toBe('-∞');
      expect(formatNumber(Number.NEGATIVE_INFINITY, { locale: 'fa-IR' })).toBe(
        '\u200e−∞',
      );
    });

    it('applies digit overrides to non-finite values when possible', () => {
      expect(formatNumber(Number.NaN, { digits: 'persian' })).toBe('NaN');
      expect(
        formatNumber(Number.POSITIVE_INFINITY, {
          locale: 'fa-IR',
          digits: 'english',
        }),
      ).toBe('∞');
    });
  });

  describe('very large numbers', () => {
    it('formats values beyond Number.MAX_SAFE_INTEGER', () => {
      expect(formatNumber(1e21)).toBe('1,000,000,000,000,000,000,000');
      expect(formatNumber(1e21, { locale: 'fa-IR' })).toBe(
        '۱٬۰۰۰٬۰۰۰٬۰۰۰٬۰۰۰٬۰۰۰٬۰۰۰٬۰۰۰',
      );
    });

    it('formats Number.MAX_VALUE without throwing', () => {
      expect(() => formatNumber(Number.MAX_VALUE)).not.toThrow();
      expect(formatNumber(Number.MAX_VALUE)).toMatch(/,/);
    });
  });

  describe('edge cases', () => {
    it('formats negative zero', () => {
      expect(formatNumber(-0)).toBe('-0');
    });

    it('does not mutate the input number', () => {
      const value = 1234.5;
      formatNumber(value);
      expect(value).toBe(1234.5);
    });
  });
});

describe('formatNumber module isolation', () => {
  it('does not re-export unrelated modules', async () => {
    const formatModule = await import('./index.js');
    expect(Object.keys(formatModule).sort()).toEqual(['formatNumber']);
  });

  it('uses digits helpers only for script conversion', () => {
    expect(toPersianDigits('1,234')).toBe('۱,۲۳۴');
    expect(toEnglishDigits('۱٬۲۳۴')).toBe('1٬234');
  });
});
