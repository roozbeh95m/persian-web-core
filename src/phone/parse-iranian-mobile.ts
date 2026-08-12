import { toEnglishDigits } from '../digits/to-english-digits.js';

/**
 * Ten-digit Iranian mobile national significant number: `9XXXXXXXXX`.
 *
 * Validated operator ranges cover MCI, Irancell, Rightel, and other
 * allocated Iranian mobile prefixes without accepting landlines.
 */
const MOBILE_PATTERN = /^9(?:0[1-9]|1\d|2[0-3]|3\d|4[01]|9\d)\d{7}$/;

const ALLOWED_INPUT_PATTERN = /^\+?[\d\s\-.()/\\_]+$/u;

/**
 * Strips common phone formatting characters after digit-script conversion.
 * Returns `null` when the input contains disallowed characters.
 */
function sanitizePhoneInput(input: string): string | null {
  const english = toEnglishDigits(input.trim());

  if (english.length === 0 || !ALLOWED_INPUT_PATTERN.test(english)) {
    return null;
  }

  return english.replace(/[\s\-.()/\\_]/gu, '');
}

/**
 * Parses an Iranian mobile number to its 10-digit national significant form
 * (`9XXXXXXXXX`). Returns `null` for invalid, malformed, or non-Iranian input.
 */
export function parseIranianMobile(input: string): string | null {
  const sanitized = sanitizePhoneInput(input);
  if (sanitized === null) {
    return null;
  }

  const hasPlus = sanitized.startsWith('+');
  const digitsOnly = sanitized.replace(/\+/gu, '');

  if (!/^\d+$/u.test(digitsOnly)) {
    return null;
  }

  let mobile: string;

  if (hasPlus) {
    if (!digitsOnly.startsWith('98')) {
      return null;
    }
    mobile = digitsOnly.slice(2);
  } else if (digitsOnly.startsWith('0098')) {
    mobile = digitsOnly.slice(4);
  } else if (digitsOnly.startsWith('98') && digitsOnly.length === 12) {
    mobile = digitsOnly.slice(2);
  } else if (digitsOnly.startsWith('0')) {
    if (digitsOnly.length !== 11) {
      return null;
    }
    mobile = digitsOnly.slice(1);
  } else if (digitsOnly.length === 10) {
    mobile = digitsOnly;
  } else {
    return null;
  }

  if (!MOBILE_PATTERN.test(mobile)) {
    return null;
  }

  return mobile;
}
