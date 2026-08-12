import { describe, expect, it } from 'vitest';

import {
  formatIranianPhone,
  isValidIranianPhone,
  normalizePhone,
} from './index.js';

const VALID_MOBILE = '09121234567';
const VALID_CANONICAL = '+989121234567';
const PERSIAN_MOBILE = '۰۹۱۲۱۲۳۴۵۶۷';
const ARABIC_INDIC_MOBILE = '٠٩١٢١٢٣٤٥٦٧';

describe('normalizePhone', () => {
  describe('valid inputs', () => {
    it('normalizes national format with leading 0', () => {
      expect(normalizePhone('09121234567')).toBe(VALID_CANONICAL);
    });

    it('normalizes E.164 format', () => {
      expect(normalizePhone('+989121234567')).toBe(VALID_CANONICAL);
    });

    it('normalizes 0098 international prefix', () => {
      expect(normalizePhone('00989121234567')).toBe(VALID_CANONICAL);
    });

    it('normalizes 98 prefix without plus when length is 12', () => {
      expect(normalizePhone('989121234567')).toBe(VALID_CANONICAL);
    });

    it('normalizes ten-digit form without country code or leading 0', () => {
      expect(normalizePhone('9121234567')).toBe(VALID_CANONICAL);
    });

    it('normalizes Persian digits', () => {
      expect(normalizePhone(PERSIAN_MOBILE)).toBe(VALID_CANONICAL);
    });

    it('normalizes Arabic-Indic digits', () => {
      expect(normalizePhone(ARABIC_INDIC_MOBILE)).toBe(VALID_CANONICAL);
    });

    it('strips spaces', () => {
      expect(normalizePhone('0912 123 4567')).toBe(VALID_CANONICAL);
      expect(normalizePhone('+98 912 123 4567')).toBe(VALID_CANONICAL);
      expect(normalizePhone('0098 912 123 4567')).toBe(VALID_CANONICAL);
    });

    it('strips hyphens', () => {
      expect(normalizePhone('0912-123-4567')).toBe(VALID_CANONICAL);
      expect(normalizePhone('+98-912-123-4567')).toBe(VALID_CANONICAL);
    });

    it('strips dots and parentheses', () => {
      expect(normalizePhone('(0912) 123.4567')).toBe(VALID_CANONICAL);
      expect(normalizePhone('+98 (912) 123.4567')).toBe(VALID_CANONICAL);
    });

    it('strips slashes and underscores', () => {
      expect(normalizePhone('0912/123_4567')).toBe(VALID_CANONICAL);
    });

    it('trims surrounding whitespace', () => {
      expect(normalizePhone('  09121234567  ')).toBe(VALID_CANONICAL);
    });

    it('accepts common operator prefixes', () => {
      expect(normalizePhone('09351234567')).toBe('+989351234567');
      expect(normalizePhone('09201234567')).toBe('+989201234567');
      expect(normalizePhone('09901234567')).toBe('+989901234567');
      expect(normalizePhone('09011234567')).toBe('+989011234567');
      expect(normalizePhone('09411234567')).toBe('+989411234567');
    });
  });

  describe('invalid inputs', () => {
    it('returns null for empty input', () => {
      expect(normalizePhone('')).toBeNull();
      expect(normalizePhone('   ')).toBeNull();
    });

    it('rejects non-Iranian international numbers', () => {
      expect(normalizePhone('+14155552671')).toBeNull();
      expect(normalizePhone('+442071234567')).toBeNull();
      expect(normalizePhone('+4915123456789')).toBeNull();
    });

    it('rejects 00 prefixes that are not 0098', () => {
      expect(normalizePhone('0012345678901')).toBeNull();
      expect(normalizePhone('00441234567890')).toBeNull();
    });

    it('rejects Iranian landlines', () => {
      expect(normalizePhone('02112345678')).toBeNull();
      expect(normalizePhone('03112345678')).toBeNull();
    });

    it('rejects wrong lengths', () => {
      expect(normalizePhone('0912123456')).toBeNull();
      expect(normalizePhone('091212345678')).toBeNull();
      expect(normalizePhone('912123456')).toBeNull();
      expect(normalizePhone('98912123456')).toBeNull();
    });

    it('rejects malformed numbers with invalid operator codes', () => {
      expect(normalizePhone('09001234567')).toBeNull();
      expect(normalizePhone('09501234567')).toBeNull();
      expect(normalizePhone('98421234567')).toBeNull();
    });

    it('rejects letters and other disallowed characters', () => {
      expect(normalizePhone('0912abc1234567')).toBeNull();
      expect(normalizePhone('call-me-09121234567')).toBeNull();
      expect(normalizePhone('0912#1234567')).toBeNull();
    });

    it('rejects multiple plus signs', () => {
      expect(normalizePhone('++989121234567')).toBeNull();
      expect(normalizePhone('+98+9121234567')).toBeNull();
    });

    it('rejects plus not at the start', () => {
      expect(normalizePhone('98+9121234567')).toBeNull();
    });

    it('rejects ambiguous 98 prefix when length is not 12', () => {
      expect(normalizePhone('98121234567')).toBeNull();
    });
  });

  describe('determinism', () => {
    it('returns the same canonical output for equivalent inputs', () => {
      const inputs = [
        VALID_MOBILE,
        PERSIAN_MOBILE,
        '+989121234567',
        '00989121234567',
        '989121234567',
        '9121234567',
        '0912 123 4567',
        '+98 912 123 4567',
      ];

      for (const input of inputs) {
        expect(normalizePhone(input)).toBe(VALID_CANONICAL);
      }
    });

    it('is idempotent on canonical output', () => {
      expect(normalizePhone(VALID_CANONICAL)).toBe(VALID_CANONICAL);
    });
  });
});

describe('isValidIranianPhone', () => {
  it('returns true for valid Iranian mobile numbers', () => {
    expect(isValidIranianPhone(VALID_MOBILE)).toBe(true);
    expect(isValidIranianPhone(PERSIAN_MOBILE)).toBe(true);
    expect(isValidIranianPhone('+989121234567')).toBe(true);
    expect(isValidIranianPhone('00989121234567')).toBe(true);
    expect(isValidIranianPhone('9121234567')).toBe(true);
  });

  it('returns false for invalid numbers', () => {
    expect(isValidIranianPhone('')).toBe(false);
    expect(isValidIranianPhone('02112345678')).toBe(false);
    expect(isValidIranianPhone('+14155552671')).toBe(false);
    expect(isValidIranianPhone('0912abc1234567')).toBe(false);
    expect(isValidIranianPhone('09001234567')).toBe(false);
  });

  it('matches normalizePhone validity', () => {
    const cases = [
      VALID_MOBILE,
      PERSIAN_MOBILE,
      '+14155552671',
      '02112345678',
      '0912123456',
      '09351234567',
    ];

    for (const value of cases) {
      expect(isValidIranianPhone(value)).toBe(normalizePhone(value) !== null);
    }
  });
});

describe('formatIranianPhone', () => {
  it('formats national layout by default', () => {
    expect(formatIranianPhone(VALID_MOBILE)).toBe('0912 123 4567');
    expect(formatIranianPhone(PERSIAN_MOBILE)).toBe('0912 123 4567');
    expect(formatIranianPhone('+989121234567')).toBe('0912 123 4567');
  });

  it('formats international layout', () => {
    expect(formatIranianPhone(VALID_MOBILE, { format: 'international' })).toBe(
      '+98 912 123 4567',
    );
    expect(
      formatIranianPhone('+989121234567', { format: 'international' }),
    ).toBe('+98 912 123 4567');
  });

  it('supports Persian digits', () => {
    expect(formatIranianPhone(VALID_MOBILE, { digits: 'persian' })).toBe(
      '۰۹۱۲ ۱۲۳ ۴۵۶۷',
    );
    expect(
      formatIranianPhone(VALID_MOBILE, {
        format: 'international',
        digits: 'persian',
      }),
    ).toBe('+۹۸ ۹۱۲ ۱۲۳ ۴۵۶۷');
  });

  it('returns null for invalid numbers', () => {
    expect(formatIranianPhone('02112345678')).toBeNull();
    expect(formatIranianPhone('+14155552671')).toBeNull();
    expect(formatIranianPhone('')).toBeNull();
  });

  it('is deterministic for equivalent inputs', () => {
    const formatted = formatIranianPhone(VALID_MOBILE);
    expect(formatIranianPhone(PERSIAN_MOBILE)).toBe(formatted);
    expect(formatIranianPhone('+98 912 123 4567')).toBe(formatted);
    expect(formatIranianPhone('0098-912-123-4567')).toBe(formatted);
  });
});
