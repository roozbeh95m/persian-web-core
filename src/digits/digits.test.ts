import { describe, expect, it } from 'vitest';

import { toEnglishDigits, toPersianDigits } from './index.js';

const ENGLISH = '0123456789';
const ARABIC_INDIC = '٠١٢٣٤٥٦٧٨٩';
const PERSIAN = '۰۱۲۳۴۵۶۷۸۹';

describe('toPersianDigits', () => {
  it('converts English digits to Persian', () => {
    expect(toPersianDigits(ENGLISH)).toBe(PERSIAN);
    expect(toPersianDigits('123')).toBe('۱۲۳');
  });

  it('converts Arabic-Indic digits to Persian', () => {
    expect(toPersianDigits(ARABIC_INDIC)).toBe(PERSIAN);
    expect(toPersianDigits('٠١٢')).toBe('۰۱۲');
  });

  it('leaves Persian digits unchanged', () => {
    expect(toPersianDigits(PERSIAN)).toBe(PERSIAN);
    expect(toPersianDigits('۱۲۳')).toBe('۱۲۳');
  });

  it('handles empty strings', () => {
    expect(toPersianDigits('')).toBe('');
  });

  it('preserves mixed text and non-digit characters', () => {
    expect(toPersianDigits('قیمت: 2500 تومان')).toBe('قیمت: ۲۵۰۰ تومان');
    expect(toPersianDigits('Order #42-A')).toBe('Order #۴۲-A');
  });

  it('preserves punctuation', () => {
    expect(toPersianDigits('1,234.56!')).toBe('۱,۲۳۴.۵۶!');
    expect(toPersianDigits('(100%)')).toBe('(۱۰۰%)');
  });

  it('handles decimal numbers', () => {
    expect(toPersianDigits('3.14')).toBe('۳.۱۴');
    expect(toPersianDigits(3.14)).toBe('۳.۱۴');
    expect(toPersianDigits(0.5)).toBe('۰.۵');
  });

  it('handles negative numbers', () => {
    expect(toPersianDigits('-42')).toBe('-۴۲');
    expect(toPersianDigits(-42)).toBe('-۴۲');
    expect(toPersianDigits(-3.5)).toBe('-۳.۵');
  });

  it('handles integer numbers', () => {
    expect(toPersianDigits(0)).toBe('۰');
    expect(toPersianDigits(9876543210)).toBe('۹۸۷۶۵۴۳۲۱۰');
  });

  it('converts mixed digit scripts in one string', () => {
    expect(toPersianDigits('1٢۳')).toBe('۱۲۳');
    expect(
      toPersianDigits(`EN:${ENGLISH} AR:${ARABIC_INDIC} FA:${PERSIAN}`),
    ).toBe(`EN:${PERSIAN} AR:${PERSIAN} FA:${PERSIAN}`);
  });

  it('does not mutate the input string', () => {
    const input = 'abc123';
    const copy = input;
    toPersianDigits(input);
    expect(input).toBe(copy);
    expect(input).toBe('abc123');
  });

  it('returns the same string reference when nothing changes', () => {
    const input = 'hello';
    expect(toPersianDigits(input)).toBe(input);
    const persian = 'سال ۱۴۰۳';
    expect(toPersianDigits(persian)).toBe(persian);
  });
});

describe('toEnglishDigits', () => {
  it('converts Persian digits to English', () => {
    expect(toEnglishDigits(PERSIAN)).toBe(ENGLISH);
    expect(toEnglishDigits('۱۲۳')).toBe('123');
  });

  it('converts Arabic-Indic digits to English', () => {
    expect(toEnglishDigits(ARABIC_INDIC)).toBe(ENGLISH);
    expect(toEnglishDigits('٠١٢')).toBe('012');
  });

  it('leaves English digits unchanged', () => {
    expect(toEnglishDigits(ENGLISH)).toBe(ENGLISH);
    expect(toEnglishDigits('123')).toBe('123');
  });

  it('handles empty strings', () => {
    expect(toEnglishDigits('')).toBe('');
  });

  it('preserves mixed text and non-digit characters', () => {
    expect(toEnglishDigits('قیمت: ۲۵۰۰ تومان')).toBe('قیمت: 2500 تومان');
    expect(toEnglishDigits('Order #۴۲-A')).toBe('Order #42-A');
  });

  it('preserves punctuation', () => {
    expect(toEnglishDigits('۱,۲۳۴.۵۶!')).toBe('1,234.56!');
    expect(toEnglishDigits('(۱۰۰%)')).toBe('(100%)');
  });

  it('handles decimal numbers', () => {
    expect(toEnglishDigits('۳.۱۴')).toBe('3.14');
    expect(toEnglishDigits(3.14)).toBe('3.14');
    expect(toEnglishDigits('٠.٥')).toBe('0.5');
  });

  it('handles negative numbers', () => {
    expect(toEnglishDigits('-۴۲')).toBe('-42');
    expect(toEnglishDigits(-42)).toBe('-42');
    expect(toEnglishDigits('-٣.٥')).toBe('-3.5');
  });

  it('handles integer numbers', () => {
    expect(toEnglishDigits(0)).toBe('0');
    expect(toEnglishDigits(9876543210)).toBe('9876543210');
  });

  it('converts mixed digit scripts in one string', () => {
    expect(toEnglishDigits('1٢۳')).toBe('123');
    expect(
      toEnglishDigits(`EN:${ENGLISH} AR:${ARABIC_INDIC} FA:${PERSIAN}`),
    ).toBe(`EN:${ENGLISH} AR:${ENGLISH} FA:${ENGLISH}`);
  });

  it('does not mutate the input string', () => {
    const input = 'abc۱۲۳';
    const snapshot = input.slice();
    toEnglishDigits(input);
    expect(input).toBe(snapshot);
    expect(input).toBe('abc۱۲۳');
  });

  it('returns the same string reference when nothing changes', () => {
    const input = 'hello';
    expect(toEnglishDigits(input)).toBe(input);
    const english = 'year 2024';
    expect(toEnglishDigits(english)).toBe(english);
  });
});

describe('round-trip', () => {
  it('English → Persian → English', () => {
    expect(toEnglishDigits(toPersianDigits(ENGLISH))).toBe(ENGLISH);
    expect(toEnglishDigits(toPersianDigits('Price: 99.99'))).toBe(
      'Price: 99.99',
    );
  });

  it('Arabic-Indic → Persian → English', () => {
    expect(toEnglishDigits(toPersianDigits(ARABIC_INDIC))).toBe(ENGLISH);
  });
});
