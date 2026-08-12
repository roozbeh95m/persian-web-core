import { toEnglishDigits } from '../digits/to-english-digits.js';
import { toPersianDigits } from '../digits/to-persian-digits.js';

import type { RelativeTimeDigits, RelativeTimeOptions } from './types.js';

type RelativeTimeUnit = Intl.RelativeTimeFormatUnit;

/**
 * Cascading unit thresholds (MDN / Temporal-style).
 * Each `amount` is how many of the current unit fit in the next larger unit.
 */
const DIVISIONS: ReadonlyArray<{ amount: number; unit: RelativeTimeUnit }> = [
  { amount: 60, unit: 'second' },
  { amount: 60, unit: 'minute' },
  { amount: 24, unit: 'hour' },
  { amount: 7, unit: 'day' },
  { amount: 4.34524, unit: 'week' },
  { amount: 12, unit: 'month' },
  { amount: Number.POSITIVE_INFINITY, unit: 'year' },
];

function assertValidDate(date: Date, label: string): void {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new RangeError(
      `Invalid Date: ${label} must be a valid Date instance`,
    );
  }
}

function applyDigits(value: string, digits: RelativeTimeDigits): string {
  if (digits === 'english') {
    return toEnglishDigits(value);
  }
  return toPersianDigits(value);
}

function selectUnit(diffMs: number): {
  value: number;
  unit: RelativeTimeUnit;
} {
  let duration = diffMs / 1000;

  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return { value: Math.round(duration), unit: division.unit };
    }
    duration /= division.amount;
  }

  // Unreachable: last division amount is Infinity.
  return { value: Math.round(duration), unit: 'year' };
}

/**
 * Formats how far `date` is from a reference instant, in Persian.
 *
 * Uses `Intl.RelativeTimeFormat` (`fa`) for wording and unit labels, including
 * locale phrases such as `دیروز` / `فردا` when `numeric` is `'auto'`.
 *
 * ## Time zone behavior
 *
 * Comparison is by **absolute instant** (`Date#getTime`). A time zone does not
 * change the result. Use `options.now` to pin the reference instant.
 *
 * ## Units
 *
 * Automatically selects seconds, minutes, hours, days, weeks, months, or years
 * based on the magnitude of the difference.
 *
 * @throws {RangeError} When `date` or `options.now` is an invalid `Date`.
 *
 * @example
 * ```ts
 * const now = new Date('2024-06-15T12:00:00Z');
 *
 * relativeTime(new Date('2024-06-15T11:57:00Z'), { now });
 * // '۳ دقیقه پیش'
 *
 * relativeTime(new Date('2024-06-15T10:00:00Z'), { now });
 * // '۲ ساعت پیش'
 *
 * relativeTime(new Date('2024-06-16T12:00:00Z'), { now });
 * // 'فردا'
 *
 * relativeTime(new Date('2024-06-29T12:00:00Z'), { now });
 * // '۲ هفته بعد'
 * ```
 */
export function relativeTime(
  date: Date,
  options?: RelativeTimeOptions,
): string {
  assertValidDate(date, 'date');

  const now = options?.now ?? new Date();
  assertValidDate(now, 'options.now');

  const digits: RelativeTimeDigits = options?.digits ?? 'persian';
  const numeric = options?.numeric ?? 'auto';

  const { value, unit } = selectUnit(date.getTime() - now.getTime());

  const formatted = new Intl.RelativeTimeFormat('fa', { numeric }).format(
    value,
    unit,
  );

  return applyDigits(formatted, digits);
}
