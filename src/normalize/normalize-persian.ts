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

const HEH_CHAR = String.fromCharCode(HEH);
const HEH_WITH_HAMZA = String.fromCharCode(HEH, HAMZA_ABOVE);

/** Sentinel: drop this code unit (diacritic removal). */
const DROP = -1;

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
 * Maps a BMP code unit to its Persian-normalized code, or {@link DROP}.
 * Multi-character replacements (`ۀ`) are handled separately in the main loop
 * so this stays monomorphic for V8.
 */
function mapCode(code: number, removeDiacritics: boolean): number {
  if (removeDiacritics && isArabicDiacritic(code)) {
    return DROP;
  }

  if (code === ARABIC_YEH || code === ALEF_MAKSURA) {
    return PERSIAN_YEH;
  }

  if (code === ARABIC_KAF) {
    return PERSIAN_KAF;
  }

  return code;
}

/**
 * Cleans ZWNJ without removing meaningful intra-word joins:
 * - collapse consecutive ZWNJs to one
 * - drop ZWNJ at string edges and adjacent to whitespace
 *
 * Idempotent. Uses code-unit indexing (Persian text is BMP).
 */
function cleanupZwnj(input: string): string {
  if (input.length === 0 || !input.includes(ZWNJ)) {
    return input;
  }

  const length = input.length;
  const out: string[] = [];

  for (let i = 0; i < length; i++) {
    const char = input[i]!;

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
    while (j < length && input[j] === ZWNJ) {
      j++;
    }
    const next = j < length ? input[j]! : null;

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

function copyPrefix(text: string, end: number): string[] {
  const buffer = new Array<string>(end);
  for (let j = 0; j < end; j++) {
    buffer[j] = text[j]!;
  }
  return buffer;
}

/**
 * Normalizes Persian text to a stable orthographic form.
 *
 * Always applied:
 * - Arabic Yeh (`ي`) and Alef Maksura (`ى`) → Persian Yeh (`ی`)
 * - Arabic Kaf (`ك`) → Persian Kaf (`ک`)
 * - Heh with Yeh above (`ۀ`) → `هٔ` (or `ه` when {@link NormalizePersianOptions.removeDiacritics} is on)
 * - ZWNJ cleanup (collapse runs; drop at edges / next to whitespace; keep
 *   meaningful joins such as `می‌روم`)
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

  // Lazy buffer (same pattern as mapDigits): allocate only on first change.
  let buffer: string[] | null = null;
  const length = text.length;

  for (let i = 0; i < length; i++) {
    const code = text.charCodeAt(i);

    // ۀ is the only multi-character replacement — keep it out of mapCode.
    if (code === HEH_WITH_YEH_ABOVE) {
      const replacement = removeDiacritics ? HEH_CHAR : HEH_WITH_HAMZA;
      if (buffer === null) {
        buffer = copyPrefix(text, i);
      }
      buffer.push(replacement);
      continue;
    }

    const mapped = mapCode(code, removeDiacritics);

    if (mapped === DROP) {
      if (buffer === null) {
        buffer = copyPrefix(text, i);
      }
      continue;
    }

    if (mapped !== code) {
      if (buffer === null) {
        buffer = copyPrefix(text, i);
      }
      buffer.push(String.fromCharCode(mapped));
      continue;
    }

    if (buffer !== null) {
      buffer.push(text[i]!);
    }
  }

  let result = buffer === null ? text : buffer.join('');

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
