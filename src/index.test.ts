import { describe, expect, it } from 'vitest';

import * as core from './index.js';
import * as currency from './currency/index.js';
import * as digits from './digits/index.js';
import * as format from './format/index.js';
import * as normalize from './normalize/index.js';
import * as phone from './phone/index.js';

describe('@persian-web/core', () => {
  it('exports digit converters from the root entry', () => {
    expect(core.toPersianDigits).toBeTypeOf('function');
    expect(core.toEnglishDigits).toBeTypeOf('function');
    expect(core.toPersianDigits('123')).toBe('۱۲۳');
    expect(core.toEnglishDigits('۱۲۳')).toBe('123');
  });

  it('re-exports the same functions as @persian-web/core/digits', () => {
    expect(core.toPersianDigits).toBe(digits.toPersianDigits);
    expect(core.toEnglishDigits).toBe(digits.toEnglishDigits);
  });

  it('exports normalizePersian from the root entry', () => {
    expect(core.normalizePersian).toBeTypeOf('function');
    expect(core.normalizePersian('كي')).toBe('کی');
  });

  it('re-exports the same function as @persian-web/core/normalize', () => {
    expect(core.normalizePersian).toBe(normalize.normalizePersian);
  });

  it('exports formatNumber from the root entry', () => {
    expect(core.formatNumber).toBeTypeOf('function');
    expect(core.formatNumber(1234567)).toBe('1,234,567');
  });

  it('re-exports the same function as @persian-web/core/format', () => {
    expect(core.formatNumber).toBe(format.formatNumber);
  });

  it('exports currency formatters from the root entry', () => {
    expect(core.formatCurrency).toBeTypeOf('function');
    expect(core.formatToman).toBeTypeOf('function');
    expect(core.formatRial).toBeTypeOf('function');
    expect(core.formatToman(1_250_000)).toBe('\u200eتومان\u00a0۱٬۲۵۰٬۰۰۰');
  });

  it('re-exports the same functions as @persian-web/core/currency', () => {
    expect(core.formatCurrency).toBe(currency.formatCurrency);
    expect(core.formatToman).toBe(currency.formatToman);
    expect(core.formatRial).toBe(currency.formatRial);
  });

  it('exports phone helpers from the root entry', () => {
    expect(core.normalizePhone).toBeTypeOf('function');
    expect(core.isValidIranianPhone).toBeTypeOf('function');
    expect(core.formatIranianPhone).toBeTypeOf('function');
    expect(core.normalizePhone('09121234567')).toBe('+989121234567');
  });

  it('re-exports the same functions as @persian-web/core/phone', () => {
    expect(core.normalizePhone).toBe(phone.normalizePhone);
    expect(core.isValidIranianPhone).toBe(phone.isValidIranianPhone);
    expect(core.formatIranianPhone).toBe(phone.formatIranianPhone);
  });
});
