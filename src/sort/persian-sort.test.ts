import { describe, expect, it } from 'vitest';

import {
  clearDefaultPersianCollator,
  createPersianCollator,
  sortPersian,
} from './persian-sort.js';

describe('createPersianCollator', () => {
  it('returns a collator with compare and underlying Intl.Collator', () => {
    const collator = createPersianCollator();
    expect(collator.compare).toBeTypeOf('function');
    expect(collator.collator).toBeInstanceOf(Intl.Collator);
    expect(collator.collator.resolvedOptions().locale).toMatch(/^fa/);
  });

  describe('Persian alphabet', () => {
    it('orders letters in standard Persian sequence', () => {
      const collator = createPersianCollator();
      const letters = [
        'ی',
        'ه',
        'و',
        'ن',
        'م',
        'ل',
        'گ',
        'ک',
        'ق',
        'ف',
        'ب',
        'ا',
        'پ',
      ];
      const sorted = [...letters].sort(collator.compare);
      expect(sorted).toEqual([
        'ا',
        'ب',
        'پ',
        'ف',
        'ق',
        'ک',
        'گ',
        'ل',
        'م',
        'ن',
        'و',
        'ه',
        'ی',
      ]);
    });
  });

  describe('Arabic/Persian variants', () => {
    it('treats Arabic Kaf and Persian Kaf as equal', () => {
      const collator = createPersianCollator();
      expect(collator.compare('كلاسیک', 'کلاسیک')).toBe(0);
    });

    it('treats Arabic Yeh and Persian Yeh as equal', () => {
      const collator = createPersianCollator();
      expect(collator.compare('اين', 'این')).toBe(0);
    });

    it('sorts Arabic and Persian spellings adjacently', () => {
      const collator = createPersianCollator();
      const sorted = ['كلاسیک', 'کلاسیک', 'گوشی'].sort(collator.compare);
      expect(sorted.slice(0, 2).sort()).toEqual(['كلاسیک', 'کلاسیک']);
      expect(sorted[2]).toBe('گوشی');
    });
  });

  describe('mixed strings', () => {
    it('sorts mixed Persian and Latin text predictably', () => {
      const sorted = sortPersian([
        'گوشی Galaxy',
        'آیفون',
        'Samsung سامسونگ',
        'ال‌جی',
      ]);
      expect(sorted).toEqual([
        'آیفون',
        'ال‌جی',
        'گوشی Galaxy',
        'Samsung سامسونگ',
      ]);
    });

    it('folds ASCII Latin case with base sensitivity', () => {
      const collator = createPersianCollator();
      expect(collator.compare('galaxy', 'Galaxy')).toBe(0);
    });
  });

  describe('empty strings', () => {
    it('sorts empty strings before non-empty values', () => {
      const collator = createPersianCollator();
      expect(collator.compare('', 'a')).toBeLessThan(0);
      expect(collator.compare('', 'سلام')).toBeLessThan(0);
    });

    it('treats two empty strings as equal', () => {
      const collator = createPersianCollator();
      expect(collator.compare('', '')).toBe(0);
    });
  });

  describe('numbers', () => {
    it('sorts numeric sequences naturally', () => {
      const sorted = sortPersian(['item 10', 'item 2', 'item 1']);
      expect(sorted).toEqual(['item 1', 'item 2', 'item 10']);
    });

    it('treats Persian and English digits consistently', () => {
      const collator = createPersianCollator();
      expect(collator.compare('۲', '2')).toBe(0);
      expect(collator.compare('۱۲', '12')).toBe(0);
    });

    it('orders standalone digit strings numerically', () => {
      expect(sortPersian(['10', '2', '۱۰', '۲'])).toEqual([
        '2',
        '۲',
        '10',
        '۱۰',
      ]);
    });
  });
});

describe('sortPersian', () => {
  it('returns a new array by default without mutating the input', () => {
    const input = ['ب', 'ا'];
    const sorted = sortPersian(input);
    expect(sorted).toEqual(['ا', 'ب']);
    expect(input).toEqual(['ب', 'ا']);
    expect(sorted).not.toBe(input);
  });

  it('sorts in place when inPlace is true', () => {
    const input = ['ب', 'ا'];
    const result = sortPersian(input, { inPlace: true });
    expect(result).toBe(input);
    expect(input).toEqual(['ا', 'ب']);
  });

  it('sorts descending when direction is desc', () => {
    expect(sortPersian(['ب', 'ا', 'پ'], { direction: 'desc' })).toEqual([
      'پ',
      'ب',
      'ا',
    ]);
  });

  describe('object sorting', () => {
    it('sorts objects by getKey accessor', () => {
      const items = [
        { id: 2, title: 'گوشی سامسونگ' },
        { id: 1, title: 'آیفون' },
        { id: 3, title: 'لپ‌تاپ لنوو' },
      ];

      const sorted = sortPersian(items, { getKey: (item) => item.title });
      expect(sorted.map((item) => item.id)).toEqual([1, 2, 3]);
    });

    it('does not mutate the original object array', () => {
      const items = [{ title: 'ب' }, { title: 'ا' }];
      const copy = [...items];
      sortPersian(items, { getKey: (item) => item.title });
      expect(items).toEqual(copy);
    });

    it('requires getKey for non-string arrays', () => {
      const items = [{ title: 'ا' }];
      expect(() => sortPersian(items as unknown as string[])).toThrow(
        TypeError,
      );
    });
  });

  it('reuses a provided collator', () => {
    const collator = createPersianCollator();
    expect(sortPersian(['ب', 'ا'], { collator })).toEqual(['ا', 'ب']);
  });

  it('rejects mixing collator with collation options', () => {
    const collator = createPersianCollator();
    expect(() => sortPersian(['ب', 'ا'], { collator, numeric: false })).toThrow(
      TypeError,
    );
  });

  it('uses cached default collator across calls', () => {
    clearDefaultPersianCollator();
    expect(sortPersian(['ب', 'ا'])).toEqual(['ا', 'ب']);
    expect(sortPersian(['پ', 'ب'])).toEqual(['ب', 'پ']);
  });
});
