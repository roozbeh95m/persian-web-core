/**
 * Public API for @persian-web/core.
 */
export { toEnglishDigits, toPersianDigits } from './digits/index.js';
export { formatCurrency, formatRial, formatToman } from './currency/index.js';
export { formatNumber } from './format/index.js';
export { normalizePersian } from './normalize/index.js';
export {
  formatIranianPhone,
  isValidIranianPhone,
  normalizePhone,
} from './phone/index.js';
export type {
  Currency,
  CurrencyDigits,
  CurrencyDisplay,
  FormatCurrencyOptions,
  FormatCurrencyOptionsWithCurrency,
} from './currency/index.js';
export type {
  FormatNumberDigits,
  FormatNumberNotation,
  FormatNumberOptions,
} from './format/index.js';
export type {
  DigitNormalization,
  NormalizePersianOptions,
} from './normalize/index.js';
export type {
  FormatIranianPhoneOptions,
  IranianPhoneDigits,
  IranianPhoneFormat,
} from './phone/index.js';
