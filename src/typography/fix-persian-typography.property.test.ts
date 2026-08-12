import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { fixPersianTypography } from './index.js';

describe('fixPersianTypography property-based', () => {
  it('is idempotent for arbitrary Unicode', () => {
    fc.assert(
      fc.property(fc.string({ unit: 'binary' }), (input) => {
        const once = fixPersianTypography(input);
        expect(fixPersianTypography(once)).toBe(once);
      }),
      { numRuns: 150 },
    );
  });
});
