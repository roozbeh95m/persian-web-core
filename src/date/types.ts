/**
 * A civil Jalali (Persian) calendar date.
 */
export type JalaliDate = {
  /** Jalali year (e.g. 1403). */
  year: number;
  /** Jalali month (1–12). */
  month: number;
  /** Jalali day of month (1–31). */
  day: number;
};

/**
 * A civil Gregorian calendar date.
 */
export type GregorianDate = {
  /** Gregorian year. */
  year: number;
  /** Gregorian month (1–12). */
  month: number;
  /** Gregorian day of month (1–31). */
  day: number;
};

/**
 * Which digit script {@link formatJalali} uses in numeric tokens.
 */
export type FormatJalaliDigits = 'english' | 'persian';

/**
 * Options for {@link toJalali} when the input is a {@link Date}.
 *
 * Numeric `(year, month, day)` overloads perform pure calendar conversion and
 * ignore these options.
 */
export type ToJalaliOptions = {
  /**
   * IANA time zone used to read the civil date from a {@link Date}.
   *
   * When omitted, the host environment's local time zone is used
   * (`Date#getFullYear`, `#getMonth`, `#getDate`).
   *
   * @example 'UTC'
   * @example 'Asia/Tehran'
   */
  timeZone?: string;
};

/**
 * Options for {@link formatJalali}.
 */
export type FormatJalaliOptions = ToJalaliOptions & {
  /**
   * Output pattern. Supported tokens:
   *
   * | Token | Meaning              | Example |
   * | ----- | -------------------- | ------- |
   * | `YYYY` | 4-digit Jalali year | `1403`  |
   * | `YY`   | 2-digit Jalali year | `03`    |
   * | `MM`   | zero-padded month   | `01`    |
   * | `M`    | month               | `1`     |
   * | `DD`   | zero-padded day     | `05`    |
   * | `D`    | day                 | `5`     |
   *
   * @default 'YYYY/MM/DD'
   */
  pattern?: string;

  /** Digit script for numeric output. @default 'english' */
  digits?: FormatJalaliDigits;
};

/**
 * Which digit script {@link relativeTime} uses in numeric tokens.
 */
export type RelativeTimeDigits = 'english' | 'persian';

/**
 * Options for {@link relativeTime}.
 *
 * ## Time zone behavior
 *
 * Relative time compares **absolute instants** (`Date#getTime` / UTC
 * milliseconds). Civil time zones do not change the result: the same two
 * timestamps yield the same string in any zone. Pass {@link RelativeTimeOptions.now}
 * to fix the reference instant (especially in tests).
 */
export type RelativeTimeOptions = {
  /**
   * Digit script for numeric output.
   *
   * @default 'persian'
   */
  digits?: RelativeTimeDigits;

  /**
   * Reference instant used as “now”.
   *
   * @default `new Date()` (current time when the function runs)
   */
  now?: Date;

  /**
   * Whether to use numeric values always, or allow locale phrases such as
   * `دیروز` / `فردا` when the unit is days (and similar for other units).
   *
   * Passed through to `Intl.RelativeTimeFormat`.
   *
   * @default 'auto'
   */
  numeric?: 'always' | 'auto';
};
