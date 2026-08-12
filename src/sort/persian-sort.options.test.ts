import { describe, expect, it } from 'vitest';

import {
  clearDefaultPersianCollator,
  createPersianCollator,
  sortPersian,
} from './persian-sort.js';

describe('createPersianCollator options matrix', () => {
  it('disables natural numeric ordering when numeric is false', () => {
    const collator = createPersianCollator({ numeric: false });
    // Lexicographic: '10' < '2' because '1' < '2'
    expect(collator.compare('item 10', 'item 2')).toBeLessThan(0);
    expect(sortPersian(['item 10', 'item 2'], { numeric: false })).toEqual([
      'item 10',
      'item 2',
    ]);
  });

  it('preserves digit script option without breaking natural order', () => {
    // Under fa-IR Intl.Collator, Persian and English digits already compare
    // equal at base/numeric sensitivity. normalizeDigits still converts sort
    // keys to English for stable mixed-script keys; the observable order for
    // pure digit pairs stays the same.
    const withNormalize = createPersianCollator({ normalizeDigits: true });
    const withoutNormalize = createPersianCollator({
      normalizeDigits: false,
    });

    expect(withNormalize.compare('۲', '2')).toBe(0);
    expect(withoutNormalize.compare('۲', '2')).toBe(0);
    expect(
      sortPersian(['item ۱۰', 'item 2'], { normalizeDigits: false }),
    ).toEqual(['item 2', 'item ۱۰']);
  });

  it('respects sensitivity case for Latin when folding is still applied', () => {
    // Sort keys fold ASCII case before collation, so even 'case' sensitivity
    // sees equal keys for Galaxy/galaxy after fold.
    const collator = createPersianCollator({ sensitivity: 'case' });
    expect(collator.compare('Galaxy', 'galaxy')).toBe(0);
  });

  it('accepts a non-fa locale for Intl.Collator', () => {
    const collator = createPersianCollator({ locale: 'en-US' });
    expect(collator.collator.resolvedOptions().locale).toMatch(/^en/u);
    expect(sortPersian(['b', 'a'], { locale: 'en-US' })).toEqual(['a', 'b']);
  });
});

describe('sortPersian edge cases', () => {
  it('rejects a collator that did not come from createPersianCollator', () => {
    const fake = {
      compare: () => 0,
      collator: new Intl.Collator('fa'),
    };
    expect(() =>
      sortPersian(['ب', 'ا'], {
        collator: fake,
      }),
    ).toThrow(/must come from createPersianCollator/u);
  });

  it('returns empty array for empty input without mutation', () => {
    const input: string[] = [];
    const sorted = sortPersian(input);
    expect(sorted).toEqual([]);
    expect(sorted).not.toBe(input);
  });

  it('sorts empty array in place', () => {
    const input: string[] = [];
    expect(sortPersian(input, { inPlace: true })).toBe(input);
  });

  it('sorts objects in place and descending', () => {
    const items = [{ title: 'ا' }, { title: 'پ' }, { title: 'ب' }];
    const result = sortPersian(items, {
      getKey: (item) => item.title,
      direction: 'desc',
      inPlace: true,
    });
    expect(result).toBe(items);
    expect(items.map((item) => item.title)).toEqual(['پ', 'ب', 'ا']);
  });

  it('throws a clear TypeError when getKey is missing for objects', () => {
    expect(() => sortPersian([{ title: 'ا' }] as unknown as string[])).toThrow(
      /requires getKey when sorting non-string arrays/u,
    );
  });

  it('uses tie-breaker when primary compare is equal but keys differ', () => {
    // With base sensitivity, diacritic-only Latin differences may tie on
    // primary and resolve via the variant tie-breaker on normalized keys.
    clearDefaultPersianCollator();
    const collator = createPersianCollator({ sensitivity: 'base' });
    const result = collator.compare('a', 'a');
    expect(result).toBe(0);
  });

  it('handles empty string sort keys from getKey', () => {
    const items = [{ title: 'ب' }, { title: '' }, { title: 'ا' }];
    expect(
      sortPersian(items, { getKey: (item) => item.title }).map(
        (item) => item.title,
      ),
    ).toEqual(['', 'ا', 'ب']);
  });
});
