import { toEnglishDigits, toPersianDigits } from '../digits/index.js';

import type {
  Currency,
  CurrencyDisplay,
  CurrencyDigits,
  FormatCurrencyOptions,
  FormatCurrencyOptionsWithCurrency,
} from './types.js';

const DEFAULT_LOCALE = 'fa-IR';
const DEFAULT_CURRENCY_DISPLAY: CurrencyDisplay = 'symbol';

function applyDigits(value: string, digits?: CurrencyDigits): string {
  if (digits === 'persian') {
    return toPersianDigits(value);
  }
  if (digits === 'english') {
    return toEnglishDigits(value);
  }
  return value;
}

function defaultFractionDigits(
  currency: Currency,
): Pick<
  Intl.NumberFormatOptions,
  'minimumFractionDigits' | 'maximumFractionDigits'
> {
  switch (currency) {
    case 'IRR':
    case 'IRT':
      return { minimumFractionDigits: 0, maximumFractionDigits: 0 };
    case 'USD':
    case 'EUR':
      return { minimumFractionDigits: 2, maximumFractionDigits: 2 };
  }
}

function resolveFractionDigits(
  currency: Currency,
  options: FormatCurrencyOptions | undefined,
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

  const fractionDigits = defaultFractionDigits(currency);

  if (options?.minimumFractionDigits !== undefined) {
    fractionDigits.minimumFractionDigits = options.minimumFractionDigits;
  }
  if (options?.maximumFractionDigits !== undefined) {
    fractionDigits.maximumFractionDigits = options.maximumFractionDigits;
  }

  return fractionDigits;
}

function resolveLocale(options: FormatCurrencyOptions | undefined): string {
  return options?.locale ?? DEFAULT_LOCALE;
}

function resolveCurrencyDisplay(
  options: FormatCurrencyOptions | undefined,
): CurrencyDisplay {
  return options?.currencyDisplay ?? DEFAULT_CURRENCY_DISPLAY;
}

function formatIntlCurrency(
  value: number,
  currency: Exclude<Currency, 'IRT'>,
  options: FormatCurrencyOptions | undefined,
): string {
  const locale = resolveLocale(options);
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: resolveCurrencyDisplay(options),
    ...resolveFractionDigits(currency, options),
  }).format(value);

  return applyDigits(formatted, options?.digits);
}

function resolveIrtSymbolLabel(
  locale: string,
  currencyDisplay: CurrencyDisplay,
): string {
  if (currencyDisplay === 'name') {
    return locale.startsWith('fa') ? 'تومان' : 'tomans';
  }

  if (currencyDisplay === 'code') {
    return 'IRT';
  }

  if (locale.startsWith('fa')) {
    return 'تومان';
  }

  return 'IRT';
}

function formatIrtCurrency(
  value: number,
  options: FormatCurrencyOptions | undefined,
): string {
  const locale = resolveLocale(options);
  const currencyDisplay = resolveCurrencyDisplay(options);
  const label = resolveIrtSymbolLabel(locale, currencyDisplay);
  const formattedNumber = applyDigits(
    new Intl.NumberFormat(locale, {
      ...resolveFractionDigits('IRT', options),
      useGrouping: true,
    }).format(Math.abs(value)),
    options?.digits,
  );

  if (currencyDisplay === 'name') {
    const formatted = `${formattedNumber}\u00a0${label}`;
    if (value < 0) {
      return locale.startsWith('fa')
        ? `\u200e\u2212\u200e${formatted}`
        : `-${formatted}`;
    }
    return locale.startsWith('fa') ? `\u200e${formatted}` : formatted;
  }

  if (value < 0) {
    return locale.startsWith('fa')
      ? `\u200e\u2212\u200e${label}\u00a0${formattedNumber}`
      : `-${label}\u00a0${formattedNumber}`;
  }

  return locale.startsWith('fa')
    ? `\u200e${label}\u00a0${formattedNumber}`
    : `${label}\u00a0${formattedNumber}`;
}

/**
 * Format a monetary amount with locale-aware currency labels, grouping, and
 * optional Persian digit output.
 *
 * **Amount units**
 *
 * The numeric `value` is always interpreted in the selected currency's display
 * unit. There is no automatic conversion between `'IRR'` and `'IRT'`:
 *
 * | Code  | Unit   | Example input | Meaning              |
 * | ----- | ------ | ------------- | -------------------- |
 * | `IRR` | Rial   | `12_500_000`  | 12,500,000 rials     |
 * | `IRT` | Toman  | `1_250_000`   | 1,250,000 tomans     |
 * | `USD` | Dollar | `12.5`        | 12.50 US dollars     |
 * | `EUR` | Euro   | `99.99`       | 99.99 euros          |
 *
 * `'IRT'` is not an official ISO 4217 code, so it is formatted manually to
 * mirror native `Intl` layout for `'IRR'`.
 *
 * **Defaults**
 *
 * | Option            | Default                         |
 * | ----------------- | ------------------------------- |
 * | `locale`          | `'fa-IR'`                       |
 * | `currencyDisplay` | `'symbol'`                      |
 * | fraction digits   | `0` for `IRR`/`IRT`, `2` for `USD`/`EUR` |
 * | `digits`          | locale script (no conversion)   |
 *
 * **Non-finite values**
 *
 * `NaN` and `±Infinity` are formatted through `Intl.NumberFormat` for
 * `IRR`/`USD`/`EUR` (including currency labels where the runtime supplies
 * them, for example `$∞` or `\u200eریالناعدد` in `fa-IR`). Fraction-digit options
 * are ignored. For `IRT`, the locale-aware non-finite label is prefixed or
 * suffixed like finite amounts (for example `\u200eتومان\u00a0ناعدد`).
 *
 * @param value - Amount in the selected currency unit.
 * @param options - Currency code, locale, digit script, and precision.
 * @returns A formatted currency string. The input number is never mutated.
 *
 * @example
 * ```ts
 * formatCurrency(1_250_000, { currency: 'IRT' });
 * // '\u200eتومان\u00a0۱٬۲۵۰٬۰۰۰'
 *
 * formatCurrency(12_500_000, { currency: 'IRR' });
 * // '\u200eریال\u00a0۱۲٬۵۰۰٬۰۰۰'
 *
 * formatCurrency(12.5, { currency: 'USD', locale: 'en-US' });
 * // '$12.50'
 *
 * formatCurrency(-1_250_000, { currency: 'IRT' });
 * // '\u200e\u2212\u200eتومان\u00a0۱٬۲۵۰٬۰۰۰'
 * ```
 */
export function formatCurrency(
  value: number,
  options: FormatCurrencyOptionsWithCurrency,
): string {
  const { currency } = options;

  if (currency === 'IRT') {
    return formatIrtCurrency(value, options);
  }

  return formatIntlCurrency(value, currency, options);
}

/**
 * Format an amount in Iranian tomans (`'IRT'`).
 *
 * Equivalent to `formatCurrency(value, { ...options, currency: 'IRT' })`.
 * The amount is in tomans, not rials.
 *
 * @param value - Amount in tomans.
 * @param options - Locale, digit script, and precision (currency is fixed).
 * @returns A formatted toman string.
 *
 * @example
 * ```ts
 * formatToman(1_250_000);
 * // '\u200eتومان\u00a0۱٬۲۵۰٬۰۰۰'
 * ```
 */
export function formatToman(
  value: number,
  options?: FormatCurrencyOptions,
): string {
  return formatCurrency(value, { ...options, currency: 'IRT' });
}

/**
 * Format an amount in Iranian rials (`'IRR'`).
 *
 * Equivalent to `formatCurrency(value, { ...options, currency: 'IRR' })`.
 * The amount is in rials, not tomans.
 *
 * @param value - Amount in rials.
 * @param options - Locale, digit script, and precision (currency is fixed).
 * @returns A formatted rial string.
 *
 * @example
 * ```ts
 * formatRial(12_500_000);
 * // '\u200eریال\u00a0۱۲٬۵۰۰٬۰۰۰'
 * ```
 */
export function formatRial(
  value: number,
  options?: FormatCurrencyOptions,
): string {
  return formatCurrency(value, { ...options, currency: 'IRR' });
}
