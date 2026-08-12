/**
 * Digit script used in formatted output.
 *
 * When omitted, {@link formatNumber} keeps the script produced by the active
 * locale (Persian digits for `fa-IR`, English digits for `en-US`, and so on).
 */
export type FormatNumberDigits = 'persian' | 'english';

/**
 * Number display notation.
 *
 * - `'standard'` — full numeral (for example `1,234,567` or `۱٬۲۳۴٬۵۶۷`).
 * - `'compact'` — abbreviated form (for example `1.2M` or `1.2\u00a0میلیون`).
 */
export type FormatNumberNotation = 'standard' | 'compact';

/**
 * Options for {@link formatNumber}.
 */
export interface FormatNumberOptions {
  /**
   * BCP 47 locale tag passed to `Intl.NumberFormat`.
   *
   * Controls grouping and decimal separators, compact suffixes, and the
   * default digit script. Use `'fa-IR'` for Persian separators (`٬` / `٫`).
   *
   * @defaultValue `'en-US'`
   */
  locale?: string;

  /**
   * Override the digit script after locale formatting.
   *
   * @defaultValue locale default (no conversion)
   */
  digits?: FormatNumberDigits;

  /**
   * Insert thousands / grouping separators.
   *
   * @defaultValue `true`
   */
  useGrouping?: boolean;

  /**
   * Fixed decimal precision. Sets both {@link minimumFractionDigits} and
   * {@link maximumFractionDigits}. Takes precedence over those fields when set.
   */
  precision?: number;

  /**
   * Minimum number of digits after the decimal separator.
   */
  minimumFractionDigits?: number;

  /**
   * Maximum number of digits after the decimal separator.
   */
  maximumFractionDigits?: number;

  /**
   * Display notation.
   *
   * @defaultValue `'standard'`
   */
  notation?: FormatNumberNotation;

  /**
   * Wording for {@link notation | `'compact'`} output.
   *
   * @defaultValue `'short'`
   */
  compactDisplay?: 'short' | 'long';
}
