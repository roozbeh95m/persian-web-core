/**
 * RTL utilities and Persian typography helpers.
 *
 * Run: npm run build && node examples/rtl-and-typography.mjs
 */
import {
  getTextDirection,
  isRTL,
  isMixedDirection,
} from '../dist/direction/index.js';
import { fixPersianTypography } from '../dist/typography/index.js';
import { normalizePersian } from '../dist/normalize/index.js';

console.log('isRTL("سلام دنیا"):', isRTL('سلام دنیا')); // true
console.log('getTextDirection("Hello"):', getTextDirection('Hello')); // ltr
console.log('getTextDirection("Hello سلام"):', getTextDirection('Hello سلام')); // mixed
console.log(
  'isMixedDirection("محصول iPhone"):',
  isMixedDirection('محصول iPhone'),
); // true

console.log('fixPersianTypography("می رود"):', fixPersianTypography('می رود')); // می‌رود
console.log(
  'fixPersianTypography("سلام ، دنیا"):',
  fixPersianTypography('سلام ، دنیا'),
); // سلام، دنیا

console.log('normalizePersian("ي ك"):', normalizePersian('ي ك')); // ی ک
