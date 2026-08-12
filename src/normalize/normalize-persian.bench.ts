import { bench, describe } from 'vitest';

import {
  BENCH_OPTIONS,
  BENCH_OPTIONS_HEAVY,
  BENCH_OPTIONS_STRESS,
  LARGE_TEXT,
  MEDIUM_DESCRIPTION,
  MEDIUM_NOISY,
  PRODUCT_TITLES,
  SMALL_NOISY,
  SMALL_PERSIAN_DIGITS,
  XLARGE_TEXT,
} from '../benchmark/fixtures.js';
import { normalizePersian } from './normalize-persian.js';

describe('normalizePersian', () => {
  bench(
    'small — clean Persian (minimal work)',
    () => {
      normalizePersian(SMALL_PERSIAN_DIGITS);
    },
    BENCH_OPTIONS,
  );

  bench(
    'small — noisy Yeh/Kaf/ZWNJ/diacritics',
    () => {
      normalizePersian(SMALL_NOISY);
    },
    BENCH_OPTIONS,
  );

  bench(
    'small — noisy + search-like options',
    () => {
      normalizePersian(SMALL_NOISY, {
        digits: 'english',
        removeDiacritics: true,
        normalizeWhitespace: true,
      });
    },
    BENCH_OPTIONS,
  );

  bench(
    'medium — clean description',
    () => {
      normalizePersian(MEDIUM_DESCRIPTION);
    },
    BENCH_OPTIONS,
  );

  bench(
    'medium — Arabic Yeh/Kaf heavy',
    () => {
      normalizePersian(MEDIUM_NOISY);
    },
    BENCH_OPTIONS,
  );

  bench(
    'medium — full option set',
    () => {
      normalizePersian(MEDIUM_NOISY, {
        digits: 'english',
        removeDiacritics: true,
        normalizeWhitespace: true,
      });
    },
    BENCH_OPTIONS,
  );

  bench(
    'large — ~20k chars (default options)',
    () => {
      normalizePersian(LARGE_TEXT);
    },
    BENCH_OPTIONS_HEAVY,
  );

  bench(
    'large — ~20k chars (full options)',
    () => {
      normalizePersian(LARGE_TEXT, {
        digits: 'english',
        removeDiacritics: true,
        normalizeWhitespace: true,
      });
    },
    BENCH_OPTIONS_HEAVY,
  );

  bench(
    'xlarge — ~100k chars',
    () => {
      normalizePersian(XLARGE_TEXT);
    },
    BENCH_OPTIONS_STRESS,
  );

  bench(
    'repeated — catalog titles (list normalize)',
    () => {
      for (const title of PRODUCT_TITLES) {
        normalizePersian(title);
      }
    },
    BENCH_OPTIONS,
  );
});
