import { bench, describe } from 'vitest';

import {
  BENCH_OPTIONS,
  BENCH_OPTIONS_HEAVY,
  SAMPLE_AMOUNTS,
} from '../benchmark/fixtures.js';
import { formatCurrency, formatRial, formatToman } from './format-currency.js';

describe('formatCurrency', () => {
  bench(
    'IRT toman — single amount',
    () => {
      formatCurrency(1_250_000, { currency: 'IRT' });
    },
    BENCH_OPTIONS,
  );

  bench(
    'IRR rial — single amount',
    () => {
      formatCurrency(12_500_000, { currency: 'IRR' });
    },
    BENCH_OPTIONS,
  );

  bench(
    'USD en-US — single amount',
    () => {
      formatCurrency(12.5, { currency: 'USD', locale: 'en-US' });
    },
    BENCH_OPTIONS,
  );

  bench(
    'USD fa-IR — single amount',
    () => {
      formatCurrency(12.5, { currency: 'USD' });
    },
    BENCH_OPTIONS,
  );

  bench(
    'formatToman / formatRial helpers',
    () => {
      formatToman(1_250_000);
      formatRial(12_500_000);
    },
    BENCH_OPTIONS,
  );

  bench(
    'repeated — sample amounts as IRT',
    () => {
      for (const amount of SAMPLE_AMOUNTS) {
        formatCurrency(amount, { currency: 'IRT' });
      }
    },
    BENCH_OPTIONS,
  );

  bench(
    'repeated — 1k cart line prices (IRT)',
    () => {
      for (let i = 0; i < 1000; i++) {
        formatCurrency(50_000 + i * 100, { currency: 'IRT' });
      }
    },
    BENCH_OPTIONS_HEAVY,
  );

  bench(
    'repeated — mixed currencies (Intl churn)',
    () => {
      formatCurrency(1_250_000, { currency: 'IRT' });
      formatCurrency(12_500_000, { currency: 'IRR' });
      formatCurrency(12.5, { currency: 'USD', locale: 'en-US' });
      formatCurrency(99.99, { currency: 'EUR', locale: 'en-US' });
    },
    BENCH_OPTIONS,
  );
});
