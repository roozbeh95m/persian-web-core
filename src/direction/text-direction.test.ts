import { describe, expect, it } from 'vitest';

import { getTextDirection, isMixedDirection, isRTL } from './index.js';

describe('getTextDirection', () => {
  describe('RTL (Persian/Arabic)', () => {
    it('detects Persian text', () => {
      expect(getTextDirection('سلام')).toBe('rtl');
      expect(getTextDirection('می‌رود')).toBe('rtl');
      expect(getTextDirection('گفت\u200Cوگو')).toBe('rtl');
    });

    it('detects Arabic text', () => {
      expect(getTextDirection('مرحبا')).toBe('rtl');
      expect(getTextDirection('العربية')).toBe('rtl');
    });

    it('detects Persian-specific letters', () => {
      expect(getTextDirection('پچژگ')).toBe('rtl');
      expect(getTextDirection('ک')).toBe('rtl');
      expect(getTextDirection('ی')).toBe('rtl');
    });

    it('detects Arabic presentation forms', () => {
      expect(getTextDirection('\uFE8D\uFEE4\uFEF4')).toBe('rtl');
    });

    it('detects Hebrew letters as RTL', () => {
      expect(getTextDirection('שלום')).toBe('rtl');
    });
  });

  describe('LTR (Latin)', () => {
    it('detects basic Latin text', () => {
      expect(getTextDirection('Hello')).toBe('ltr');
      expect(getTextDirection('world')).toBe('ltr');
    });

    it('detects extended Latin letters', () => {
      expect(getTextDirection('café')).toBe('ltr');
      expect(getTextDirection('naïve')).toBe('ltr');
      expect(getTextDirection('Ångström')).toBe('ltr');
    });
  });

  describe('mixed direction', () => {
    it('detects Latin and Persian in one string', () => {
      expect(getTextDirection('Hello سلام')).toBe('mixed');
      expect(getTextDirection('سلام Hello')).toBe('mixed');
    });

    it('detects mixed direction with numbers and punctuation', () => {
      expect(getTextDirection('iPhone 15 — نسخه جدید')).toBe('mixed');
      expect(getTextDirection('API: دریافت داده')).toBe('mixed');
    });

    it('detects mixed Latin and Arabic', () => {
      expect(getTextDirection('test مرحبا')).toBe('mixed');
    });
  });

  describe('neutral content', () => {
    it('returns neutral for an empty string', () => {
      expect(getTextDirection('')).toBe('neutral');
    });

    it('ignores ASCII digits', () => {
      expect(getTextDirection('1234567890')).toBe('neutral');
      expect(getTextDirection('007')).toBe('neutral');
    });

    it('ignores Arabic-Indic digits', () => {
      expect(getTextDirection('٠١٢٣٤٥٦٧٨٩')).toBe('neutral');
    });

    it('ignores Persian digits', () => {
      expect(getTextDirection('۰۱۲۳۴۵۶۷۸۹')).toBe('neutral');
    });

    it('ignores mixed digit scripts', () => {
      expect(getTextDirection('12۳4۵')).toBe('neutral');
    });

    it('ignores punctuation', () => {
      expect(getTextDirection('...')).toBe('neutral');
      expect(getTextDirection('!?')).toBe('neutral');
      expect(getTextDirection('،؛؟')).toBe('neutral');
      expect(getTextDirection('"\'()[]{}')).toBe('neutral');
    });

    it('ignores whitespace', () => {
      expect(getTextDirection('   ')).toBe('neutral');
      expect(getTextDirection('\t\n\r')).toBe('neutral');
    });

    it('ignores formatting and bidi control characters', () => {
      expect(getTextDirection('\u200C\u200D\u200E\u200F\u202A\u202C')).toBe(
        'neutral',
      );
    });

    it('ignores Arabic diacritics and tatweel', () => {
      expect(getTextDirection('\u064B\u064C\u0640')).toBe('neutral');
    });

    it('ignores digits and punctuation around RTL text without changing direction', () => {
      expect(getTextDirection('۱۲۳ سلام!')).toBe('rtl');
      expect(getTextDirection('...Hello!!!')).toBe('ltr');
    });
  });
});

describe('isRTL', () => {
  it('returns true for purely RTL strings', () => {
    expect(isRTL('سلام')).toBe(true);
    expect(isRTL('مرحبا')).toBe(true);
    expect(isRTL('۱۲۳ سلام')).toBe(true);
  });

  it('returns false for LTR strings', () => {
    expect(isRTL('Hello')).toBe(false);
    expect(isRTL('123')).toBe(false);
  });

  it('returns false for mixed strings', () => {
    expect(isRTL('Hello سلام')).toBe(false);
  });

  it('returns false for empty and neutral strings', () => {
    expect(isRTL('')).toBe(false);
    expect(isRTL('123456')).toBe(false);
    expect(isRTL('،؛؟')).toBe(false);
  });
});

describe('isMixedDirection', () => {
  it('returns true when both RTL and LTR strong characters are present', () => {
    expect(isMixedDirection('Hello سلام')).toBe(true);
    expect(isMixedDirection('API دریافت')).toBe(true);
  });

  it('returns false for purely RTL strings', () => {
    expect(isMixedDirection('سلام')).toBe(false);
  });

  it('returns false for purely LTR strings', () => {
    expect(isMixedDirection('Hello')).toBe(false);
  });

  it('returns false for neutral strings', () => {
    expect(isMixedDirection('')).toBe(false);
    expect(isMixedDirection('123')).toBe(false);
    expect(isMixedDirection('،؛؟')).toBe(false);
  });
});
