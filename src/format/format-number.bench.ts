import { bench, describe } from 'vitest';

import {
  BENCH_OPTIONS,
  BENCH_OPTIONS_HEAVY,
  SAMPLE_AMOUNTS,
} from '../benchmark/fixtures.js';
import { formatNumber } from './format-number.js';

describe('formatNumber', () => {
  bench(
    'default en-US — single amount',
    () => {
      formatNumber(1_250_000);
    },
    BENCH_OPTIONS,
  );

  bench(
    'fa-IR — single amount',
    () => {
      formatNumber(1_250_000, { locale: 'fa-IR' });
    },
    BENCH_OPTIONS,
  );

  bench(
    'fa-IR + english digits override',
    () => {
      formatNumber(1_250_000, { locale: 'fa-IR', digits: 'english' });
    },
    BENCH_OPTIONS,
  );

  bench(
    'en-US + persian digits override',
    () => {
      formatNumber(1_250_000, { digits: 'persian' });
    },
    BENCH_OPTIONS,
  );

  bench(
    'fa-IR compact notation',
    () => {
      formatNumber(1_250_000, { locale: 'fa-IR', notation: 'compact' });
    },
    BENCH_OPTIONS,
  );

  bench(
    'repeated — sample amounts with fixed fa-IR options',
    () => {
      for (const amount of SAMPLE_AMOUNTS) {
        formatNumber(amount, { locale: 'fa-IR', precision: 0 });
      }
    },
    BENCH_OPTIONS,
  );

  bench(
    'repeated — 1k list prices (same options)',
    () => {
      for (let i = 0; i < 1000; i++) {
        formatNumber(1_000_000 + i, { locale: 'fa-IR' });
      }
    },
    BENCH_OPTIONS_HEAVY,
  );

  bench(
    'repeated — mixed option shapes (worst-case Intl churn)',
    () => {
      formatNumber(100, { locale: 'fa-IR' });
      formatNumber(100, { locale: 'en-US' });
      formatNumber(100, { locale: 'fa-IR', precision: 2 });
      formatNumber(100, { locale: 'fa-IR', useGrouping: false });
      formatNumber(100, { locale: 'fa-IR', notation: 'compact' });
    },
    BENCH_OPTIONS,
  );
});
