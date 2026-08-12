import { bench, describe } from 'vitest';

import {
  BENCH_OPTIONS,
  BENCH_OPTIONS_HEAVY,
  BENCH_OPTIONS_STRESS,
  CATALOG_1K,
  CATALOG_10K,
  CATALOG_25,
  PRODUCT_TITLES,
  ZWNJ,
} from '../benchmark/fixtures.js';
import {
  clearDefaultPersianCollator,
  createPersianCollator,
  sortPersian,
} from './persian-sort.js';

const collator = createPersianCollator();

describe('sortPersian', () => {
  bench(
    'createPersianCollator — cold construction',
    () => {
      createPersianCollator();
    },
    BENCH_OPTIONS,
  );

  bench(
    'collator.compare — single mixed title pair',
    () => {
      collator.compare(PRODUCT_TITLES[0], PRODUCT_TITLES[1]);
    },
    BENCH_OPTIONS,
  );

  bench(
    'catalog (~25 titles)',
    () => {
      sortPersian(CATALOG_25);
    },
    BENCH_OPTIONS,
  );

  bench(
    '1,000 titles — reused default collator',
    () => {
      sortPersian(CATALOG_1K);
    },
    BENCH_OPTIONS_HEAVY,
  );

  bench(
    '1,000 titles — explicit collator',
    () => {
      sortPersian(CATALOG_1K, { collator });
    },
    BENCH_OPTIONS_HEAVY,
  );

  bench(
    '1,000 object rows with getKey',
    () => {
      const rows = CATALOG_1K.map((title, index) => ({ id: index, title }));
      sortPersian(rows, { getKey: (row) => row.title });
    },
    BENCH_OPTIONS_HEAVY,
  );

  bench(
    '10,000 titles — reused default collator',
    () => {
      sortPersian(CATALOG_10K);
    },
    BENCH_OPTIONS_STRESS,
  );

  bench(
    'cold default collator (cache cleared)',
    () => {
      clearDefaultPersianCollator();
      sortPersian(['گوشی سامسونگ كلاسیک', 'آیفون', 'لپ‌تاپ لنوو']);
    },
    BENCH_OPTIONS,
  );

  bench(
    'Arabic Kaf / ZWNJ edge titles',
    () => {
      sortPersian([`برنامه${ZWNJ}نویسی`, 'برنامه نویسی', 'كلاسیک', 'کلاسیک']);
    },
    BENCH_OPTIONS,
  );
});
