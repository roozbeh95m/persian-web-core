import { toPersianDigits } from '../digits/to-persian-digits.js';

import { parseIranianMobile } from './parse-iranian-mobile.js';

import type { FormatIranianPhoneOptions } from './types.js';

function applyDigits(
  value: string,
  digits: FormatIranianPhoneOptions['digits'],
): string {
  if (digits === 'persian') {
    return toPersianDigits(value);
  }
  return value;
}

/**
 * Formats a valid Iranian mobile number for display.
 *
 * National layout: `0912 123 4567` (4-3-4 grouping).
 * International layout: `+98 912 123 4567` (3-3-4 after country code).
 *
 * @param value - Phone number in any accepted input form.
 * @param options - Layout and digit script; see {@link FormatIranianPhoneOptions}.
 * @returns Formatted string, or `null` when the input is not a valid Iranian
 *   mobile number.
 *
 * @example
 * ```ts
 * formatIranianPhone('09121234567');
 * // '0912 123 4567'
 *
 * formatIranianPhone('+989121234567', { format: 'international' });
 * // '+98 912 123 4567'
 *
 * formatIranianPhone('09121234567', { digits: 'persian' });
 * // '۰۹۱۲ ۱۲۳ ۴۵۶۷'
 * ```
 */
export function formatIranianPhone(
  value: string,
  options?: FormatIranianPhoneOptions,
): string | null {
  const mobile = parseIranianMobile(value);
  if (mobile === null) {
    return null;
  }

  const layout = options?.format ?? 'national';
  const digits = options?.digits ?? 'english';

  const operator = mobile.slice(0, 3);
  const middle = mobile.slice(3, 6);
  const subscriber = mobile.slice(6);

  if (layout === 'international') {
    const formatted = `+98 ${operator} ${middle} ${subscriber}`;
    return applyDigits(formatted, digits);
  }

  const formatted = `0${operator} ${middle} ${subscriber}`;
  return applyDigits(formatted, digits);
}
