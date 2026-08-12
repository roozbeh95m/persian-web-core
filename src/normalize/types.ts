/**
 * How digit code points are handled during normalization.
 *
 * - `'persian'` — English and Arabic-Indic digits become Persian (`۰–۹`).
 * - `'english'` — Persian and Arabic-Indic digits become English (`0–9`).
 * - `'preserve'` — leave all digit scripts unchanged.
 */
export type DigitNormalization = 'persian' | 'english' | 'preserve';

/**
 * Options for {@link normalizePersian}.
 *
 * Character fixes that are always applied (Yeh, Kaf, Heh-with-hamza, ZWNJ
 * cleanup) are not configurable — they are required for a stable Persian form.
 * Everything listed here is optional so callers can avoid surprising edits.
 */
export interface NormalizePersianOptions {
  /**
   * Digit script conversion.
   *
   * @defaultValue `'preserve'`
   */
  digits?: DigitNormalization;

  /**
   * When `true`, strip Arabic combining marks (tashkeel / harakat), including
   * the hamza above used in `هٔ`. Base letters are kept.
   *
   * @defaultValue `false`
   */
  removeDiacritics?: boolean;

  /**
   * When `true`, trim leading/trailing whitespace and collapse every internal
   * run of whitespace (spaces, tabs, newlines, NBSP, etc.) to a single
   * ASCII space (`U+0020`). ZWNJ is not treated as whitespace.
   *
   * @defaultValue `false`
   */
  normalizeWhitespace?: boolean;
}
