/**
 * Jalali (Persian calendar) date conversion and formatting.
 *
 * Run: npm run build && node examples/jalali-date.mjs
 */
import {
  toJalali,
  toGregorian,
  formatJalali,
  relativeTime,
} from '../dist/date/index.js';

const nowruz = toJalali(2024, 3, 20);
console.log('Gregorian 2024-03-20 → Jalali:', nowruz);
// { year: 1403, month: 1, day: 1 }

console.log('Jalali 1403-01-01 → Gregorian:', toGregorian(1403, 1, 1));
// { year: 2024, month: 3, day: 20 }

console.log(
  'formatJalali (Persian digits):',
  formatJalali(nowruz, { pattern: 'YYYY/MM/DD', digits: 'persian' }),
);
// ۱۴۰۳/۰۱/۰۱

const past = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
console.log('relativeTime (fa):', relativeTime(past, new Date()));
