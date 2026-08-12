import { toEnglishDigits, toPersianDigits } from '../digits/index.js';

import type { FormatNumberDigits, FormatNumberOptions } from './types.js';

function applyDigits(value: string, digits?: FormatNumberDigits): string {
  if (digits === 'persian') {
    return toPersianDigits(value);
  }
  if (digits === 'english') {
    return toEnglishDigits(value);
  }
  return value;
}

function resolveFractionDigits(
  options: FormatNumberOptions | undefined,
): Pick<
  Intl.NumberFormatOptions,
  'minimumFractionDigits' | 'maximumFractionDigits'
> {
  if (options?.precision !== undefined) {
    return {
      minimumFractionDigits: options.precision,
      maximumFractionDigits: options.precision,
    };
  }

  const fractionDigits: Pick<
    Intl.NumberFormatOptions,
    'minimumFractionDigits' | 'maximumFractionDigits'
  > = {};

  if (options?.minimumFractionDigits !== undefined) {
    fractionDigits.minimumFractionDigits = options.minimumFractionDigits;
  }
  if (options?.maximumFractionDigits !== undefined) {
    fractionDigits.maximumFractionDigits = options.maximumFractionDigits;
  }

  return fractionDigits;
}

/**
 * Format a number for display using native `Intl.NumberFormat`, with optional
 * Persian digit output and `fa-IR` locale behavior.
 *
 * Non-finite values (`NaN`, `±Infinity`) are formatted explicitly through
 * `Intl.NumberFormat` so labels stay locale-aware:
 *
 * | Value        | `en-US`     | `fa-IR`   |
 * | ------------ | ----------- | --------- |
 * | `NaN`        | `NaN`       | `ناعدد`   |
 * | `Infinity`   | `∞`         | `∞`       |
 * | `-Infinity`  | `-∞`        | `‎−∞`     |
 *
 * Grouping, decimal precision, and compact notation options are ignored for
 * non-finite values because they are not numeric magnitudes.
 *
 * @param value - Number to format.
 * @param options - Locale, digit script, grouping, precision, and notation.
 * @returns A formatted string. The input number is never mutated.
 *
 * @example
 * ```ts
 * formatNumber(1234567);
 * // '1,234,567'
 *
 * formatNumber(1234567, { locale: 'fa-IR' });
 * // '۱٬۲۳۴٬۵۶۷'
 *
 * formatNumber(-1234.5, { locale: 'fa-IR', precision: 2 });
 * // '‎−۱٬۲۳۴٫۵۰'
 *
 * formatNumber(1_200_000, { notation: 'compact' });
 * // '1.2M'
 *
 * formatNumber(NaN);
 * // 'NaN'
 * ```
 */
export function formatNumber(
  value: number,
  options?: FormatNumberOptions,
): string {
  const locale = options?.locale ?? 'en-US';
  const notation = options?.notation ?? 'standard';

  const intlOptions: Intl.NumberFormatOptions = {
    ...resolveFractionDigits(options),
    notation,
  };

  if (notation === 'compact') {
    intlOptions.compactDisplay = options?.compactDisplay ?? 'short';
  } else {
    intlOptions.useGrouping = options?.useGrouping ?? true;
  }

  const formatted = new Intl.NumberFormat(locale, intlOptions).format(value);
  return applyDigits(formatted, options?.digits);
}
