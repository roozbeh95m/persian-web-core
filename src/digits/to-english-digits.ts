import { mapDigits, toEnglishCode } from './map-digits.js';

/**
 * Converts Persian (`۰–۹`) and Arabic-Indic (`٠–٩`) digits to English digits
 * (`0–9`). Non-digit characters are left unchanged.
 *
 * @param value - A string or number to convert. Numbers are stringified first
 *   (sign, decimal point, and exponent notation are preserved).
 * @returns A new string with English digits, or the original string when no
 *   conversion is needed.
 *
 * @example
 * ```ts
 * toEnglishDigits('۱۲۳'); // '123'
 * toEnglishDigits('٠١٢'); // '012'
 * toEnglishDigits('قیمت: ۲۵۰۰ تومان'); // 'قیمت: 2500 تومان'
 * toEnglishDigits(-42.5); // '-42.5'
 * ```
 */
export function toEnglishDigits(value: string | number): string {
  return mapDigits(value, toEnglishCode);
}
