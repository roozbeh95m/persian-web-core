import { describe, expect, it } from 'vitest';

import * as core from './index.js';
import * as digits from './digits/index.js';

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
});
