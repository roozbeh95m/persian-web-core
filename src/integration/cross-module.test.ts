import { describe, expect, it } from 'vitest';

import {
  includesPersian,
  normalizeForSearch,
  normalizePersian,
  persianSlug,
  sortPersian,
  fixPersianTypography,
  toEnglishDigits,
  toPersianDigits,
} from '../index.js';

describe('cross-module integration', () => {
  it('normalizes, searches, sorts, and slugifies a product catalog pipeline', () => {
    const titles = [
      'گوشی سامسونگ كلاسیک S25',
      'آيفون ۱۵ پرو',
      'لپ‌تاپ لنوو',
      'كيبرد مکانیکی',
    ];

    const normalized = titles.map((title) =>
      normalizePersian(title, {
        digits: 'english',
        removeDiacritics: true,
        normalizeWhitespace: true,
      }),
    );

    expect(normalized).toEqual([
      'گوشی سامسونگ کلاسیک S25',
      'آیفون 15 پرو',
      'لپ‌تاپ لنوو',
      'کیبرد مکانیکی',
    ]);

    const searchable = titles.filter((title) => includesPersian(title, 'كلاس'));
    expect(searchable).toEqual(['گوشی سامسونگ كلاسیک S25']);

    const sorted = sortPersian(titles);
    expect(sorted[0]).toBe('آيفون ۱۵ پرو');
    expect(sorted.at(-1)).toBe('لپ‌تاپ لنوو');

    const slugs = titles.map((title) => persianSlug(title));
    expect(slugs).toEqual([
      'گوشی-سامسونگ-کلاسیک-s25',
      'آیفون-15-پرو',
      'لپ-تاپ-لنوو',
      'کیبرد-مکانیکی',
    ]);

    for (const slug of slugs) {
      expect(persianSlug(slug)).toBe(slug);
      expect(normalizeForSearch(slug)).toBe(normalizeForSearch(slug));
    }
  });

  it('composes digit conversion with typography and search', () => {
    const raw = 'می رود — قیمت: ٢٥٠٠ تومان';
    const typed = fixPersianTypography(raw);
    expect(typed).toContain('\u200C');

    const searchable = normalizeForSearch(typed);
    expect(searchable).toContain('میرود');
    expect(searchable).toContain('2500');

    expect(toPersianDigits(toEnglishDigits(searchable))).toBe(
      toPersianDigits(searchable),
    );
  });

  it('idempotent normalize → search key pipeline', () => {
    const samples = [
      '',
      'كي',
      `می\u200C\u200Cروم`,
      '  Galaxy S۲۴  ',
      'خانۀ دوست',
      'مِنْ كِتَابٌ',
    ];

    for (const sample of samples) {
      const normalized = normalizePersian(sample, {
        digits: 'english',
        removeDiacritics: true,
        normalizeWhitespace: true,
      });
      expect(
        normalizePersian(normalized, {
          digits: 'english',
          removeDiacritics: true,
          normalizeWhitespace: true,
        }),
      ).toBe(normalized);

      const searchKey = normalizeForSearch(sample);
      expect(normalizeForSearch(searchKey)).toBe(searchKey);
      expect(normalizeForSearch(normalized)).toBe(searchKey);
    }
  });
});
