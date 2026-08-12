import type { TextDirection } from './types.js';

function isArabicLetter(code: number): boolean {
  return (
    (code >= 0x0621 && code <= 0x063a) ||
    (code >= 0x0641 && code <= 0x064a) ||
    (code >= 0x066e && code <= 0x066f) ||
    (code >= 0x0671 && code <= 0x06d3) ||
    code === 0x06d5 ||
    (code >= 0x06ee && code <= 0x06ef) ||
    (code >= 0x06fa && code <= 0x06ff) ||
    (code >= 0x0750 && code <= 0x077f) ||
    (code >= 0x08a0 && code <= 0x08ff) ||
    (code >= 0xfb50 && code <= 0xfdfd) ||
    (code >= 0xfe70 && code <= 0xfefc)
  );
}

function isHebrewLetter(code: number): boolean {
  return (
    (code >= 0x05d0 && code <= 0x05ea) ||
    (code >= 0x05ef && code <= 0x05f4) ||
    (code >= 0xfb1d && code <= 0xfb4f)
  );
}

function isLatinLetter(code: number): boolean {
  return (
    (code >= 0x0041 && code <= 0x005a) ||
    (code >= 0x0061 && code <= 0x007a) ||
    (code >= 0x00c0 && code <= 0x00d6) ||
    (code >= 0x00d8 && code <= 0x00f6) ||
    (code >= 0x00f8 && code <= 0x00ff) ||
    (code >= 0x0100 && code <= 0x024f) ||
    (code >= 0x1e00 && code <= 0x1eff)
  );
}

function isRtlLetter(code: number): boolean {
  return isArabicLetter(code) || isHebrewLetter(code);
}

function classifyStrongDirection(code: number): 'rtl' | 'ltr' | null {
  if (isRtlLetter(code)) {
    return 'rtl';
  }

  if (isLatinLetter(code)) {
    return 'ltr';
  }

  return null;
}

/**
 * Resolves the overall text direction of `text` by scanning strong
 * directional characters and ignoring neutral content such as digits,
 * punctuation, whitespace, and formatting marks.
 *
 * @param text - Input string to analyze.
 * @returns `'rtl'`, `'ltr'`, `'mixed'`, or `'neutral'`.
 *
 * @example
 * ```ts
 * getTextDirection('سلام'); // 'rtl'
 * getTextDirection('Hello'); // 'ltr'
 * getTextDirection('Hello سلام'); // 'mixed'
 * getTextDirection('123'); // 'neutral'
 * getTextDirection(''); // 'neutral'
 * ```
 */
export function getTextDirection(text: string): TextDirection {
  let hasRtl = false;
  let hasLtr = false;

  for (const char of text) {
    const code = char.codePointAt(0);
    if (code === undefined) {
      continue;
    }

    const direction = classifyStrongDirection(code);
    if (direction === 'rtl') {
      hasRtl = true;
    } else if (direction === 'ltr') {
      hasLtr = true;
    }

    if (hasRtl && hasLtr) {
      return 'mixed';
    }
  }

  if (hasRtl) {
    return 'rtl';
  }

  if (hasLtr) {
    return 'ltr';
  }

  return 'neutral';
}

/**
 * Returns whether `text` is purely right-to-left.
 *
 * Neutral-only strings (digits, punctuation, whitespace) and mixed
 * directional strings return `false`.
 *
 * @param text - Input string to analyze.
 *
 * @example
 * ```ts
 * isRTL('سلام'); // true
 * isRTL('Hello سلام'); // false
 * isRTL('123'); // false
 * ```
 */
export function isRTL(text: string): boolean {
  return getTextDirection(text) === 'rtl';
}

/**
 * Returns whether `text` contains both RTL and LTR strong characters.
 *
 * @param text - Input string to analyze.
 *
 * @example
 * ```ts
 * isMixedDirection('Hello سلام'); // true
 * isMixedDirection('سلام'); // false
 * isMixedDirection('123'); // false
 * ```
 */
export function isMixedDirection(text: string): boolean {
  return getTextDirection(text) === 'mixed';
}
