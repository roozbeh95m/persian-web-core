import { toPersianDigits } from '../digits/to-persian-digits.js';

import {
  gregorianToJalali,
  isValidJalaliDate,
  jalaliToGregorian,
} from './jalali-convert.js';

import type {
  FormatJalaliDigits,
  FormatJalaliOptions,
  GregorianDate,
  JalaliDate,
  ToJalaliOptions,
} from './types.js';

function assertValidDate(date: Date): void {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new RangeError('Invalid Date: input must be a valid Date instance');
  }
}

function readGregorianParts(
  date: Date,
  timeZone?: string,
): { year: number; month: number; day: number } {
  assertValidDate(date);

  if (timeZone === undefined) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const parts = formatter.formatToParts(date);
  const year = Number(parts.find((part) => part.type === 'year')?.value);
  const month = Number(parts.find((part) => part.type === 'month')?.value);
  const day = Number(parts.find((part) => part.type === 'day')?.value);

  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day)
  ) {
    throw new RangeError(
      `Unable to read Gregorian date parts for time zone ${timeZone}`,
    );
  }

  return { year, month, day };
}

function toJalaliFromGregorian(
  year: number,
  month: number,
  day: number,
): JalaliDate {
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    throw new RangeError(
      'Gregorian year, month, and day must be integers when passed as numbers',
    );
  }

  if (month < 1 || month > 12) {
    throw new RangeError(
      `Invalid Gregorian month ${String(month)}: must be between 1 and 12`,
    );
  }

  if (day < 1 || day > 31) {
    throw new RangeError(
      `Invalid Gregorian day ${String(day)}: must be between 1 and 31`,
    );
  }

  return gregorianToJalali(year, month, day);
}

/**
 * Converts a Gregorian date to the Jalali (Persian) calendar.
 *
 * ## Time zone behavior
 *
 * - **Numeric overload** `(year, month, day)` performs pure calendar math.
 *   No time zone is involved; the input is treated as a civil Gregorian date.
 * - **`Date` overload** reads the **civil date** seen in a time zone:
 *   - Without `options.timeZone`, the host's **local** time zone is used
 *     (`Date#getFullYear`, `#getMonth`, `#getDate`).
 *   - With `options.timeZone`, civil date parts are read via `Intl` for that
 *     IANA zone (e.g. `'UTC'`, `'Asia/Tehran'`).
 *
 * The returned `{ year, month, day }` is always a Jalali civil date with no
 * time or offset attached.
 *
 * @example
 * ```ts
 * toJalali(2024, 3, 20);
 * // { year: 1403, month: 1, day: 1 }
 *
 * toJalali(new Date('2024-03-20T00:00:00Z'), { timeZone: 'UTC' });
 * // { year: 1403, month: 1, day: 1 }
 * ```
 */
export function toJalali(date: Date, options?: ToJalaliOptions): JalaliDate;
export function toJalali(year: number, month: number, day: number): JalaliDate;
export function toJalali(
  yearOrDate: number | Date,
  monthOrOptions?: number | ToJalaliOptions,
  day?: number,
): JalaliDate {
  if (yearOrDate instanceof Date) {
    const options =
      monthOrOptions !== undefined && typeof monthOrOptions === 'object'
        ? monthOrOptions
        : undefined;
    const gregorian = readGregorianParts(yearOrDate, options?.timeZone);
    return toJalaliFromGregorian(
      gregorian.year,
      gregorian.month,
      gregorian.day,
    );
  }

  if (typeof monthOrOptions !== 'number' || day === undefined) {
    throw new TypeError(
      'toJalali expects (year, month, day) numbers or a Date instance',
    );
  }

  return toJalaliFromGregorian(yearOrDate, monthOrOptions, day);
}

/**
 * Converts a Jalali (Persian) civil date to Gregorian.
 *
 * This is pure calendar math — no time zone is involved. The result is a
 * civil Gregorian `{ year, month, day }`.
 *
 * @throws {RangeError} When the Jalali year is out of range or the month/day
 *   combination is invalid (including Esfand 30 in a common year).
 *
 * @example
 * ```ts
 * toGregorian(1403, 1, 1);
 * // { year: 2024, month: 3, day: 20 }
 *
 * toGregorian(1395, 12, 30);
 * // { year: 2017, month: 3, day: 20 }
 * ```
 */
export function toGregorian(
  year: number,
  month: number,
  day: number,
): GregorianDate {
  if (!isValidJalaliDate(year, month, day)) {
    throw new RangeError(
      `Invalid Jalali date ${String(year)}/${String(month)}/${String(day)}`,
    );
  }

  return jalaliToGregorian(year, month, day);
}

function pad(value: number, length: number): string {
  return String(value).padStart(length, '0');
}

function applyDigits(value: string, digits?: FormatJalaliDigits): string {
  if (digits === 'persian') {
    return toPersianDigits(value);
  }
  return value;
}

function formatJalaliParts(
  jalali: JalaliDate,
  options?: FormatJalaliOptions,
): string {
  const pattern = options?.pattern ?? 'YYYY/MM/DD';
  const year = String(jalali.year);
  const month = String(jalali.month);
  const day = String(jalali.day);

  const formatted = pattern
    .replaceAll('YYYY', year)
    .replaceAll('YY', pad(jalali.year % 100, 2))
    .replaceAll('MM', pad(jalali.month, 2))
    .replaceAll('DD', pad(jalali.day, 2))
    .replaceAll('M', month)
    .replaceAll('D', day);

  return applyDigits(formatted, options?.digits);
}

/**
 * Formats a date as a Jalali string using a deterministic token pattern.
 *
 * ## Time zone behavior
 *
 * Same rules as {@link toJalali}:
 *
 * - **`Date` input** — civil date is read in the local time zone, or in
 *   `options.timeZone` when provided.
 * - **`{ year, month, day }` input** — already a Jalali civil date; no time
 *   zone is applied.
 *
 * Formatting is **not** delegated to `Intl.DateTimeFormat`, so output is stable
 * across runtimes for a given pattern. Use `options.digits: 'persian'` for
 * Persian digits; otherwise ASCII digits are used.
 *
 * @example
 * ```ts
 * formatJalali({ year: 1403, month: 1, day: 1 });
 * // '1403/01/01'
 *
 * formatJalali(new Date('2024-03-20T00:00:00Z'), {
 *   timeZone: 'UTC',
 *   pattern: 'YYYY-MM-DD',
 *   digits: 'persian',
 * });
 * // '۱۴۰۳-۰۱-۰۱'
 * ```
 */
export function formatJalali(
  date: Date | JalaliDate,
  options?: FormatJalaliOptions,
): string {
  if (date instanceof Date) {
    return formatJalaliParts(toJalali(date, options), options);
  }

  if (
    typeof date !== 'object' ||
    date === null ||
    !('year' in date) ||
    !('month' in date) ||
    !('day' in date)
  ) {
    throw new TypeError(
      'formatJalali expects a Date instance or a { year, month, day } object',
    );
  }

  if (!isValidJalaliDate(date.year, date.month, date.day)) {
    throw new RangeError(
      `Invalid Jalali date ${String(date.year)}/${String(date.month)}/${String(date.day)}`,
    );
  }

  return formatJalaliParts(date, options);
}
