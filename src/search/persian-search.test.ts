import { describe, expect, it } from 'vitest';

import {
  clearSearchNormalizeCache,
  includesPersian,
  matchesPersian,
  normalizeForSearch,
} from './persian-search.js';

const ZWNJ = '\u200C';

describe('normalizeForSearch', () => {
  it('returns empty string for empty input', () => {
    expect(normalizeForSearch('')).toBe('');
  });

  it('returns the same reference for repeated empty input', () => {
    const empty = '';
    expect(normalizeForSearch(empty)).toBe(empty);
  });

  describe('Arabic/Persian variants', () => {
    it('normalizes Arabic Kaf to Persian Kaf', () => {
      expect(normalizeForSearch('كلاسیک')).toBe('کلاسیک');
      expect(normalizeForSearch('گوشی سامسونگ كلاسیک')).toBe(
        'گوشی سامسونگ کلاسیک',
      );
    });

    it('normalizes Arabic Yeh and Alef Maksura to Persian Yeh', () => {
      expect(normalizeForSearch('اين')).toBe('این');
      expect(normalizeForSearch('خانه‌اى')).toBe('خانهای');
    });

    it('normalizes ۀ and removes hamza from هٔ', () => {
      expect(normalizeForSearch('خانۀ ما')).toBe('خانه ما');
      expect(normalizeForSearch('خانهٔ ما')).toBe('خانه ما');
    });
  });

  describe('whitespace', () => {
    it('trims leading and trailing whitespace', () => {
      expect(normalizeForSearch('  سلام  ')).toBe('سلام');
    });

    it('collapses internal whitespace runs to a single space', () => {
      expect(normalizeForSearch('سلام\t\tدنیا')).toBe('سلام دنیا');
      expect(normalizeForSearch('خط\nدوم')).toBe('خط دوم');
      expect(normalizeForSearch('a   b\t\nc')).toBe('a b c');
    });

    it('returns empty string for whitespace-only input', () => {
      expect(normalizeForSearch('   \t\n  ')).toBe('');
    });
  });

  describe('digits', () => {
    it('converts Persian and Arabic-Indic digits to English', () => {
      expect(normalizeForSearch('۱۲۳')).toBe('123');
      expect(normalizeForSearch('٠١٢')).toBe('012');
      expect(normalizeForSearch('قیمت: ۲۵۰۰')).toBe('قیمت: 2500');
      expect(normalizeForSearch('سال 1403 / ۱۴۰۳ / ١٤٠٣')).toBe(
        'سال 1403 / 1403 / 1403',
      );
    });

    it('leaves English digits unchanged', () => {
      expect(normalizeForSearch('Galaxy S24')).toBe('galaxy s24');
    });
  });

  describe('diacritics', () => {
    it('removes Arabic diacritics', () => {
      expect(normalizeForSearch('مِنْ')).toBe('من');
      expect(normalizeForSearch('كِتَابٌ')).toBe('کتاب');
      expect(normalizeForSearch('بَرْنامِه')).toBe('برنامه');
    });
  });

  describe('ZWNJ', () => {
    it('removes all ZWNJ characters', () => {
      expect(normalizeForSearch(`می${ZWNJ}روم`)).toBe('میروم');
      expect(normalizeForSearch(`خانه${ZWNJ}ام`)).toBe('خانهام');
      expect(normalizeForSearch(`می${ZWNJ}${ZWNJ}روم`)).toBe('میروم');
      expect(normalizeForSearch(`${ZWNJ}متن${ZWNJ}`)).toBe('متن');
    });

    it('does not treat ZWNJ as whitespace (removed instead of collapsed)', () => {
      expect(normalizeForSearch(`می ${ZWNJ}روم`)).toBe('می روم');
    });
  });

  describe('Latin case', () => {
    it('folds ASCII uppercase to lowercase', () => {
      expect(normalizeForSearch('Samsung Galaxy S24')).toBe(
        'samsung galaxy s24',
      );
      expect(normalizeForSearch('iPhone 15 Pro MAX')).toBe('iphone 15 pro max');
    });

    it('does not alter Persian letters', () => {
      expect(normalizeForSearch('گوشی SAMSUNG')).toBe('گوشی samsung');
    });

    it('leaves lowercase Latin unchanged', () => {
      const input = 'already lowercase';
      expect(normalizeForSearch(input)).toBe(input);
    });
  });

  describe('memoization', () => {
    it('returns the same normalized string for repeated inputs', () => {
      clearSearchNormalizeCache();
      const input = 'گوشی سامسونگ كلاسیک';
      const first = normalizeForSearch(input);
      const second = normalizeForSearch(input);
      expect(second).toBe(first);
    });

    it('does not mutate the input string', () => {
      const input = '  كي  ';
      const snapshot = input.slice();
      normalizeForSearch(input);
      expect(input).toBe(snapshot);
    });
  });

  describe('idempotency', () => {
    it('is idempotent for normalized output', () => {
      const samples = [
        'گوشی سامسونگ كلاسیک',
        `می${ZWNJ}روم`,
        'مِنْ ١٢٣',
        '  Samsung GALAXY  ',
        'خانۀ بزرگ',
      ];

      for (const sample of samples) {
        const once = normalizeForSearch(sample);
        const twice = normalizeForSearch(once);
        expect(twice).toBe(once);
      }
    });
  });
});

describe('matchesPersian', () => {
  describe('empty query', () => {
    it('matches any text when query is empty', () => {
      expect(matchesPersian('گوشی', '')).toBe(true);
      expect(matchesPersian('', '')).toBe(true);
      expect(matchesPersian('Samsung Galaxy S24 Ultra', '')).toBe(true);
    });
  });

  describe('empty text', () => {
    it('does not match a non-empty query', () => {
      expect(matchesPersian('', 'گوشی')).toBe(false);
    });

    it('matches whitespace-only query after normalization', () => {
      expect(matchesPersian('', ' ')).toBe(true);
      expect(matchesPersian('', '\t\n')).toBe(true);
    });
  });

  describe('Arabic/Persian equivalence', () => {
    it('matches when only Kaf/Yeh variants differ', () => {
      expect(matchesPersian('گوشی سامسونگ كلاسیک', 'گوشی سامسونگ کلاسیک')).toBe(
        true,
      );
      expect(matchesPersian('اين كتاب', 'این کتاب')).toBe(true);
    });
  });

  describe('whitespace equivalence', () => {
    it('matches after whitespace normalization', () => {
      expect(matchesPersian('  سلام   دنیا  ', 'سلام دنیا')).toBe(true);
      expect(matchesPersian('سلام\t\tدنیا', 'سلام دنیا')).toBe(true);
    });
  });

  describe('digit equivalence', () => {
    it('matches across digit scripts', () => {
      expect(matchesPersian('قیمت 2500', 'قیمت ۲۵۰۰')).toBe(true);
      expect(matchesPersian('مدل S24', 'مدل s24')).toBe(true);
    });
  });

  describe('diacritic equivalence', () => {
    it('matches when diacritics differ', () => {
      expect(matchesPersian('مِن', 'من')).toBe(true);
      expect(matchesPersian('برنامه', 'بَرْنامِه')).toBe(true);
    });
  });

  describe('ZWNJ equivalence', () => {
    it('matches joined and ZWNJ-separated spellings', () => {
      expect(matchesPersian(`می${ZWNJ}روم`, 'میروم')).toBe(true);
      expect(matchesPersian('میروم', `می${ZWNJ}روم`)).toBe(true);
    });
  });

  describe('Latin case', () => {
    it('matches regardless of ASCII case', () => {
      expect(matchesPersian('Samsung Galaxy', 'samsung galaxy')).toBe(true);
      expect(matchesPersian('IPHONE 15', 'iphone 15')).toBe(true);
    });

    it('is case-sensitive for non-ASCII letters outside folding scope', () => {
      expect(matchesPersian('گوشی', 'گوشی')).toBe(true);
      expect(matchesPersian('گوشی', 'GOUSHI')).toBe(false);
    });
  });

  it('returns false for non-matching strings', () => {
    expect(matchesPersian('گوشی سامسونگ', 'گوشی اپل')).toBe(false);
    expect(matchesPersian('Samsung', 'Apple')).toBe(false);
  });
});

describe('includesPersian', () => {
  describe('empty query', () => {
    it('matches any text when query is empty', () => {
      expect(includesPersian('گوشی سامسونگ', '')).toBe(true);
      expect(includesPersian('', '')).toBe(true);
    });
  });

  describe('empty text', () => {
    it('does not include a non-empty query', () => {
      expect(includesPersian('', 'سامسونگ')).toBe(false);
      expect(includesPersian('', 'a')).toBe(false);
    });

    it('includes whitespace-only query after normalization', () => {
      expect(includesPersian('', ' ')).toBe(true);
    });
  });

  describe('real Persian search scenarios', () => {
    const catalog = [
      'گوشی موبایل سامسونگ Galaxy S24 Ultra 256GB',
      'گوشی سامسونگ كلاسیک B310',
      'لپ‌تاپ ایسوس VivoBook 15',
      'هدفون بلوتوثی Sony WH-1000XM5',
      'کتاب برنامه‌نویسی JavaScript مدرن',
      'شامپو تقویت‌کننده مو سریتا',
      'یخچال فریزر دو قلو ال‌جی 34 فوت',
      'کفش ورزشی نایک Air Max',
      'قیمت: ۲۵٬۹۰۰٬۰۰۰ ریال',
      'آدرس: تهران، خیابان ولیعصر، پلاک ۱۲۳',
    ];

    it('finds Samsung products with Arabic Kaf in query', () => {
      expect(
        catalog.filter((item) => includesPersian(item, 'سامسونگ')),
      ).toHaveLength(2);
      expect(
        catalog.filter((item) => includesPersian(item, 'سامسونگ كلاس')),
      ).toHaveLength(1);
    });

    it('finds Samsung products with Persian Kaf in query', () => {
      expect(
        catalog.filter((item) => includesPersian(item, 'سامسونگ کلاس')),
      ).toHaveLength(1);
      expect(
        catalog.filter((item) => includesPersian(item, 'سامسونگ')),
      ).toHaveLength(2);
    });

    it('finds items by English model name case-insensitively', () => {
      expect(
        catalog.filter((item) => includesPersian(item, 'galaxy s24')),
      ).toHaveLength(1);
      expect(
        catalog.filter((item) => includesPersian(item, 'GALAXY S24')),
      ).toHaveLength(1);
    });

    it('finds items by Persian keyword with ZWNJ in catalog data', () => {
      expect(
        catalog.filter((item) => includesPersian(item, 'برنامهنویسی')),
      ).toHaveLength(1);
      expect(
        catalog.filter((item) => includesPersian(item, `برنامه${ZWNJ}نویسی`)),
      ).toHaveLength(1);
      expect(
        catalog.filter((item) => includesPersian(item, 'javascript')),
      ).toHaveLength(1);
    });

    it('finds price entries using digit substrings across scripts', () => {
      expect(
        catalog.filter((item) => includesPersian(item, '900')),
      ).toHaveLength(1);
      expect(
        catalog.filter((item) => includesPersian(item, '۹۰۰')),
      ).toHaveLength(1);
    });

    it('finds address by building number across digit scripts', () => {
      expect(
        catalog.filter((item) => includesPersian(item, 'پلاک 123')),
      ).toHaveLength(1);
      expect(
        catalog.filter((item) => includesPersian(item, 'پلاک ۱۲۳')),
      ).toHaveLength(1);
    });

    it('returns no matches for unrelated queries', () => {
      expect(
        catalog.filter((item) => includesPersian(item, 'ماشین لباسشویی')),
      ).toHaveLength(0);
    });
  });

  describe('substring matching', () => {
    it('matches partial product names', () => {
      expect(includesPersian('گوشی سامسونگ Galaxy S24', 'سامسونگ')).toBe(true);
      expect(includesPersian('گوشی سامسونگ Galaxy S24', 'galaxy')).toBe(true);
    });

    it('does not match when substring is absent', () => {
      expect(includesPersian('گوشی سامسونگ Galaxy S24', 'اپل')).toBe(false);
    });
  });

  describe('cross-variant equivalence', () => {
    it('matches Arabic/Persian character variants in substring search', () => {
      expect(includesPersian('گوشی سامسونگ كلاسیک', 'كلاس')).toBe(true);
      expect(includesPersian('گوشی سامسونگ کلاسیک', 'كلاس')).toBe(true);
    });

    it('matches across diacritic differences', () => {
      expect(includesPersian('كِتَابخانه مرکزی', 'کتاب')).toBe(true);
    });

    it('matches ZWNJ-insensitive substrings', () => {
      expect(includesPersian(`می${ZWNJ}خواهم بروم`, 'میخو')).toBe(true);
    });
  });
});

describe('search normalization uses normalizePersian internally', () => {
  it('does not match when only unrelated Arabic letters differ', () => {
    // normalizePersian leaves ة unchanged — search should too.
    expect(matchesPersian('مكة', 'مکة')).toBe(true); // ك→ک
    expect(includesPersian('علي احمد', 'علی')).toBe(true); // ي→ی
  });
});

describe('clearSearchNormalizeCache', () => {
  it('allows re-normalization after cache clear', () => {
    clearSearchNormalizeCache();
    const input = 'گوشی سامسونگ';
    const first = normalizeForSearch(input);
    clearSearchNormalizeCache();
    const second = normalizeForSearch(input);
    expect(second).toBe(first);
  });
});
