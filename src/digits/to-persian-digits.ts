import { mapDigits, toPersianCode } from './map-digits.js';

/**
 * Converts English (`0–9`) and Arabic-Indic (`٠–٩`) digits to Persian digits
 * (`۰–۹`). Non-digit characters are left unchanged.
 *
 * @param value - A string or number to convert. Numbers are stringified first
 *   (sign, decimal point, and exponent notation are preserved).
 * @returns A new string with Persian digits, or the original string when no
 *   conversion is needed.
 *
 * @example
 * ```ts
 * toPersianDigits('123'); // '۱۲۳'
 * toPersianDigits('٠١٢'); // '۰۱۲'
 * toPersianDigits('قیمت: 2500 تومان'); // 'قیمت: ۲۵۰۰ تومان'
 * toPersianDigits(-42.5); // '-۴۲.۵'
 * ```
 */
export function toPersianDigits(value: string | number): string {
  return mapDigits(value, toPersianCode);
}
