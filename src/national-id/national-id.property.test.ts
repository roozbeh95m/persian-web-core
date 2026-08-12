import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { isValidNationalId, validateNationalId } from './index.js';

const CHECKSUM_WEIGHTS = [10, 9, 8, 7, 6, 5, 4, 3, 2] as const;

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

function isRepeatedDigits(digits: string): boolean {
  return /^(\d)\1{9}$/u.test(digits);
}

const nineDigitArb = fc
  .tuple(...Array.from({ length: 9 }, () => fc.integer({ min: 0, max: 9 })))
  .map((digits) => digits.join(''));

describe('national-id property-based', () => {
  it('every non-repeated generated ID validates', () => {
    fc.assert(
      fc.property(nineDigitArb, (firstNine) => {
        const id = withValidCheckDigit(firstNine);
        if (isRepeatedDigits(id)) {
          expect(validateNationalId(id)).toEqual({
            valid: false,
            reason: 'invalid_repeated_digits',
          });
          expect(isValidNationalId(id)).toBe(false);
          return;
        }
        expect(validateNationalId(id)).toEqual({ valid: true });
        expect(isValidNationalId(id)).toBe(true);
      }),
      { numRuns: 300 },
    );
  });

  it('flipping the check digit of a valid non-repeated ID invalidates it', () => {
    fc.assert(
      fc.property(
        nineDigitArb.filter((nine) => {
          const id = withValidCheckDigit(nine);
          return !isRepeatedDigits(id);
        }),
        fc.integer({ min: 1, max: 9 }),
        (firstNine, delta) => {
          const id = withValidCheckDigit(firstNine);
          const check = Number(id[9]);
          const mutated = `${id.slice(0, 9)}${String((check + delta) % 10)}`;
          // Changing only the check digit cannot satisfy the checksum unless
          // the new digit equals the original.
          expect(isValidNationalId(mutated)).toBe(false);
        },
      ),
      { numRuns: 200 },
    );
  });

  it('isValidNationalId mirrors validateNationalId.valid', () => {
    fc.assert(
      fc.property(fc.string({ unit: 'binary', maxLength: 24 }), (input) => {
        expect(isValidNationalId(input)).toBe(validateNationalId(input).valid);
      }),
      { numRuns: 150 },
    );
  });

  it('Persian and Arabic-Indic digit scripts of a valid ID still validate', () => {
    const persianMap = '۰۱۲۳۴۵۶۷۸۹';
    const arabicMap = '٠١٢٣٤٥٦٧٨٩';

    fc.assert(
      fc.property(
        nineDigitArb.filter(
          (nine) => !isRepeatedDigits(withValidCheckDigit(nine)),
        ),
        (firstNine) => {
          const id = withValidCheckDigit(firstNine);
          const persian = [...id].map((d) => persianMap[Number(d)]!).join('');
          const arabic = [...id].map((d) => arabicMap[Number(d)]!).join('');
          expect(validateNationalId(persian)).toEqual({ valid: true });
          expect(validateNationalId(arabic)).toEqual({ valid: true });
        },
      ),
      { numRuns: 50 },
    );
  });
});
