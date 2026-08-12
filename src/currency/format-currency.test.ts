import { describe, expect, it } from 'vitest';

import { toEnglishDigits, toPersianDigits } from '../digits/index.js';
import { formatCurrency, formatRial, formatToman } from './format-currency.js';

describe('formatCurrency', () => {
  describe('IRT (toman)', () => {
    it('formats tomans with default fa-IR locale', () => {
      const result = formatCurrency(1_250_000, { currency: 'IRT' });
      expect(result).toBe('\u200eتومان\u00a0۱٬۲۵۰٬۰۰۰');
    });

    it('formats tomans in en-US locale', () => {
      const result = formatCurrency(1_250_000, {
        currency: 'IRT',
        locale: 'en-US',
      });
      expect(result).toBe('IRT\u00a01,250,000');
    });

    it('does not convert tomans to rials', () => {
      const toman = formatCurrency(1_250_000, { currency: 'IRT' });
      const rial = formatCurrency(12_500_000, { currency: 'IRR' });
      expect(toEnglishDigits(toman)).toBe('\u200eتومان\u00a01٬250٬000');
      expect(toEnglishDigits(rial)).toBe('\u200eریال\u00a012٬500٬000');
    });
  });

  describe('IRR (rial)', () => {
    it('formats rials with default fa-IR locale', () => {
      const result = formatCurrency(12_500_000, { currency: 'IRR' });
      expect(result).toBe('\u200eریال\u00a0۱۲٬۵۰۰٬۰۰۰');
    });

    it('formats rials in en-US locale', () => {
      const result = formatCurrency(12_500_000, {
        currency: 'IRR',
        locale: 'en-US',
      });
      expect(result).toBe('IRR\u00a012,500,000');
    });
  });

  describe('USD and EUR', () => {
    it('formats USD with two decimal places by default', () => {
      expect(
        formatCurrency(1_250.5, { currency: 'USD', locale: 'en-US' }),
      ).toBe('$1,250.50');
      expect(formatCurrency(10, { currency: 'USD', locale: 'en-US' })).toBe(
        '$10.00',
      );
    });

    it('formats EUR with two decimal places by default', () => {
      expect(formatCurrency(99.99, { currency: 'EUR', locale: 'en-US' })).toBe(
        '€99.99',
      );
    });

    it('formats USD in fa-IR locale with Persian digits', () => {
      const result = formatCurrency(1_250.5, { currency: 'USD' });
      expect(toEnglishDigits(result)).toBe('\u200e$1٬250٫50');
    });
  });

  describe('zero', () => {
    it('formats zero tomans', () => {
      expect(formatCurrency(0, { currency: 'IRT' })).toBe('\u200eتومان\u00a0۰');
    });

    it('formats zero rials', () => {
      expect(formatCurrency(0, { currency: 'IRR' })).toBe('\u200eریال\u00a0۰');
    });

    it('formats zero USD', () => {
      expect(formatCurrency(0, { currency: 'USD', locale: 'en-US' })).toBe(
        '$0.00',
      );
    });
  });

  describe('negative values', () => {
    it('formats negative tomans in fa-IR', () => {
      const result = formatCurrency(-1_250_000, { currency: 'IRT' });
      expect(result).toContain('\u2212');
      expect(toEnglishDigits(result)).toBe(
        '\u200e\u2212\u200eتومان\u00a01٬250٬000',
      );
    });

    it('formats negative tomans in en-US', () => {
      expect(
        formatCurrency(-1_250_000, { currency: 'IRT', locale: 'en-US' }),
      ).toBe('-IRT\u00a01,250,000');
    });

    it('formats negative rials', () => {
      const result = formatCurrency(-12_500_000, { currency: 'IRR' });
      expect(toEnglishDigits(result)).toBe(
        '\u200e\u2212\u200eریال\u00a012٬500٬000',
      );
    });

    it('formats negative USD', () => {
      expect(formatCurrency(-12.5, { currency: 'USD', locale: 'en-US' })).toBe(
        '-$12.50',
      );
    });
  });

  describe('large values', () => {
    it('formats very large toman amounts', () => {
      const result = formatCurrency(1e12, { currency: 'IRT' });
      expect(toEnglishDigits(result)).toBe(
        '\u200eتومان\u00a01٬000٬000٬000٬000',
      );
    });

    it('formats Number.MAX_VALUE without throwing', () => {
      expect(() =>
        formatCurrency(Number.MAX_VALUE, { currency: 'IRR' }),
      ).not.toThrow();
    });
  });

  describe('decimals', () => {
    it('rounds IRR fractional rials by default', () => {
      const result = formatCurrency(1_250.5, { currency: 'IRR' });
      expect(toEnglishDigits(result)).toBe('\u200eریال\u00a01٬251');
    });

    it('supports explicit precision for tomans', () => {
      const result = formatCurrency(1_250.5, {
        currency: 'IRT',
        precision: 2,
      });
      expect(toEnglishDigits(result)).toBe('\u200eتومان\u00a01٬250٫50');
    });

    it('supports min/max fraction digits for USD', () => {
      expect(
        formatCurrency(12.3, {
          currency: 'USD',
          locale: 'en-US',
          minimumFractionDigits: 0,
          maximumFractionDigits: 1,
        }),
      ).toBe('$12.3');
    });
  });

  describe('digit script override', () => {
    it('converts fa-IR output to English digits', () => {
      expect(
        formatCurrency(1_250_000, { currency: 'IRT', digits: 'english' }),
      ).toBe('\u200eتومان\u00a01٬250٬000');
    });

    it('converts en-US output to Persian digits', () => {
      expect(
        formatCurrency(1_250_000, {
          currency: 'IRT',
          locale: 'en-US',
          digits: 'persian',
        }),
      ).toBe('IRT\u00a0۱,۲۵۰,۰۰۰');
    });
  });

  describe('currencyDisplay', () => {
    it('supports IRT code display', () => {
      expect(
        formatCurrency(1_250_000, { currency: 'IRT', currencyDisplay: 'code' }),
      ).toBe('\u200eIRT\u00a0۱٬۲۵۰٬۰۰۰');
    });

    it('supports IRT name display in fa-IR', () => {
      const result = formatCurrency(1_250_000, {
        currency: 'IRT',
        currencyDisplay: 'name',
      });
      expect(result).toBe('\u200e۱٬۲۵۰٬۰۰۰\u00a0تومان');
    });

    it('supports IRT name display in en-US', () => {
      expect(
        formatCurrency(1_250_000, {
          currency: 'IRT',
          locale: 'en-US',
          currencyDisplay: 'name',
        }),
      ).toBe('1,250,000\u00a0tomans');
    });

    it('supports IRR name display through Intl', () => {
      const result = formatCurrency(12_500_000, {
        currency: 'IRR',
        currencyDisplay: 'name',
      });
      expect(result).toBe('۱۲٬۵۰۰٬۰۰۰ ریال ایران');
    });
  });

  describe('non-finite values', () => {
    it('formats NaN for IRR through Intl', () => {
      expect(formatCurrency(Number.NaN, { currency: 'IRR' })).toBe(
        '\u200eریالناعدد',
      );
    });

    it('formats Infinity for USD', () => {
      expect(
        formatCurrency(Number.POSITIVE_INFINITY, {
          currency: 'USD',
          locale: 'en-US',
        }),
      ).toBe('$∞');
    });

    it('formats NaN for IRT with manual label layout', () => {
      const result = formatCurrency(Number.NaN, { currency: 'IRT' });
      expect(result).toBe('\u200eتومان\u00a0ناعدد');
    });

    it('formats negative Infinity for IRT', () => {
      const result = formatCurrency(Number.NEGATIVE_INFINITY, {
        currency: 'IRT',
      });
      expect(result).toBe('\u200e\u2212\u200eتومان\u00a0∞');
    });
  });

  describe('edge cases', () => {
    it('formats negative zero USD', () => {
      expect(formatCurrency(-0, { currency: 'USD', locale: 'en-US' })).toBe(
        '-$0.00',
      );
    });

    it('does not mutate the input number', () => {
      const value = 1_250_000;
      formatCurrency(value, { currency: 'IRT' });
      expect(value).toBe(1_250_000);
    });
  });
});

describe('formatToman', () => {
  it('formats tomans with default options', () => {
    expect(formatToman(1_250_000)).toBe('\u200eتومان\u00a0۱٬۲۵۰٬۰۰۰');
  });

  it('accepts locale and digit overrides', () => {
    expect(formatToman(1_250_000, { locale: 'en-US', digits: 'persian' })).toBe(
      'IRT\u00a0۱,۲۵۰,۰۰۰',
    );
  });

  it('is equivalent to formatCurrency with IRT', () => {
    expect(formatToman(1_250_000)).toBe(
      formatCurrency(1_250_000, { currency: 'IRT' }),
    );
  });
});

describe('formatRial', () => {
  it('formats rials with default options', () => {
    expect(formatRial(12_500_000)).toBe('\u200eریال\u00a0۱۲٬۵۰۰٬۰۰۰');
  });

  it('accepts locale and digit overrides', () => {
    expect(formatRial(12_500_000, { locale: 'en-US' })).toBe(
      'IRR\u00a012,500,000',
    );
  });

  it('is equivalent to formatCurrency with IRR', () => {
    expect(formatRial(12_500_000)).toBe(
      formatCurrency(12_500_000, { currency: 'IRR' }),
    );
  });
});

describe('formatCurrency module isolation', () => {
  it('does not re-export unrelated modules', async () => {
    const currencyModule = await import('./index.js');
    expect(Object.keys(currencyModule).sort()).toEqual([
      'formatCurrency',
      'formatRial',
      'formatToman',
    ]);
  });

  it('uses digits helpers only for script conversion', () => {
    expect(toPersianDigits('1,234')).toBe('۱,۲۳۴');
    expect(toEnglishDigits('۱٬۲۳۴')).toBe('1٬234');
  });
});
