import { describe, expect, it } from 'vitest';

import { isValidNationalId, validateNationalId } from './index.js';

const VALID_NATIONAL_ID = '0123456789';
const VALID_NATIONAL_ID_2 = '0499370899';
const PERSIAN_NATIONAL_ID = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_INDIC_NATIONAL_ID = '٠١٢٣٤٥٦٧٨٩';

const CHECKSUM_WEIGHTS = [10, 9, 8, 7, 6, 5, 4, 3, 2] as const;

/** Builds a valid 10-digit national ID from the first nine digits. */
function withValidCheckDigit(firstNine: string): string {
  const sum = firstNine
    .split('')
    .reduce(
      (total, digit, index) => total + Number(digit) * CHECKSUM_WEIGHTS[index]!,
      0,
    );
  const remainder = sum % 11;
  const checkDigit = remainder < 2 ? remainder : 11 - remainder;

  return `${firstNine}${String(checkDigit)}`;
}

describe('validateNationalId', () => {
  describe('valid inputs', () => {
    it('accepts a known valid English-digit ID', () => {
      expect(validateNationalId(VALID_NATIONAL_ID)).toEqual({ valid: true });
    });

    it('accepts another known valid English-digit ID', () => {
      expect(validateNationalId(VALID_NATIONAL_ID_2)).toEqual({ valid: true });
    });

    it('accepts algorithmically generated valid IDs', () => {
      const generated = withValidCheckDigit('123456789');
      expect(validateNationalId(generated)).toEqual({ valid: true });
      expect(validateNationalId(withValidCheckDigit('987654321'))).toEqual({
        valid: true,
      });
      expect(validateNationalId(withValidCheckDigit('100000009'))).toEqual({
        valid: true,
      });
    });

    it('accepts Persian digits', () => {
      expect(validateNationalId(PERSIAN_NATIONAL_ID)).toEqual({ valid: true });
    });

    it('accepts Arabic-Indic digits', () => {
      expect(validateNationalId(ARABIC_INDIC_NATIONAL_ID)).toEqual({
        valid: true,
      });
    });

    it('accepts mixed Persian and Arabic-Indic digits', () => {
      expect(validateNationalId('۰۱٢۳۴۵۶٧٨٩')).toEqual({ valid: true });
    });

    it('accepts mixed Persian/Arabic-Indic with English digits', () => {
      expect(validateNationalId('0۱2۳4۵6۷8۹')).toEqual({ valid: true });
    });

    it('accepts IDs with leading zeros', () => {
      expect(validateNationalId('0013542419')).toEqual({ valid: true });
      expect(validateNationalId('0013542410')).toEqual({
        valid: false,
        reason: 'invalid_checksum',
      });
      expect(validateNationalId(withValidCheckDigit('001354241'))).toEqual({
        valid: true,
      });
    });

    it('trims surrounding whitespace', () => {
      expect(validateNationalId(`  ${VALID_NATIONAL_ID}  `)).toEqual({
        valid: true,
      });
      expect(validateNationalId(`\t${VALID_NATIONAL_ID}\n`)).toEqual({
        valid: true,
      });
    });

    it('trims whitespace around Persian digits', () => {
      expect(validateNationalId(`  ${PERSIAN_NATIONAL_ID}  `)).toEqual({
        valid: true,
      });
    });
  });

  describe('invalid_length', () => {
    it('rejects empty input', () => {
      expect(validateNationalId('')).toEqual({
        valid: false,
        reason: 'invalid_length',
      });
    });

    it('rejects whitespace-only input', () => {
      expect(validateNationalId('   ')).toEqual({
        valid: false,
        reason: 'invalid_length',
      });
      expect(validateNationalId('\t\n')).toEqual({
        valid: false,
        reason: 'invalid_length',
      });
    });

    it('rejects IDs shorter than 10 digits', () => {
      expect(validateNationalId('123456789')).toEqual({
        valid: false,
        reason: 'invalid_length',
      });
      expect(validateNationalId('1')).toEqual({
        valid: false,
        reason: 'invalid_length',
      });
      expect(validateNationalId('۰۱۲۳۴۵۶۷۸')).toEqual({
        valid: false,
        reason: 'invalid_length',
      });
    });

    it('rejects IDs longer than 10 digits', () => {
      expect(validateNationalId('12345678901')).toEqual({
        valid: false,
        reason: 'invalid_length',
      });
      expect(validateNationalId('01234567890')).toEqual({
        valid: false,
        reason: 'invalid_length',
      });
      expect(validateNationalId('۰۱۲۳۴۵۶۷۸۹۰۱')).toEqual({
        valid: false,
        reason: 'invalid_length',
      });
    });
  });

  describe('invalid_format', () => {
    it('rejects letters mixed with digits', () => {
      expect(validateNationalId('012345678a')).toEqual({
        valid: false,
        reason: 'invalid_format',
      });
      expect(validateNationalId('abc1234567')).toEqual({
        valid: false,
        reason: 'invalid_format',
      });
      expect(validateNationalId('01234abc89')).toEqual({
        valid: false,
        reason: 'invalid_format',
      });
    });

    it('rejects Persian letters', () => {
      expect(validateNationalId('۰۱۲۳۴۵۶۷۸ک')).toEqual({
        valid: false,
        reason: 'invalid_format',
      });
    });

    it('rejects punctuation and symbols', () => {
      expect(validateNationalId('012345678#')).toEqual({
        valid: false,
        reason: 'invalid_format',
      });
      expect(validateNationalId('012-345-6789')).toEqual({
        valid: false,
        reason: 'invalid_format',
      });
      expect(validateNationalId('012.345.6789')).toEqual({
        valid: false,
        reason: 'invalid_format',
      });
    });

    it('rejects internal spaces without stripping them', () => {
      expect(validateNationalId('0123 456789')).toEqual({
        valid: false,
        reason: 'invalid_format',
      });
      expect(validateNationalId('012 345 6789')).toEqual({
        valid: false,
        reason: 'invalid_format',
      });
      expect(validateNationalId('۰۱۲ ۳۴۵ ۶۷۸۹')).toEqual({
        valid: false,
        reason: 'invalid_format',
      });
    });

    it('rejects unrelated text around digits', () => {
      expect(validateNationalId('id:0123456789')).toEqual({
        valid: false,
        reason: 'invalid_format',
      });
      expect(validateNationalId('0123456789extra')).toEqual({
        valid: false,
        reason: 'invalid_format',
      });
    });

    it('rejects plus signs and country-style prefixes', () => {
      expect(validateNationalId('+989121234567')).toEqual({
        valid: false,
        reason: 'invalid_format',
      });
    });

    it('does not normalize decimal points or signs', () => {
      expect(validateNationalId('-012345678')).toEqual({
        valid: false,
        reason: 'invalid_format',
      });
      expect(validateNationalId('012345678.9')).toEqual({
        valid: false,
        reason: 'invalid_format',
      });
    });
  });

  describe('invalid_repeated_digits', () => {
    it('rejects all-zero IDs', () => {
      expect(validateNationalId('0000000000')).toEqual({
        valid: false,
        reason: 'invalid_repeated_digits',
      });
      expect(validateNationalId('۰۰۰۰۰۰۰۰۰۰')).toEqual({
        valid: false,
        reason: 'invalid_repeated_digits',
      });
    });

    it('rejects every repeated single-digit sequence', () => {
      for (let digit = 0; digit <= 9; digit += 1) {
        const repeated = String(digit).repeat(10);
        expect(validateNationalId(repeated)).toEqual({
          valid: false,
          reason: 'invalid_repeated_digits',
        });
      }
    });

    it('rejects repeated digits in Persian script', () => {
      expect(validateNationalId('۱۱۱۱۱۱۱۱۱۱')).toEqual({
        valid: false,
        reason: 'invalid_repeated_digits',
      });
    });

    it('rejects repeated digits in Arabic-Indic script', () => {
      expect(validateNationalId('٥٥٥٥٥٥٥٥٥٥')).toEqual({
        valid: false,
        reason: 'invalid_repeated_digits',
      });
    });
  });

  describe('invalid_checksum', () => {
    it('rejects IDs with an incorrect check digit', () => {
      expect(validateNationalId('0123456780')).toEqual({
        valid: false,
        reason: 'invalid_checksum',
      });
      expect(validateNationalId('0499370890')).toEqual({
        valid: false,
        reason: 'invalid_checksum',
      });
    });

    it('rejects single-digit check digit changes on valid IDs', () => {
      const base = VALID_NATIONAL_ID.slice(0, 9);
      const validCheckDigit = VALID_NATIONAL_ID[9];

      for (let digit = 0; digit <= 9; digit += 1) {
        const candidate = `${base}${digit}`;
        if (String(digit) !== validCheckDigit) {
          expect(validateNationalId(candidate)).toEqual({
            valid: false,
            reason: 'invalid_checksum',
          });
        }
      }
    });

    it('rejects checksum failures in Persian digits', () => {
      expect(validateNationalId('۰۱۲۳۴۵۶۷۸۰')).toEqual({
        valid: false,
        reason: 'invalid_checksum',
      });
    });

    it('rejects checksum failures when remainder is less than 2', () => {
      const id = withValidCheckDigit('111111111');
      const altered = `${id.slice(0, 9)}${(Number(id[9]) + 1) % 10}`;
      expect(validateNationalId(altered)).toEqual({
        valid: false,
        reason: 'invalid_checksum',
      });
    });

    it('rejects checksum failures when remainder is 2 or greater', () => {
      const id = withValidCheckDigit('123456789');
      const altered = `${id.slice(0, 9)}${(Number(id[9]) + 1) % 10}`;
      expect(validateNationalId(altered)).toEqual({
        valid: false,
        reason: 'invalid_checksum',
      });
    });
  });

  describe('reason precedence', () => {
    it('reports invalid_format before invalid_length for mixed content', () => {
      expect(validateNationalId('123abc')).toEqual({
        valid: false,
        reason: 'invalid_format',
      });
    });

    it('reports invalid_length for digit-only short values', () => {
      expect(validateNationalId('12345')).toEqual({
        valid: false,
        reason: 'invalid_length',
      });
    });

    it('reports invalid_repeated_digits before invalid_checksum', () => {
      expect(validateNationalId('2222222222')).toEqual({
        valid: false,
        reason: 'invalid_repeated_digits',
      });
    });
  });

  describe('determinism', () => {
    it('returns the same result for equivalent digit scripts', () => {
      const inputs = [
        VALID_NATIONAL_ID,
        PERSIAN_NATIONAL_ID,
        ARABIC_INDIC_NATIONAL_ID,
        `  ${VALID_NATIONAL_ID}  `,
      ];

      for (const input of inputs) {
        expect(validateNationalId(input)).toEqual({ valid: true });
      }
    });
  });
});

describe('isValidNationalId', () => {
  it('returns true for valid IDs', () => {
    expect(isValidNationalId(VALID_NATIONAL_ID)).toBe(true);
    expect(isValidNationalId(PERSIAN_NATIONAL_ID)).toBe(true);
    expect(isValidNationalId(ARABIC_INDIC_NATIONAL_ID)).toBe(true);
    expect(isValidNationalId(VALID_NATIONAL_ID_2)).toBe(true);
  });

  it('returns false for invalid IDs', () => {
    expect(isValidNationalId('')).toBe(false);
    expect(isValidNationalId('123456789')).toBe(false);
    expect(isValidNationalId('012345678a')).toBe(false);
    expect(isValidNationalId('0123456780')).toBe(false);
    expect(isValidNationalId('1111111111')).toBe(false);
    expect(isValidNationalId('0123 456789')).toBe(false);
  });

  it('matches validateNationalId validity', () => {
    const cases = [
      VALID_NATIONAL_ID,
      PERSIAN_NATIONAL_ID,
      '',
      '123456789',
      '012345678a',
      '0123456780',
      '1111111111',
      '0123 456789',
      '0000000000',
      withValidCheckDigit('456789123'),
    ];

    for (const value of cases) {
      expect(isValidNationalId(value)).toBe(validateNationalId(value).valid);
    }
  });
});
