/**
 * Public API for @persian-web/core.
 */
export { toEnglishDigits, toPersianDigits } from './digits/index.js';
export { formatCurrency, formatRial, formatToman } from './currency/index.js';
export { formatNumber } from './format/index.js';
export { normalizePersian } from './normalize/index.js';
export { fixPersianTypography } from './typography/index.js';
export {
  includesPersian,
  matchesPersian,
  normalizeForSearch,
} from './search/index.js';
export { createPersianCollator, sortPersian } from './sort/index.js';
export {
  formatIranianPhone,
  isValidIranianPhone,
  normalizePhone,
} from './phone/index.js';
export { isValidNationalId, validateNationalId } from './national-id/index.js';
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
export type {
  NationalIdInvalidReason,
  ValidateNationalIdResult,
} from './national-id/index.js';
export type {
  PersianCollator,
  PersianCollatorOptions,
  SortPersianDirection,
  SortPersianOptions,
} from './sort/index.js';
