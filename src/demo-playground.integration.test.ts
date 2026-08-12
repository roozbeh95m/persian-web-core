/**
 * Integration coverage for every API exercised by the demo playground pages.
 * Keeps demo examples honest: if a playground call breaks, this fails.
 */
import { describe, expect, it } from 'vitest';

import { formatCurrency, formatRial, formatToman } from './currency/index.js';
import {
  formatJalali,
  relativeTime,
  toGregorian,
  toJalali,
} from './date/index.js';
import { toEnglishDigits, toPersianDigits } from './digits/index.js';
import {
  getTextDirection,
  isMixedDirection,
  isRTL,
} from './direction/index.js';
import { formatNumber } from './format/index.js';
import { isValidNationalId, validateNationalId } from './national-id/index.js';
import { normalizePersian } from './normalize/index.js';
import {
  formatIranianPhone,
  isValidIranianPhone,
  normalizePhone,
} from './phone/index.js';
import {
  includesPersian,
  matchesPersian,
  normalizeForSearch,
} from './search/index.js';
import { persianSlug } from './slug/index.js';
import { createPersianCollator, sortPersian } from './sort/index.js';
import { fixPersianTypography } from './typography/index.js';

describe('demo playground APIs', () => {
  it('digits page', () => {
    expect(toPersianDigits('قیمت: 2500 و عربي ٠١٢')).toBe(
      'قیمت: ۲۵۰۰ و عربي ۰۱۲',
    );
    expect(toEnglishDigits('قیمت: ۲۵۰۰')).toBe('قیمت: 2500');
    expect(toPersianDigits(42)).toBe('۴۲');
  });

  it('normalize page', () => {
    const out = normalizePersian('كيلكسيون كلاسيك', {
      digits: 'preserve',
      removeDiacritics: false,
      normalizeWhitespace: false,
    });
    expect(out).toContain('ک');
    expect(out).toContain('ی');
    expect(normalizePersian('')).toBe('');
  });

  it('numbers page', () => {
    expect(
      formatNumber(1_250_000, { locale: 'fa-IR', digits: 'persian' }),
    ).toMatch(/۱/);
    expect(Number.isFinite(Number('not-a-number'))).toBe(false);
  });

  it('currency page', () => {
    expect(
      formatToman(1_250_000, { locale: 'fa-IR', digits: 'persian' }),
    ).toBeTruthy();
    expect(
      formatRial(12_500_000, { locale: 'fa-IR', digits: 'persian' }),
    ).toBeTruthy();
    expect(
      formatCurrency(10, {
        currency: 'USD',
        locale: 'en-US',
        digits: 'english',
      }),
    ).toBeTruthy();
  });

  it('date page — conversion, format, relative, invalid', () => {
    const jalali = toJalali(2024, 3, 20);
    expect(jalali).toEqual({ year: 1403, month: 1, day: 1 });
    expect(toGregorian(1403, 1, 1)).toEqual({
      year: 2024,
      month: 3,
      day: 20,
    });
    expect(
      formatJalali(jalali, { digits: 'persian', pattern: 'YYYY/MM/DD' }),
    ).toBe('۱۴۰۳/۰۱/۰۱');
    expect(() => toJalali(2024, 13, 1)).toThrow();
    expect(() => toGregorian(1403, 12, 31)).toThrow();

    const now = new Date('2024-06-15T12:00:00Z');
    const relative = relativeTime(new Date(now.getTime() - 3 * 60_000), {
      now,
      digits: 'persian',
    });
    expect(relative).toMatch(/دقیقه|۳/);
  });

  it('direction page', () => {
    expect(getTextDirection('سلام دنیا')).toBe('rtl');
    expect(getTextDirection('Hello world 123')).toBe('ltr');
    expect(getTextDirection('Android گوشی ۱۲۳')).toBe('mixed');
    expect(getTextDirection('123 — 456')).toBe('neutral');
    expect(isRTL('سلام دنیا')).toBe(true);
    expect(isMixedDirection('Android گوشی ۱۲۳')).toBe(true);
  });

  it('typography page', () => {
    const fixed = fixPersianTypography('می رود و "سلام"');
    expect(fixed).toContain('\u200C');
  });

  it('search page — catalog filter', () => {
    const catalog = [
      'گوشی موبایل سامسونگ Galaxy S24 Ultra',
      'گوشی سامسونگ كلاسیک B310 با باتری قوی',
      'گوشی اپل iPhone 15 Pro Max',
      'کتاب برنامه‌نویسی JavaScript مدرن',
    ];
    const hits = catalog.filter((item) => includesPersian(item, 'کلاس'));
    expect(hits).toHaveLength(1);
    expect(hits[0]).toContain('كلاسیک');
    expect(matchesPersian('کلاس', 'كلاس')).toBe(true);
    expect(normalizeForSearch('كلاس').length).toBeGreaterThan(0);
  });

  it('sort page — collator reuse', () => {
    const items = ['یوسف', 'آرش', 'بابک', '۱۲', '2', 'کتاب', 'كيان'];
    const collator = createPersianCollator({ numeric: true });
    const sorted = sortPersian(items, { direction: 'asc', collator });
    expect(sorted[0]).toBe('2');
    expect(sorted).toHaveLength(items.length);
  });

  it('slug page', () => {
    expect(persianSlug('راهنمای شروع سریع فارسی').length).toBeGreaterThan(0);
    expect(persianSlug('!!!@@@')).toBe('');
  });

  it('phone page — valid and invalid', () => {
    expect(isValidIranianPhone('۰۹۱۲۱۲۳۴۵۶۷')).toBe(true);
    expect(normalizePhone('۰۹۱۲۱۲۳۴۵۶۷')).toBe('+989121234567');
    expect(
      formatIranianPhone('09121234567', {
        format: 'national',
        digits: 'persian',
      }),
    ).toBe('۰۹۱۲ ۱۲۳ ۴۵۶۷');
    expect(isValidIranianPhone('02112345678')).toBe(false);
    expect(normalizePhone('02112345678')).toBeNull();
    expect(formatIranianPhone('02112345678')).toBeNull();
  });

  it('national-id page — valid and reasons', () => {
    expect(isValidNationalId('0013542419')).toBe(true);
    expect(validateNationalId('0013542419')).toEqual({ valid: true });
    expect(validateNationalId('1234567890').valid).toBe(false);
    expect(validateNationalId('0000000000')).toEqual({
      valid: false,
      reason: 'invalid_repeated_digits',
    });
    expect(validateNationalId('۱۲۳')).toEqual({
      valid: false,
      reason: 'invalid_length',
    });
  });
});
