import { parseIranianMobile } from './parse-iranian-mobile.js';

/**
 * Canonical E.164 representation for valid Iranian mobile numbers:
 * `+989XXXXXXXXX` (plus sign, country code `98`, then ten digits starting with `9`).
 *
 * @param value - Phone number in common Iranian or international forms.
 * @returns Canonical `+989XXXXXXXXX` string, or `null` when the input is not a
 *   valid Iranian mobile number.
 *
 * @example
 * ```ts
 * normalizePhone('۰۹۱۲۱۲۳۴۵۶۷'); // '+989121234567'
 * normalizePhone('09121234567'); // '+989121234567'
 * normalizePhone('+98 912 123 4567'); // '+989121234567'
 * normalizePhone('+14155552671'); // null
 * ```
 */
export function normalizePhone(value: string): string | null {
  const mobile = parseIranianMobile(value);
  if (mobile === null) {
    return null;
  }

  return `+98${mobile}`;
}
