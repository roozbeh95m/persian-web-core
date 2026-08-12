/**
 * Quick start: common Persian / Farsi web utilities from @persian-web/core.
 *
 * Run: npm run build && node examples/quick-start.mjs
 */
import {
  toPersianDigits,
  formatNumber,
  toJalali,
  formatJalali,
  isRTL,
  fixPersianTypography,
  normalizePersian,
} from '../dist/index.js';

console.log('--- Digits ---');
console.log(toPersianDigits('قیمت: 2500')); // قیمت: ۲۵۰۰

console.log('--- Normalization ---');
console.log(normalizePersian('كي')); // کی

console.log('--- Persian number formatting ---');
console.log(formatNumber(1_250_000, { locale: 'fa-IR' })); // ۱٬۲۵۰٬۰۰۰

console.log('--- Jalali date ---');
console.log(toJalali(2024, 3, 20)); // { year: 1403, month: 1, day: 1 }
console.log(
  formatJalali({ year: 1403, month: 1, day: 1 }, { digits: 'persian' }),
); // ۱۴۰۳/۰۱/۰۱

console.log('--- RTL ---');
console.log(isRTL('سلام دنیا')); // true

console.log('--- Persian typography ---');
console.log(fixPersianTypography('می رود')); // می‌رود
