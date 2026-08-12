import { bench, describe } from 'vitest';

import {
  BENCH_OPTIONS,
  BENCH_OPTIONS_HEAVY,
  BENCH_OPTIONS_STRESS,
  LARGE_TEXT,
  MEDIUM_DESCRIPTION,
  MEDIUM_NOISY,
  SAMPLE_AMOUNTS,
  SMALL_ARABIC_DIGITS,
  SMALL_ENGLISH_DIGITS,
  SMALL_NOISY,
  SMALL_PERSIAN_DIGITS,
  XLARGE_TEXT,
} from '../benchmark/fixtures.js';
import { toEnglishDigits } from './to-english-digits.js';
import { toPersianDigits } from './to-persian-digits.js';

describe('toPersianDigits', () => {
  bench(
    'small — English digits in UI price string',
    () => {
      toPersianDigits(SMALL_ENGLISH_DIGITS);
    },
    BENCH_OPTIONS,
  );

  bench(
    'small — Arabic-Indic digits',
    () => {
      toPersianDigits(SMALL_ARABIC_DIGITS);
    },
    BENCH_OPTIONS,
  );

  bench(
    'small — already Persian (no-op path)',
    () => {
      toPersianDigits(SMALL_PERSIAN_DIGITS);
    },
    BENCH_OPTIONS,
  );

  bench(
    'medium — product description',
    () => {
      toPersianDigits(MEDIUM_DESCRIPTION);
    },
    BENCH_OPTIONS,
  );

  bench(
    'large — ~20k chars',
    () => {
      toPersianDigits(LARGE_TEXT);
    },
    BENCH_OPTIONS_HEAVY,
  );

  bench(
    'xlarge — ~100k chars',
    () => {
      toPersianDigits(XLARGE_TEXT);
    },
    BENCH_OPTIONS_STRESS,
  );

  bench(
    'repeated — batch of amount strings (hot list render)',
    () => {
      for (const amount of SAMPLE_AMOUNTS) {
        toPersianDigits(String(amount));
      }
    },
    BENCH_OPTIONS,
  );
});

describe('toEnglishDigits', () => {
  bench(
    'small — Persian digits in UI price string',
    () => {
      toEnglishDigits(SMALL_PERSIAN_DIGITS);
    },
    BENCH_OPTIONS,
  );

  bench(
    'small — Arabic-Indic digits',
    () => {
      toEnglishDigits(SMALL_ARABIC_DIGITS);
    },
    BENCH_OPTIONS,
  );

  bench(
    'small — already English (no-op path)',
    () => {
      toEnglishDigits(SMALL_ENGLISH_DIGITS);
    },
    BENCH_OPTIONS,
  );

  bench(
    'medium — noisy description',
    () => {
      toEnglishDigits(MEDIUM_NOISY);
    },
    BENCH_OPTIONS,
  );

  bench(
    'large — ~20k chars',
    () => {
      toEnglishDigits(LARGE_TEXT);
    },
    BENCH_OPTIONS_HEAVY,
  );

  bench(
    'xlarge — ~100k chars',
    () => {
      toEnglishDigits(XLARGE_TEXT);
    },
    BENCH_OPTIONS_STRESS,
  );

  bench(
    'repeated — search-query digit folding',
    () => {
      toEnglishDigits(SMALL_NOISY);
      toEnglishDigits(SMALL_PERSIAN_DIGITS);
      toEnglishDigits(SMALL_ARABIC_DIGITS);
    },
    BENCH_OPTIONS,
  );
});
