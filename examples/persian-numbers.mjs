/**
 * Persian digit conversion and number formatting.
 *
 * Run: npm run build && node examples/persian-numbers.mjs
 */
import { toPersianDigits, toEnglishDigits } from '../dist/digits/index.js';
import { formatNumber } from '../dist/format/index.js';
import { formatToman, formatRial } from '../dist/currency/index.js';

console.log('toPersianDigits:', toPersianDigits('SKU-2048')); // SKU-۲۰۴۸
console.log('toEnglishDigits:', toEnglishDigits('۱۲۳۴۵')); // 12345
console.log('mixed scripts → Persian:', toPersianDigits('order 1٢۳')); // order ۱۲۳

console.log(
  'formatNumber fa-IR:',
  formatNumber(1234567.89, { locale: 'fa-IR', precision: 2 }),
);
console.log(
  'formatNumber english digits + fa grouping:',
  formatNumber(1234567, { locale: 'fa-IR', digits: 'english' }),
);

console.log('formatToman:', formatToman(1_250_000));
console.log('formatRial:', formatRial(12_500_000));
