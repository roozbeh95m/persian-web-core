/**
 * Iranian phone numbers and national ID (کد ملی) helpers.
 *
 * Run: npm run build && node examples/iranian-forms.mjs
 */
import {
  normalizePhone,
  isValidIranianPhone,
  formatIranianPhone,
} from '../dist/phone/index.js';
import {
  isValidNationalId,
  validateNationalId,
} from '../dist/national-id/index.js';

const mobile = '۰۹۱۲۱۲۳۴۵۶۷';
console.log('normalizePhone:', normalizePhone(mobile)); // +989121234567
console.log('isValidIranianPhone:', isValidIranianPhone(mobile)); // true
console.log(
  'formatIranianPhone (national):',
  formatIranianPhone(mobile, { format: 'national' }),
);

// Example checksum-valid national ID used in library tests (not a real person).
const nationalId = '0013542419';
console.log('isValidNationalId:', isValidNationalId(nationalId));
console.log('validateNationalId:', validateNationalId(nationalId));
console.log('validateNationalId (invalid):', validateNationalId('123'));
