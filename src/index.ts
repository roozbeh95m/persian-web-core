/**
 * Public API for @persian-web/core.
 */
export { toEnglishDigits, toPersianDigits } from './digits/index.js';
export { formatNumber } from './format/index.js';
export { normalizePersian } from './normalize/index.js';
export type {
  FormatNumberDigits,
  FormatNumberNotation,
  FormatNumberOptions,
} from './format/index.js';
export type {
  DigitNormalization,
  NormalizePersianOptions,
} from './normalize/index.js';
