import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import {
  formatIranianPhone,
  isValidIranianPhone,
  normalizePhone,
} from './index.js';

/**
 * Operator prefix ranges from MOBILE_PATTERN:
 * 9(?:0[1-9]|1\d|2[0-3]|3\d|4[01]|9\d)
 */
const VALID_PREFIXES = [
  ...Array.from({ length: 9 }, (_, i) => `90${i + 1}`),
  ...Array.from({ length: 10 }, (_, i) => `91${i}`),
  ...Array.from({ length: 4 }, (_, i) => `92${i}`),
  ...Array.from({ length: 10 }, (_, i) => `93${i}`),
  '940',
  '941',
  ...Array.from({ length: 10 }, (_, i) => `99${i}`),
] as const;

const INVALID_PREFIXES = [
  '900',
  '924',
  '925',
  '929',
  '942',
  '943',
  '950',
  '960',
  '970',
  '980',
] as const;

function buildMobile(prefix: string, subscriber: string): string {
  return `${prefix}${subscriber}`;
}

const subscriberArb = fc
  .tuple(...Array.from({ length: 7 }, () => fc.integer({ min: 0, max: 9 })))
  .map((digits) => digits.join(''));

const validMobileArb = fc
  .tuple(fc.constantFrom(...VALID_PREFIXES), subscriberArb)
  .map(([prefix, subscriber]) => buildMobile(prefix, subscriber));

describe('phone operator prefix matrix', () => {
  it.each([...VALID_PREFIXES])('accepts boundary-valid prefix %s', (prefix) => {
    const mobile = `${prefix}1234567`;
    expect(isValidIranianPhone(`0${mobile}`)).toBe(true);
    expect(normalizePhone(`0${mobile}`)).toBe(`+98${mobile}`);
  });

  it.each([...INVALID_PREFIXES])(
    'rejects boundary-invalid prefix %s',
    (prefix) => {
      const mobile = `${prefix}1234567`;
      expect(isValidIranianPhone(`0${mobile}`)).toBe(false);
      expect(normalizePhone(`0${mobile}`)).toBeNull();
    },
  );

  it('accepts mixed Persian/English digit scripts in one number', () => {
    expect(normalizePhone('۰۹۱2۱۲۳۴۵۶۷')).toBe('+989121234567');
    expect(isValidIranianPhone('۰۹۱2۱۲۳۴۵۶۷')).toBe(true);
  });

  it('formats with explicit digits english (default path)', () => {
    expect(formatIranianPhone('09121234567', { digits: 'english' })).toBe(
      '0912 123 4567',
    );
  });
});

describe('phone property-based', () => {
  it('normalizePhone ↔ formatIranianPhone round-trip for valid mobiles', () => {
    fc.assert(
      fc.property(validMobileArb, (mobile) => {
        const national = `0${mobile}`;
        const canonical = normalizePhone(national);
        expect(canonical).toBe(`+98${mobile}`);

        const formatted = formatIranianPhone(national);
        expect(formatted).not.toBeNull();
        expect(normalizePhone(formatted!)).toBe(canonical);

        const intl = formatIranianPhone(national, {
          format: 'international',
        });
        expect(normalizePhone(intl!)).toBe(canonical);
      }),
      { numRuns: 100 },
    );
  });

  it('isValidIranianPhone matches normalizePhone !== null', () => {
    fc.assert(
      fc.property(fc.string({ unit: 'binary', maxLength: 20 }), (input) => {
        expect(isValidIranianPhone(input)).toBe(normalizePhone(input) !== null);
      }),
      { numRuns: 100 },
    );
  });

  it('canonical E.164 is idempotent under normalizePhone', () => {
    fc.assert(
      fc.property(validMobileArb, (mobile) => {
        const canonical = `+98${mobile}`;
        expect(normalizePhone(canonical)).toBe(canonical);
        expect(normalizePhone(normalizePhone(canonical)!)).toBe(canonical);
      }),
      { numRuns: 50 },
    );
  });
});
