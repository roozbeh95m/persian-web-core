import { toEnglishDigits } from '../digits/to-english-digits.js';

import type {
  NationalIdInvalidReason,
  ValidateNationalIdResult,
} from './types.js';

const NATIONAL_ID_LENGTH = 10;

const CHECKSUM_WEIGHTS = [10, 9, 8, 7, 6, 5, 4, 3, 2] as const;

const DIGITS_ONLY_PATTERN = /^\d+$/u;

const REPEATED_DIGITS_PATTERN = /^(\d)\1{9}$/u;

/**
 * Returns whether the 10-digit string passes the Iranian national ID checksum.
 *
 * The check digit (10th position) is derived from a weighted sum of the first
 * nine digits modulo 11.
 */
function passesChecksum(digits: string): boolean {
  let sum = 0;

  for (let index = 0; index < CHECKSUM_WEIGHTS.length; index += 1) {
    sum += Number(digits[index]) * CHECKSUM_WEIGHTS[index]!;
  }

  const remainder = sum % 11;
  const expectedCheckDigit = remainder < 2 ? remainder : 11 - remainder;
  const actualCheckDigit = Number(digits[NATIONAL_ID_LENGTH - 1]);

  return actualCheckDigit === expectedCheckDigit;
}

function invalid(reason: NationalIdInvalidReason): ValidateNationalIdResult {
  return { valid: false, reason };
}

/**
 * Validates an Iranian national ID (کد ملی) and returns a structured result.
 *
 * Inputs are trimmed and Persian/Arabic-Indic digits are converted to English
 * before validation. Only ASCII digits may remain; separators such as spaces or
 * hyphens are not stripped.
 *
 * A valid ID is exactly ten digits, is not composed of a single repeated digit,
 * and satisfies the official modulo-11 check digit rule applied to the first
 * nine digits.
 *
 * @param value - National ID string to validate.
 *
 * @example
 * ```ts
 * validateNationalId('0123456789');
 * // { valid: true }
 *
 * validateNationalId('0123456780');
 * // { valid: false, reason: 'invalid_checksum' }
 *
 * validateNationalId('۱۲۳۴۵۶۷۸۹');
 * // { valid: false, reason: 'invalid_length' }
 * ```
 */
export function validateNationalId(value: string): ValidateNationalIdResult {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return invalid('invalid_length');
  }

  const normalized = toEnglishDigits(trimmed);

  if (!DIGITS_ONLY_PATTERN.test(normalized)) {
    return invalid('invalid_format');
  }

  if (normalized.length !== NATIONAL_ID_LENGTH) {
    return invalid('invalid_length');
  }

  if (REPEATED_DIGITS_PATTERN.test(normalized)) {
    return invalid('invalid_repeated_digits');
  }

  if (!passesChecksum(normalized)) {
    return invalid('invalid_checksum');
  }

  return { valid: true };
}
