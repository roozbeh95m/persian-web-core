import { describe, expect, it } from 'vitest';

import { persianSlug } from './index.js';

const ZWNJ = '\u200C';
const ARABIC_YEH = 'ي';
const PERSIAN_YEH = 'ی';
const ARABIC_KAF = 'ك';
const PERSIAN_KAF = 'ک';

function assertIdempotent(input: string): void {
  const once = persianSlug(input);
  const twice = persianSlug(once);
  expect(twice).toBe(once);
}

describe('persianSlug', () => {
  describe('empty and whitespace-only input', () => {
    it('returns empty string for empty input', () => {
      expect(persianSlug('')).toBe('');
    });

    it('returns empty string for whitespace-only input', () => {
      expect(persianSlug('   ')).toBe('');
      expect(persianSlug('\t\n\r')).toBe('');
      expect(persianSlug('\u00a0\u2003')).toBe('');
    });

    it('returns empty string for punctuation-only input', () => {
      expect(persianSlug('!!!')).toBe('');
      expect(persianSlug('...')).toBe('');
      expect(persianSlug('@#$%^&*()')).toBe('');
    });

    it('returns the same reference for empty input', () => {
      const empty = '';
      expect(persianSlug(empty)).toBe(empty);
    });

    it('is idempotent for empty input', () => {
      assertIdempotent('');
    });
  });

  describe('basic slugification', () => {
    it('converts the documented example', () => {
      expect(persianSlug('گوشی سامسونگ گلکسی S25')).toBe(
        'گوشی-سامسونگ-گلکسی-s25',
      );
    });

    it('converts spaces to hyphens', () => {
      expect(persianSlug('سلام دنیا')).toBe('سلام-دنیا');
      expect(persianSlug('one two three')).toBe('one-two-three');
    });

    it('trims leading and trailing whitespace', () => {
      expect(persianSlug('  سلام  ')).toBe('سلام');
      expect(persianSlug('  hello world  ')).toBe('hello-world');
    });

    it('collapses internal whitespace runs to a single hyphen', () => {
      expect(persianSlug('سلام    دنیا')).toBe('سلام-دنیا');
      expect(persianSlug('foo\t\tbar')).toBe('foo-bar');
      expect(persianSlug('a\n\n\nb')).toBe('a-b');
    });

    it('is idempotent for basic slugs', () => {
      assertIdempotent('گوشی سامسونگ گلکسی S25');
      assertIdempotent('سلام دنیا');
    });
  });

  describe('Persian character normalization', () => {
    it('normalizes Arabic Yeh to Persian Yeh', () => {
      expect(persianSlug(`گوش${ARABIC_YEH}`)).toBe(`گوش${PERSIAN_YEH}`);
      expect(persianSlug('پياده')).toBe('پیاده');
    });

    it('normalizes Arabic Kaf to Persian Kaf', () => {
      expect(persianSlug(`${ARABIC_KAF}تاب`)).toBe(`${PERSIAN_KAF}تاب`);
      expect(persianSlug('كيك')).toBe('کیک');
    });

    it('removes Arabic diacritics', () => {
      expect(persianSlug('مِنْ')).toBe('من');
      expect(persianSlug('قِیمَت')).toBe('قیمت');
    });

    it('does not transliterate Persian to Latin', () => {
      expect(persianSlug('سلام')).toBe('سلام');
      expect(persianSlug('ایران')).toBe('ایران');
      expect(persianSlug('گوشی موبایل')).toBe('گوشی-موبایل');
      expect(persianSlug('سلام')).not.toMatch(/[a-z]/);
    });

    it('is idempotent after Persian normalization', () => {
      assertIdempotent('پياده');
      assertIdempotent('كتاب');
      assertIdempotent('مِنْ');
    });
  });

  describe('Latin characters', () => {
    it('preserves ASCII Latin letters and folds case', () => {
      expect(persianSlug('Galaxy S24 Ultra')).toBe('galaxy-s24-ultra');
      expect(persianSlug('iPhone 15 Pro Max')).toBe('iphone-15-pro-max');
      expect(persianSlug('USB-C')).toBe('usb-c');
    });

    it('preserves Latin mixed with Persian', () => {
      expect(persianSlug('گوشی Samsung A55')).toBe('گوشی-samsung-a55');
      expect(persianSlug('لپ‌تاپ MacBook Pro')).toBe('لپ-تاپ-macbook-pro');
    });

    it('strips non-ASCII Latin letters without transliterating Persian', () => {
      expect(persianSlug('café résumé')).toBe('caf-r-sum');
      expect(persianSlug('naïve')).toBe('na-ve');
    });

    it('is idempotent for Latin segments', () => {
      assertIdempotent('Galaxy S24 Ultra');
      assertIdempotent('گوشی Samsung A55');
    });
  });

  describe('numbers and digits', () => {
    it('converts Persian digits to English', () => {
      expect(persianSlug('قیمت ۲۵۰۰')).toBe('قیمت-2500');
      expect(persianSlug('مدل ۱۴۰۳')).toBe('مدل-1403');
    });

    it('converts Arabic-Indic digits to English', () => {
      expect(persianSlug('قیمت ٢٥٠٠')).toBe('قیمت-2500');
    });

    it('preserves English digits', () => {
      expect(persianSlug('S25 256GB')).toBe('s25-256gb');
      expect(persianSlug('404 error')).toBe('404-error');
    });

    it('keeps digits adjacent to Persian and Latin text', () => {
      expect(persianSlug('گلکسی S25')).toBe('گلکسی-s25');
      expect(persianSlug('iPhone15')).toBe('iphone15');
    });

    it('is idempotent for digit normalization', () => {
      assertIdempotent('قیمت ۲۵۰۰');
      assertIdempotent('S25 256GB');
    });
  });

  describe('punctuation and unsafe characters', () => {
    it('removes unsafe punctuation', () => {
      expect(persianSlug('گوشی! سامسونگ')).toBe('گوشی-سامسونگ');
      expect(persianSlug('hello@world.com')).toBe('hello-world-com');
      expect(persianSlug('foo/bar\\baz')).toBe('foo-bar-baz');
    });

    it('treats punctuation as word separators', () => {
      expect(persianSlug('قیمت: ۲۵۰۰')).toBe('قیمت-2500');
      expect(persianSlug('گوشی (سامسونگ)')).toBe('گوشی-سامسونگ');
      expect(persianSlug('a.b,c;d:e')).toBe('a-b-c-d-e');
    });

    it('strips quotes and brackets', () => {
      expect(persianSlug('"گوشی" \'موبایل\'')).toBe('گوشی-موبایل');
      expect(persianSlug('[Samsung] {Galaxy}')).toBe('samsung-galaxy');
    });

    it('is idempotent when punctuation was removed', () => {
      assertIdempotent('گوشی! سامسونگ');
      assertIdempotent('قیمت: ۲۵۰۰');
    });
  });

  describe('hyphens', () => {
    it('collapses repeated hyphens', () => {
      expect(persianSlug('foo--bar')).toBe('foo-bar');
      expect(persianSlug('گوشی---سامسونگ')).toBe('گوشی-سامسونگ');
      expect(persianSlug('a - - - b')).toBe('a-b');
    });

    it('trims leading and trailing hyphens', () => {
      expect(persianSlug('-hello-')).toBe('hello');
      expect(persianSlug('---گوشی---')).toBe('گوشی');
      expect(persianSlug(' - سلام - ')).toBe('سلام');
    });

    it('preserves single internal hyphens from input', () => {
      expect(persianSlug('USB-C port')).toBe('usb-c-port');
      expect(persianSlug('گوشی-سامسونگ')).toBe('گوشی-سامسونگ');
    });

    it('is idempotent for hyphen edge cases', () => {
      assertIdempotent('foo--bar');
      assertIdempotent('-hello-');
      assertIdempotent('گوشی---سامسونگ');
    });
  });

  describe('ZWNJ (zero-width non-joiner)', () => {
    it('converts ZWNJ to a hyphen', () => {
      expect(persianSlug(`می${ZWNJ}رود`)).toBe('می-رود');
      expect(persianSlug(`نمی${ZWNJ}توان`)).toBe('نمی-توان');
    });

    it('handles ZWNJ in mixed Persian-Latin text', () => {
      expect(persianSlug(`لپ${ZWNJ}تاپ MacBook`)).toBe('لپ-تاپ-macbook');
    });

    it('does not leave raw ZWNJ in output', () => {
      const slug = persianSlug(`می${ZWNJ}رود`);
      expect(slug).not.toContain(ZWNJ);
    });

    it('is idempotent after ZWNJ conversion', () => {
      assertIdempotent(`می${ZWNJ}رود`);
    });
  });

  describe('real-world product and content titles', () => {
    it('slugifies e-commerce style titles', () => {
      expect(persianSlug('گوشی سامسونگ Galaxy S24 Ultra 256GB')).toBe(
        'گوشی-سامسونگ-galaxy-s24-ultra-256gb',
      );
      expect(persianSlug('کتاب «شازده کوچولو»')).toBe('کتاب-شازده-کوچولو');
    });

    it('slugifies blog-style headings', () => {
      expect(persianSlug('  ۱۰ نکته برای خرید لپ‌تاپ  ')).toBe(
        '10-نکته-برای-خرید-لپ-تاپ',
      );
      expect(persianSlug('چگونه PHP را یاد بگیریم؟')).toBe(
        'چگونه-php-را-یاد-بگیریم',
      );
    });

    it('slugifies paths with mixed separators', () => {
      expect(persianSlug('category/sub: گوشی موبایل')).toBe(
        'category-sub-گوشی-موبایل',
      );
    });

    it('is idempotent for real-world titles', () => {
      assertIdempotent('گوشی سامسونگ Galaxy S24 Ultra 256GB');
      assertIdempotent('  ۱۰ نکته برای خرید لپ‌تاپ  ');
    });
  });

  describe('stability and idempotency', () => {
    it('is idempotent for already-slugified output', () => {
      const slug = persianSlug('گوشی سامسونگ گلکسی S25');
      expect(persianSlug(slug)).toBe(slug);
    });

    it('is idempotent across noisy variants of the same title', () => {
      const variants = [
        'گوشی  سامسونگ   گلکسی S25',
        '  گوشی سامسونگ گلکسی S25  ',
        'گوشی---سامسونگ---گلکسی---S25',
        'گوشی! سامسونگ (گلکسی) S25',
      ];
      const slugs = variants.map(persianSlug);
      expect(new Set(slugs).size).toBe(1);
      expect(slugs[0]).toBe('گوشی-سامسونگ-گلکسی-s25');
    });

    it('produces only slug-safe characters', () => {
      const samples = [
        'گوشی سامسونگ گلکسی S25',
        'قیمت: ۲۵۰۰!!!',
        'می‌رود — fast',
        'hello@world.com/foo',
      ];

      for (const sample of samples) {
        const slug = persianSlug(sample);
        expect(slug).toMatch(/^[\p{Script=Arabic}a-z0-9-]*$/u);
        expect(slug).not.toMatch(/-{2,}/);
        expect(slug).not.toMatch(/^-|-$/);
      }
    });
  });
});
