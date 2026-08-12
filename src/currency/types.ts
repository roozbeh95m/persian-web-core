/**
 * Supported ISO and common Iranian currency codes.
 *
 * - `'IRR'` — Iranian rial (official unit). Amounts are in rials; {@link formatRial}
 *   is shorthand for this code.
 * - `'IRT'` — Iranian toman (common display unit, not an official ISO code).
 *   Amounts are in tomans; {@link formatToman} is shorthand. **No automatic
 *   conversion** between `'IRR'` and `'IRT'` — `1_250_000` means 1,250,000 of
 *   the selected unit, not 125,000 tomans vs. 1,250,000 rials.
 * - `'USD'` — United States dollar.
 * - `'EUR'` — Euro.
 */
export type Currency = 'IRR' | 'IRT' | 'USD' | 'EUR';

/**
 * Digit script used in formatted currency output.
 *
 * When omitted, {@link formatCurrency} keeps the script produced by the active
 * locale (Persian digits for `fa-IR`, English digits for `en-US`, and so on).
 */
export type CurrencyDigits = 'persian' | 'english';

/**
 * How the currency unit is shown in formatted output.
 *
 * For `'IRR'`, `'USD'`, and `'EUR'`, values are passed to native
 * `Intl.NumberFormat` currency formatting.
 *
 * For `'IRT'`, labels are applied manually to match the same display modes:
 *
 * | `currencyDisplay` | `fa-IR` (default) | `en-US` |
 * | ----------------- | ----------------- | ------- |
 * | `'symbol'`        | `تومان` before the amount | `IRT` before the amount |
 * | `'narrowSymbol'`  | same as `'symbol'` | same as `'symbol'` |
 * | `'code'`          | `IRT` before the amount | `IRT` before the amount |
 * | `'name'`          | amount then `تومان` | amount then `tomans` |
 */
export type CurrencyDisplay = 'symbol' | 'narrowSymbol' | 'code' | 'name';

/**
 * Options for {@link formatCurrency}, {@link formatToman}, and {@link formatRial}.
 */
export interface FormatCurrencyOptions {
  /**
   * Currency code to format. Required for {@link formatCurrency}; omitted by
   * {@link formatToman} (`'IRT'`) and {@link formatRial} (`'IRR'`).
   */
  currency?: Currency;

  /**
   * BCP 47 locale tag passed to `Intl.NumberFormat`.
   *
   * Controls grouping and decimal separators, currency labels, and the default
   * digit script. Use `'fa-IR'` for Persian separators (`٬` / `٫`) and Persian
   * currency labels (`ریال`, `تومان`).
   *
   * @defaultValue `'fa-IR'`
   */
  locale?: string;

  /**
   * Override the digit script after locale formatting.
   *
   * @defaultValue locale default (no conversion)
   */
  digits?: CurrencyDigits;

  /**
   * Fixed decimal precision. Sets both {@link minimumFractionDigits} and
   * {@link maximumFractionDigits}. Takes precedence over those fields when set.
   */
  precision?: number;

  /**
   * Minimum number of digits after the decimal separator.
   *
   * When omitted, {@link formatCurrency} uses currency-specific defaults:
   * `0` for `'IRR'` / `'IRT'`, `2` for `'USD'` / `'EUR'`.
   */
  minimumFractionDigits?: number;

  /**
   * Maximum number of digits after the decimal separator.
   *
   * When omitted, {@link formatCurrency} uses currency-specific defaults:
   * `0` for `'IRR'` / `'IRT'`, `2` for `'USD'` / `'EUR'`.
   */
  maximumFractionDigits?: number;

  /**
   * Currency unit display style.
   *
   * @defaultValue `'symbol'`
   */
  currencyDisplay?: CurrencyDisplay;
}

/**
 * Options for {@link formatCurrency} where {@link FormatCurrencyOptions.currency}
 * is required.
 */
export interface FormatCurrencyOptionsWithCurrency extends FormatCurrencyOptions {
  currency: Currency;
}
