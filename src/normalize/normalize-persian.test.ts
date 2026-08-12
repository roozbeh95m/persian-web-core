import { describe, expect, it } from 'vitest';

import { normalizePersian } from './index.js';
import type { NormalizePersianOptions } from './types.js';

const ZWNJ = '\u200C';
const ARABIC_YEH = 'ي';
const PERSIAN_YEH = 'ی';
const ARABIC_KAF = 'ك';
const PERSIAN_KAF = 'ک';
const HEH_HAMZA = 'هٔ'; // ه + ٔ
const HEH_WITH_YEH_ABOVE = 'ۀ';
const ENGLISH = '0123456789';
const ARABIC_INDIC = '٠١٢٣٤٥٦٧٨٩';
const PERSIAN = '۰۱۲۳۴۵۶۷۸۹';

function assertIdempotent(
  input: string,
  options?: NormalizePersianOptions,
): void {
  const once = normalizePersian(input, options);
  const twice = normalizePersian(once, options);
  expect(twice).toBe(once);
}

describe('normalizePersian', () => {
  describe('empty input', () => {
    it('returns empty string', () => {
      expect(normalizePersian('')).toBe('');
    });

    it('is idempotent', () => {
      assertIdempotent('');
    });

    it('returns the same reference', () => {
      const empty = '';
      expect(normalizePersian(empty)).toBe(empty);
    });
  });

  describe('Yeh: ي and ی', () => {
    it('normalizes Arabic Yeh to Persian Yeh', () => {
      expect(normalizePersian(ARABIC_YEH)).toBe(PERSIAN_YEH);
      expect(normalizePersian('يک')).toBe('یک');
      expect(normalizePersian('پياده')).toBe('پیاده');
    });

    it('leaves Persian Yeh unchanged', () => {
      expect(normalizePersian(PERSIAN_YEH)).toBe(PERSIAN_YEH);
      expect(normalizePersian('یک')).toBe('یک');
      expect(normalizePersian('پیاده')).toBe('پیاده');
    });

    it('normalizes Alef Maksura to Persian Yeh', () => {
      expect(normalizePersian('ى')).toBe(PERSIAN_YEH);
      expect(normalizePersian('خانه‌اى')).toBe(`خانه${ZWNJ}ای`);
    });

    it('is idempotent for Yeh forms', () => {
      assertIdempotent('يکي');
      assertIdempotent('یکی');
      assertIdempotent('ى');
    });
  });

  describe('Kaf: ك and ک', () => {
    it('normalizes Arabic Kaf to Persian Kaf', () => {
      expect(normalizePersian(ARABIC_KAF)).toBe(PERSIAN_KAF);
      expect(normalizePersian('كتاب')).toBe('کتاب');
      expect(normalizePersian('كيك')).toBe('کیک');
    });

    it('leaves Persian Kaf unchanged', () => {
      expect(normalizePersian(PERSIAN_KAF)).toBe(PERSIAN_KAF);
      expect(normalizePersian('کتاب')).toBe('کتاب');
    });

    it('is idempotent for Kaf forms', () => {
      assertIdempotent('كتاب');
      assertIdempotent('کتاب');
    });
  });

  describe('هٔ and ۀ', () => {
    it('preserves هٔ (heh + hamza above)', () => {
      expect(normalizePersian(HEH_HAMZA)).toBe(HEH_HAMZA);
      expect(normalizePersian('خانهٔ ما')).toBe('خانهٔ ما');
    });

    it('normalizes ۀ to هٔ', () => {
      expect(normalizePersian(HEH_WITH_YEH_ABOVE)).toBe(HEH_HAMZA);
      expect(normalizePersian('خانۀ ما')).toBe('خانهٔ ما');
    });

    it('removes hamza from هٔ when removeDiacritics is true', () => {
      expect(normalizePersian(HEH_HAMZA, { removeDiacritics: true })).toBe('ه');
      expect(normalizePersian('خانهٔ ما', { removeDiacritics: true })).toBe(
        'خانه ما',
      );
    });

    it('maps ۀ to ه when removeDiacritics is true', () => {
      expect(
        normalizePersian(HEH_WITH_YEH_ABOVE, { removeDiacritics: true }),
      ).toBe('ه');
      expect(normalizePersian('خانۀ ما', { removeDiacritics: true })).toBe(
        'خانه ما',
      );
    });

    it('is idempotent for heh-hamza forms', () => {
      assertIdempotent(HEH_HAMZA);
      assertIdempotent(HEH_WITH_YEH_ABOVE);
      assertIdempotent(HEH_HAMZA, { removeDiacritics: true });
      assertIdempotent(HEH_WITH_YEH_ABOVE, { removeDiacritics: true });
      assertIdempotent('خانهٔ دوست');
    });
  });

  describe('ZWNJ', () => {
    it('preserves meaningful ZWNJ between letters', () => {
      const word = `می${ZWNJ}روم`;
      expect(normalizePersian(word)).toBe(word);
      expect(normalizePersian(`خانه${ZWNJ}ام`)).toBe(`خانه${ZWNJ}ام`);
    });

    it('collapses consecutive ZWNJs to one', () => {
      expect(normalizePersian(`می${ZWNJ}${ZWNJ}روم`)).toBe(`می${ZWNJ}روم`);
      expect(normalizePersian(`می${ZWNJ}${ZWNJ}${ZWNJ}روم`)).toBe(
        `می${ZWNJ}روم`,
      );
    });

    it('strips leading and trailing ZWNJ', () => {
      expect(normalizePersian(`${ZWNJ}متن`)).toBe('متن');
      expect(normalizePersian(`متن${ZWNJ}`)).toBe('متن');
      expect(normalizePersian(`${ZWNJ}متن${ZWNJ}`)).toBe('متن');
    });

    it('strips ZWNJ adjacent to whitespace', () => {
      expect(normalizePersian(`می ${ZWNJ}روم`)).toBe('می روم');
      expect(normalizePersian(`می${ZWNJ} روم`)).toBe('می روم');
      expect(normalizePersian(`می ${ZWNJ} روم`)).toBe('می  روم');
    });

    it('is idempotent for ZWNJ cases', () => {
      assertIdempotent(`می${ZWNJ}روم`);
      assertIdempotent(`می${ZWNJ}${ZWNJ}روم`);
      assertIdempotent(`${ZWNJ}متن${ZWNJ}`);
      assertIdempotent(`می ${ZWNJ}روم`);
    });
  });

  describe('digits', () => {
    it('preserves all digit scripts by default', () => {
      expect(normalizePersian(ENGLISH)).toBe(ENGLISH);
      expect(normalizePersian(PERSIAN)).toBe(PERSIAN);
      expect(normalizePersian(ARABIC_INDIC)).toBe(ARABIC_INDIC);
      expect(normalizePersian('سال 1403 / ۱۴۰۳ / ١٤٠٣')).toBe(
        'سال 1403 / ۱۴۰۳ / ١٤٠٣',
      );
    });

    it('preserves digits when digits is "preserve"', () => {
      expect(normalizePersian('1٢۳', { digits: 'preserve' })).toBe('1٢۳');
    });

    it('converts to Persian digits when digits is "persian"', () => {
      expect(normalizePersian(ENGLISH, { digits: 'persian' })).toBe(PERSIAN);
      expect(normalizePersian(ARABIC_INDIC, { digits: 'persian' })).toBe(
        PERSIAN,
      );
      expect(normalizePersian(PERSIAN, { digits: 'persian' })).toBe(PERSIAN);
      expect(normalizePersian('قیمت: 2500', { digits: 'persian' })).toBe(
        'قیمت: ۲۵۰۰',
      );
    });

    it('converts to English digits when digits is "english"', () => {
      expect(normalizePersian(PERSIAN, { digits: 'english' })).toBe(ENGLISH);
      expect(normalizePersian(ARABIC_INDIC, { digits: 'english' })).toBe(
        ENGLISH,
      );
      expect(normalizePersian(ENGLISH, { digits: 'english' })).toBe(ENGLISH);
      expect(normalizePersian('قیمت: ۲۵۰۰', { digits: 'english' })).toBe(
        'قیمت: 2500',
      );
    });

    it('is idempotent for each digit mode', () => {
      assertIdempotent('1٢۳');
      assertIdempotent('1٢۳', { digits: 'preserve' });
      assertIdempotent('1٢۳', { digits: 'persian' });
      assertIdempotent('1٢۳', { digits: 'english' });
      assertIdempotent(ARABIC_INDIC, { digits: 'persian' });
      assertIdempotent(PERSIAN, { digits: 'english' });
    });
  });

  describe('whitespace', () => {
    it('leaves whitespace unchanged by default', () => {
      expect(normalizePersian('  سلام  ')).toBe('  سلام  ');
      expect(normalizePersian('سلام\t\tدنیا')).toBe('سلام\t\tدنیا');
      expect(normalizePersian('خط\nدوم')).toBe('خط\nدوم');
    });

    it('trims and collapses whitespace when normalizeWhitespace is true', () => {
      expect(normalizePersian('  سلام  ', { normalizeWhitespace: true })).toBe(
        'سلام',
      );
      expect(
        normalizePersian('سلام\t\tدنیا', { normalizeWhitespace: true }),
      ).toBe('سلام دنیا');
      expect(normalizePersian('خط\nدوم', { normalizeWhitespace: true })).toBe(
        'خط دوم',
      );
      expect(
        normalizePersian('  a   b\t\nc  ', { normalizeWhitespace: true }),
      ).toBe('a b c');
    });

    it('does not treat ZWNJ as whitespace', () => {
      expect(
        normalizePersian(`می${ZWNJ}روم`, { normalizeWhitespace: true }),
      ).toBe(`می${ZWNJ}روم`);
    });

    it('is idempotent for whitespace options', () => {
      assertIdempotent('  سلام  ');
      assertIdempotent('  سلام  دنیا  ', { normalizeWhitespace: true });
      assertIdempotent('a\t\tb\n\nc', { normalizeWhitespace: true });
    });
  });

  describe('diacritics', () => {
    it('preserves diacritics by default', () => {
      expect(normalizePersian('مِنْ')).toBe('مِنْ');
      expect(normalizePersian('كِتاب')).toBe('کِتاب');
    });

    it('removes Arabic diacritics when removeDiacritics is true', () => {
      expect(normalizePersian('مِنْ', { removeDiacritics: true })).toBe('من');
      expect(normalizePersian('كِتَابٌ', { removeDiacritics: true })).toBe(
        'کتاب',
      );
      expect(normalizePersian('بَرْنامِه', { removeDiacritics: true })).toBe(
        'برنامه',
      );
    });

    it('is idempotent for diacritic options', () => {
      assertIdempotent('مِنْ');
      assertIdempotent('مِنْ', { removeDiacritics: true });
      assertIdempotent('كِتَابٌ', { removeDiacritics: true });
    });
  });

  describe('punctuation', () => {
    it('preserves Persian and ASCII punctuation', () => {
      expect(normalizePersian('سلام!')).toBe('سلام!');
      expect(normalizePersian('«کتاب»')).toBe('«کتاب»');
      expect(normalizePersian('آیا؟')).toBe('آیا؟');
      expect(normalizePersian('قیمت: ۱،۰۰۰ ريال.')).toBe('قیمت: ۱،۰۰۰ ریال.');
      expect(normalizePersian('(تست) [۱] {a}')).toBe('(تست) [۱] {a}');
      expect(normalizePersian('email@test.com')).toBe('email@test.com');
    });

    it('does not strip punctuation when other options are on', () => {
      expect(
        normalizePersian('سلام!  دنیا؟', {
          normalizeWhitespace: true,
          removeDiacritics: true,
        }),
      ).toBe('سلام! دنیا؟');
    });
  });

  describe('mixed Arabic/Persian text', () => {
    it('fixes Yeh/Kaf while leaving other Arabic letters intact', () => {
      // أ إ ء ؤ ئ ع غ remain; only ي/ك/ى/ۀ are remapped.
      expect(normalizePersian('إن شاء الله')).toBe('إن شاء الله');
      expect(normalizePersian('مؤمن')).toBe('مؤمن');
      expect(normalizePersian('سؤال')).toBe('سؤال');
      expect(normalizePersian('علي')).toBe('علی');
      expect(normalizePersian('مكة')).toBe('مکة');
    });

    it('handles mixed sentences with digits and punctuation', () => {
      const input = `اين كتاب، قیمت: 120٠ تومان!`;
      expect(normalizePersian(input, { digits: 'persian' })).toBe(
        'این کتاب، قیمت: ۱۲۰۰ تومان!',
      );
    });

    it('is idempotent on mixed text', () => {
      assertIdempotent('إن شاء الله');
      assertIdempotent(`اين كتاب ${ARABIC_INDIC}`, { digits: 'english' });
      assertIdempotent('علي و مريم در مکة');
    });
  });

  describe('defaults and safety', () => {
    it('does not alter plain Persian text', () => {
      const input = 'سلام دنیا';
      expect(normalizePersian(input)).toBe(input);
      expect(normalizePersian(input)).toBe(input); // same reference
    });

    it('does not mutate the input string', () => {
      const input = 'كي';
      const snapshot = input.slice();
      normalizePersian(input);
      expect(input).toBe(snapshot);
    });

    it('is deterministic for the same input and options', () => {
      const input = `كي${ZWNJ}${ZWNJ} ١٢٣  `;
      const options: NormalizePersianOptions = {
        digits: 'persian',
        removeDiacritics: true,
        normalizeWhitespace: true,
      };
      expect(normalizePersian(input, options)).toBe(
        normalizePersian(input, options),
      );
    });
  });

  describe('idempotency (core invariant)', () => {
    const samples: Array<{ input: string; options?: NormalizePersianOptions }> =
      [
        { input: '' },
        { input: 'ي' },
        { input: 'ی' },
        { input: 'ك' },
        { input: 'ک' },
        { input: 'هٔ' },
        { input: 'ۀ' },
        { input: `می${ZWNJ}${ZWNJ}خواهم` },
        { input: `${ZWNJ}آزمایش${ZWNJ}` },
        { input: ARABIC_INDIC },
        { input: PERSIAN },
        { input: ENGLISH },
        { input: '  فاصله   زیاد  ' },
        { input: 'مِنْ كِتَاب' },
        { input: 'سلام! «دنیا»؟' },
        { input: 'علي كتب ١٢٣ صفحه' },
        { input: 'ي', options: { digits: 'persian' } },
        { input: '١٢٣', options: { digits: 'persian' } },
        { input: '۱۲۳', options: { digits: 'english' } },
        { input: '1٢۳', options: { digits: 'preserve' } },
        {
          input: `  كي${ZWNJ}${ZWNJ} مِنْ ١٢٣  `,
          options: {
            digits: 'persian',
            removeDiacritics: true,
            normalizeWhitespace: true,
          },
        },
        {
          input: 'خانۀ بزرگ',
          options: { removeDiacritics: true },
        },
      ];

    it('satisfies normalize(normalize(x)) === normalize(x) for all samples', () => {
      for (const { input, options } of samples) {
        assertIdempotent(input, options);
      }
    });

    it('triple application matches single application', () => {
      const input = `كي${ZWNJ}${ZWNJ} ١٢٣\tمِنْ`;
      const options: NormalizePersianOptions = {
        digits: 'english',
        removeDiacritics: true,
        normalizeWhitespace: true,
      };
      const once = normalizePersian(input, options);
      const thrice = normalizePersian(
        normalizePersian(normalizePersian(input, options), options),
        options,
      );
      expect(thrice).toBe(once);
    });
  });
});
