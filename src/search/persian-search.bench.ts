import { bench, describe } from 'vitest';

import {
  clearSearchNormalizeCache,
  includesPersian,
  matchesPersian,
  normalizeForSearch,
} from './persian-search.js';

const ZWNJ = '\u200C';

/** Realistic e-commerce product titles (mixed Arabic/Persian, Latin, digits). */
const PRODUCT_CATALOG = [
  'گوشی موبایل سامسونگ Galaxy S24 Ultra 256GB دو سیم‌کارت',
  'گوشی سامسونگ كلاسیک B310 با باتری قوی',
  'گوشی اپل iPhone 15 Pro Max 256GB',
  'لپ‌تاپ ایسوس VivoBook 15 OLED Core i7',
  'لپ‌تاپ لنوو ThinkPad X1 Carbon Gen 11',
  'هدفون بلوتوثی Sony WH-1000XM5 با نویزکنسلینگ',
  'هدفون Apple AirPods Pro (نسل ۲)',
  'کتاب برنامه‌نویسی JavaScript مدرن - نسخه ۱۴۰۳',
  'کتاب آموزش React.js و TypeScript',
  'شامپو تقویت‌کننده مو سریتا مناسب موهای خشک',
  'کرم آبرسان پوست صورت لافارر 50ml',
  'یخچال فریزر دو قلو ال‌جی 34 فوت اینورتر',
  'ماشین لباسشویی سامسونگ 9 کیلوگرم مدل WW90',
  'تلویزیون 55 اینچ سامسونگ Crystal UHD 4K',
  'کفش ورزشی نایک Air Max 270 مردانه',
  'کفش پیاده‌روی آدidas Ultraboost 23',
  'ساعت هوشمند شیائومی Mi Band 8 Pro',
  'ساعت اپل Apple Watch Series 9 GPS',
  'قیمت ویژه: ۲۵٬۹۰۰٬۰۰۰ ریال — ارسال رایگان',
  'تخفیف ۱۵٪ برای خرید بالای ۵٬۰۰۰٬۰۰۰ تومان',
  'آدرس فروشگاه: تهران، خیابان ولیعصر، پلاک ۱۲۳، واحد ۴',
  'ارسال به شهرستان — زمان تحویل ۲ تا ۵ روز کاری',
  'پشتیبانی ۲۴ ساعته — تماس: ۰۲۱-۱۲۳۴۵۶۷۸',
  'گارانتی ۱۸ ماهه شرکتی — کد رهگیری ١٤٠٣٠٩٨٧٦',
  'محصول اصل — ساخت کره جنوبی',
];

/** Repeated user queries simulating live search/filter input. */
const SEARCH_QUERIES = [
  'سامسونگ',
  'سامسونگ كلاس',
  'galaxy s24',
  'GALAXY S24',
  'iphone 15',
  'برنامه نویسی',
  `برنامه${ZWNJ}نویسی`,
  'javascript',
  'JAVASCRIPT',
  '25900000',
  '۲۵۹۰۰۰۰۰',
  'پلاک 123',
  'پلاک ۱۲۳',
  'هدفون sony',
  'نایک air',
  'ال‌جی',
  'تهران ولیعصر',
  'گارانتی 18',
  'گارانتی ۱۸',
];

function filterCatalog(query: string): string[] {
  return PRODUCT_CATALOG.filter((item) => includesPersian(item, query));
}

describe('Persian search benchmarks', () => {
  bench(
    'normalizeForSearch — single product title',
    () => {
      normalizeForSearch(PRODUCT_CATALOG[0]!);
    },
    { time: 1500 },
  );

  bench(
    'normalizeForSearch — repeated query (cached)',
    () => {
      for (const query of SEARCH_QUERIES) {
        normalizeForSearch(query);
      }
    },
    { time: 1500 },
  );

  bench(
    'includesPersian — filter full catalog per query',
    () => {
      for (const query of SEARCH_QUERIES) {
        filterCatalog(query);
      }
    },
    { time: 2000 },
  );

  bench(
    'includesPersian — single hot query across catalog',
    () => {
      for (const item of PRODUCT_CATALOG) {
        includesPersian(item, 'سامسونگ');
      }
    },
    { time: 1500 },
  );

  bench(
    'matchesPersian — exact title match',
    () => {
      matchesPersian(PRODUCT_CATALOG[0]!, 'گوشی سامسونگ Galaxy S24');
    },
    { time: 1500 },
  );

  bench(
    'normalizeForSearch — cold cache (Arabic Kaf title)',
    () => {
      clearSearchNormalizeCache();
      normalizeForSearch('گوشی سامسونگ كلاسیک B310');
    },
    { time: 1500 },
  );
});
