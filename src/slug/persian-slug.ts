import { normalizePersian } from '../normalize/normalize-persian.js';
import { foldAsciiLatinCase } from '../shared/fold-ascii-latin-case.js';

/** Zero-width non-joiner — treated as a word separator in slugs. */
const ZWNJ = '\u200C';

/** Options passed to {@link normalizePersian} before slugification. */
const SLUG_NORMALIZE_OPTIONS = {
  digits: 'english',
  removeDiacritics: true,
  normalizeWhitespace: true,
} as const;

/** Replaces ZWNJ with a hyphen so compound forms stay readable in URLs. */
function zwnjToHyphen(input: string): string {
  if (!input.includes(ZWNJ)) {
    return input;
  }
  return input.replaceAll(ZWNJ, '-');
}

function isAsciiLetter(code: number): boolean {
  return (code >= 97 && code <= 122) || (code >= 65 && code <= 90);
}

function isAsciiDigit(code: number): boolean {
  return code >= 48 && code <= 57;
}

/** Persian/Arabic script letters (digits are normalized to ASCII beforehand). */
function isArabicScriptLetter(char: string): boolean {
  return /\p{Script=Arabic}/u.test(char);
}

function isSlugChar(char: string): boolean {
  const code = char.charCodeAt(0);
  return (
    isAsciiLetter(code) || isAsciiDigit(code) || isArabicScriptLetter(char)
  );
}

/**
 * Builds a hyphenated slug from normalized text.
 * Whitespace, existing hyphens, and unsafe punctuation become word separators.
 */
function slugifyNormalized(input: string): string {
  if (input.length === 0) {
    return input;
  }

  const parts: string[] = [];
  let pendingHyphen = false;

  for (const char of input) {
    if (isSlugChar(char)) {
      if (pendingHyphen) {
        parts.push('-');
        pendingHyphen = false;
      }
      parts.push(char);
      continue;
    }

    if (char === '-' || char === ' ') {
      if (parts.length > 0) {
        pendingHyphen = true;
      }
      continue;
    }

    // Unsafe punctuation → word boundary when slug content exists.
    if (parts.length > 0) {
      pendingHyphen = true;
    }
  }

  return parts.join('');
}

/**
 * Converts text to a URL-friendly slug while preserving Persian characters.
 *
 * Processing steps:
 *
 * 1. {@link normalizePersian} — Arabic Yeh/Kaf variants, diacritics removed,
 *    whitespace trimmed/collapsed, digits converted to English (`0–9`).
 * 2. ZWNJ (`U+200C`) → hyphen (e.g. `می‌رود` → `می-رود`).
 * 3. ASCII Latin `A–Z` folded to lowercase.
 * 4. Spaces and unsafe punctuation → single hyphens between segments.
 * 5. Repeated hyphens collapsed; leading/trailing hyphens removed.
 *
 * Persian letters are never transliterated to Latin. Empty or
 * punctuation-only input returns `''`. The function is deterministic and
 * idempotent: `persianSlug(persianSlug(text)) === persianSlug(text)`.
 *
 * @param text - Input string (never mutated).
 * @returns URL-friendly slug, or `''` when nothing slug-safe remains.
 *
 * @example
 * ```ts
 * persianSlug('گوشی سامسونگ گلکسی S25');
 * // 'گوشی-سامسونگ-گلکسی-s25'
 *
 * persianSlug('  قیمت: ۲۵۰۰  ');
 * // 'قیمت-2500'
 *
 * persianSlug('می‌رود');
 * // 'می-رود'
 * ```
 */
export function persianSlug(text: string): string {
  if (text.length === 0) {
    return text;
  }

  let normalized = normalizePersian(text, SLUG_NORMALIZE_OPTIONS);
  normalized = zwnjToHyphen(normalized);
  normalized = foldAsciiLatinCase(normalized);

  return slugifyNormalized(normalized);
}
