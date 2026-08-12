import { describe, expect, it } from 'vitest';

import * as core from './index.js';
import * as digits from './digits/index.js';
import * as format from './format/index.js';
import * as normalize from './normalize/index.js';

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
});
