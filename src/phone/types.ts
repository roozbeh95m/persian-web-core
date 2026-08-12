/**
 * Display layout for {@link formatIranianPhone}.
 *
 * - `'national'` — `0912 123 4567` (leading `0`, grouped 4-3-4).
 * - `'international'` — `+98 912 123 4567` (E.164 country code, grouped 3-3-4).
 */
export type IranianPhoneFormat = 'national' | 'international';

/**
 * Digit script used in {@link formatIranianPhone} output.
 */
export type IranianPhoneDigits = 'persian' | 'english';

/**
 * Options for {@link formatIranianPhone}.
 */
export interface FormatIranianPhoneOptions {
  /**
   * Output layout.
   *
   * @defaultValue `'national'`
   */
  format?: IranianPhoneFormat;

  /**
   * Digit script for the formatted number.
   *
   * @defaultValue `'english'`
   */
  digits?: IranianPhoneDigits;
}
