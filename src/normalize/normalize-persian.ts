import { toEnglishDigits } from '../digits/to-english-digits.js';
import { toPersianDigits } from '../digits/to-persian-digits.js';

import type { NormalizePersianOptions } from './types.js';

/** Zero-width non-joiner */
const ZWNJ = '\u200C';

/** Arabic Yeh → Persian Yeh */
const ARABIC_YEH = 0x064a;
/** Alef Maksura (often misused as Yeh) → Persian Yeh */
const ALEF_MAKSURA = 0x0649;
/** Persian Yeh */
const PERSIAN_YEH = 0x06cc;

/** Arabic Kaf → Persian Kaf */
const ARABIC_KAF = 0x0643;
/** Persian Kaf (Keheh) */
const PERSIAN_KAF = 0x06a9;

/** Arabic Heh */
const HEH = 0x0647;
/** Combining Hamza Above (used in هٔ) */
const HAMZA_ABOVE = 0x0654;
/** Arabic Letter Heh with Yeh Above (ۀ) — normalize to ه + ٔ */
const HEH_WITH_YEH_ABOVE = 0x06c0;

const PERSIAN_YEH_CHAR = String.fromCharCode(PERSIAN_YEH);
const PERSIAN_KAF_CHAR = String.fromCharCode(PERSIAN_KAF);
const HEH_CHAR = String.fromCharCode(HEH);
const HEH_WITH_HAMZA = String.fromCharCode(HEH, HAMZA_ABOVE);

/**
 * Arabic combining marks commonly treated as removable diacritics.
 * Includes U+0654 (hamza above) so `هٔ` becomes `ه` when removal is enabled.
 */
function isArabicDiacritic(code: number): boolean {
  return (
    (code >= 0x064b && code <= 0x065f) ||
    code === 0x0670 ||
    (code >= 0x06d6 && code <= 0x06dc) ||
    code === 0x06df ||
    (code >= 0x06e0 && code <= 0x06e4) ||
    code === 0x06e7 ||
    code === 0x06e8 ||
    (code >= 0x06ea && code <= 0x06ed)
  );
}

function isWhitespaceChar(char: string): boolean {
  return /\s/u.test(char);
}

/**
 * Maps a single code unit to its Persian-normalized replacement.
 * Returns `null` when the character should be dropped (diacritic removal).
 * May return one or two characters (e.g. ۀ → هٔ).
 */
function mapChar(code: number, removeDiacritics: boolean): string | null {
  if (removeDiacritics && isArabicDiacritic(code)) {
    return null;
  }

  if (code === ARABIC_YEH || code === ALEF_MAKSURA) {
    return PERSIAN_YEH_CHAR;
  }

  if (code === ARABIC_KAF) {
    return PERSIAN_KAF_CHAR;
  }

  if (code === HEH_WITH_YEH_ABOVE) {
    // Canonical Persian ezafe form; becomes bare ه when diacritics are removed.
    return removeDiacritics ? HEH_CHAR : HEH_WITH_HAMZA;
  }

  return String.fromCharCode(code);
}

/**
 * Cleans ZWNJ without removing meaningful intra-word joins:
 * - collapse consecutive ZWNJs to one
 * - drop ZWNJ at string edges and adjacent to whitespace
 *
 * Idempotent.
 */
function cleanupZwnj(input: string): string {
  if (input.length === 0 || !input.includes(ZWNJ)) {
    return input;
  }

  const chars = [...input];
  const out: string[] = [];

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i]!;

    if (char !== ZWNJ) {
      out.push(char);
      continue;
    }

    // Collapse runs: skip if previous emitted char is already ZWNJ.
    if (out[out.length - 1] === ZWNJ) {
      continue;
    }

    const prev = out.length > 0 ? out[out.length - 1]! : null;

    // Find next non-ZWNJ character.
    let j = i + 1;
    while (j < chars.length && chars[j] === ZWNJ) {
      j++;
    }
    const next = j < chars.length ? chars[j]! : null;

    const keep =
      prev !== null &&
      next !== null &&
      !isWhitespaceChar(prev) &&
      !isWhitespaceChar(next);

    if (keep) {
      out.push(ZWNJ);
    }

    // Advance past the rest of this ZWNJ run (loop will +1).
    i = j - 1;
  }

  const result = out.join('');
  return result === input ? input : result;
}

function normalizeWhitespaceRuns(input: string): string {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return input.length === 0 ? input : '';
  }

  const collapsed = trimmed.replace(/\s+/gu, ' ');
  return collapsed === input ? input : collapsed;
}

/**
 * Normalizes Persian text to a stable orthographic form.
 *
 * Always applied:
 * - Arabic Yeh (`ي`) and Alef Maksura (`ى`) → Persian Yeh (`ی`)
 * - Arabic Kaf (`ك`) → Persian Kaf (`ک`)
 * - Heh with Yeh above (`ۀ`) → `هٔ` (or `ه` when {@link NormalizePersianOptions.removeDiacritics} is on)
 * - ZWNJ cleanup (collapse runs; drop at edges / next to whitespace; keep
 *   meaningful joins such as `می‌شود`)
 *
 * Optional (defaults preserve content):
 * - {@link NormalizePersianOptions.digits}
 * - {@link NormalizePersianOptions.removeDiacritics}
 * - {@link NormalizePersianOptions.normalizeWhitespace}
 *
 * Punctuation and Latin letters are left unchanged. The function is
 * deterministic and idempotent for any fixed options:
 * `normalizePersian(normalizePersian(input, o), o) === normalizePersian(input, o)`.
 *
 * @param text - Input string (never mutated).
 * @param options - Optional controls; see {@link NormalizePersianOptions}.
 * @returns Normalized string, or the original reference when nothing changes.
 *
 * @example
 * ```ts
 * normalizePersian('كي'); // 'کی'
 * normalizePersian('١٢٣', { digits: 'persian' }); // '۱۲۳'
 * normalizePersian('مِنْ', { removeDiacritics: true }); // 'من'
 * ```
 */
export function normalizePersian(
  text: string,
  options?: NormalizePersianOptions,
): string {
  if (text.length === 0) {
    return text;
  }

  const digits = options?.digits ?? 'preserve';
  const removeDiacritics = options?.removeDiacritics ?? false;
  const shouldNormalizeWhitespace = options?.normalizeWhitespace ?? false;

  let changed = false;
  const parts: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    const mapped = mapChar(code, removeDiacritics);

    if (mapped === null) {
      changed = true;
      continue;
    }

    if (mapped.length !== 1 || mapped.charCodeAt(0) !== code) {
      changed = true;
    }
    parts.push(mapped);
  }

  let result = changed ? parts.join('') : text;

  result = cleanupZwnj(result);

  if (digits === 'persian') {
    result = toPersianDigits(result);
  } else if (digits === 'english') {
    result = toEnglishDigits(result);
  }

  if (shouldNormalizeWhitespace) {
    result = normalizeWhitespaceRuns(result);
  }

  return result === text ? text : result;
}
