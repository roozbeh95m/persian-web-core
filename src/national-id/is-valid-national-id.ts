import { validateNationalId } from './validate-national-id.js';

/**
 * Returns whether `value` is a valid Iranian national ID (کد ملی).
 *
 * Accepts Persian and Arabic-Indic digits. Trims surrounding whitespace only;
 * internal separators and non-digit characters cause rejection.
 *
 * @param value - National ID string to validate.
 *
 * @example
 * ```ts
 * isValidNationalId('0123456789'); // true
 * isValidNationalId('0123456780'); // false
 * isValidNationalId('1111111111'); // false
 * ```
 */
export function isValidNationalId(value: string): boolean {
  return validateNationalId(value).valid;
}
