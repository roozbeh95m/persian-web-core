import { bench, describe } from 'vitest';

import {
  BENCH_OPTIONS,
  BENCH_OPTIONS_HEAVY,
  BENCH_OPTIONS_STRESS,
  CATALOG_1K,
  LARGE_TEXT,
  MEDIUM_NOISY,
  PRODUCT_TITLES,
  SEARCH_QUERIES,
  SMALL_NOISY,
} from '../benchmark/fixtures.js';
import {
  clearSearchNormalizeCache,
  includesPersian,
  normalizeForSearch,
} from './persian-search.js';

describe('normalizeForSearch', () => {
  let uniqueSuffix = 0;

  bench(
    'small — noisy title (cache-miss path)',
    () => {
      // Deterministic unique suffix so we measure normalize cost, not cache hits.
      uniqueSuffix += 1;
      normalizeForSearch(`${SMALL_NOISY}#${uniqueSuffix}`);
    },
    BENCH_OPTIONS,
  );

  bench(
    'small — repeated same query (cached hot path)',
    () => {
      normalizeForSearch(SEARCH_QUERIES[0]);
    },
    BENCH_OPTIONS,
  );

  bench(
    'medium — description',
    () => {
      normalizeForSearch(MEDIUM_NOISY);
    },
    BENCH_OPTIONS,
  );

  bench(
    'large — ~20k chars (cache miss each run)',
    () => {
      uniqueSuffix += 1;
      normalizeForSearch(`${LARGE_TEXT}\n#${uniqueSuffix}`);
    },
    BENCH_OPTIONS_STRESS,
  );

  bench(
    'repeated — full query set (typical typeahead)',
    () => {
      for (const query of SEARCH_QUERIES) {
        normalizeForSearch(query);
      }
    },
    BENCH_OPTIONS,
  );

  bench(
    'repeated — cold cache per title',
    () => {
      clearSearchNormalizeCache();
      for (const title of PRODUCT_TITLES) {
        normalizeForSearch(title);
      }
    },
    BENCH_OPTIONS,
  );

  bench(
    'includesPersian — filter 25 titles × all queries',
    () => {
      for (const query of SEARCH_QUERIES) {
        for (const title of PRODUCT_TITLES) {
          includesPersian(title, query);
        }
      }
    },
    BENCH_OPTIONS_HEAVY,
  );

  bench(
    'includesPersian — one hot query across 1k catalog',
    () => {
      for (const item of CATALOG_1K) {
        includesPersian(item, 'سامسونگ');
      }
    },
    BENCH_OPTIONS_HEAVY,
  );
});
