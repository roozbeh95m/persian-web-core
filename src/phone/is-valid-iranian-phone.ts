import { parseIranianMobile } from './parse-iranian-mobile.js';

/**
 * Returns whether `value` is a valid Iranian mobile phone number.
 *
 * Accepts common national and international representations (Persian/Arabic-Indic
 * digits, spaces, hyphens, `+98`, `0098`, leading `0`). Rejects landlines,
 * malformed numbers, and non-Iranian international numbers.
 *
 * @param value - Phone number string to validate.
 *
 * @example
 * ```ts
 * isValidIranianPhone('09121234567'); // true
 * isValidIranianPhone('02112345678'); // false (landline)
 * isValidIranianPhone('+14155552671'); // false
 * ```
 */
export function isValidIranianPhone(value: string): boolean {
  return parseIranianMobile(value) !== null;
}
