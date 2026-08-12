import { bench, describe } from 'vitest';

import {
  clearDefaultPersianCollator,
  createPersianCollator,
  sortPersian,
} from './persian-sort.js';

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

function buildLargeCatalog(multiplier: number): string[] {
  const items: string[] = [];
  for (let i = 0; i < multiplier; i++) {
    for (const title of PRODUCT_CATALOG) {
      items.push(`${title} #${i + 1}`);
    }
  }
  return items;
}

const LARGE_CATALOG_1K = buildLargeCatalog(40);
const LARGE_CATALOG_10K = buildLargeCatalog(400);

const collator = createPersianCollator();

describe('Persian sort benchmarks', () => {
  bench(
    'createPersianCollator — cold construction',
    () => {
      createPersianCollator();
    },
    { time: 1500 },
  );

  bench(
    'createPersianCollator.compare — single mixed title',
    () => {
      collator.compare(PRODUCT_CATALOG[0]!, PRODUCT_CATALOG[1]!);
    },
    { time: 1500 },
  );

  bench(
    'sortPersian — catalog (~25 titles)',
    () => {
      sortPersian(PRODUCT_CATALOG);
    },
    { time: 1500 },
  );

  bench(
    'sortPersian — 1,000 titles (reused default collator)',
    () => {
      sortPersian(LARGE_CATALOG_1K);
    },
    { time: 2000 },
  );

  bench(
    'sortPersian — 10,000 titles (reused default collator)',
    () => {
      sortPersian(LARGE_CATALOG_10K);
    },
    { time: 3000 },
  );

  bench(
    'sortPersian — 1,000 titles with explicit collator',
    () => {
      sortPersian(LARGE_CATALOG_1K, { collator });
    },
    { time: 2000 },
  );

  bench(
    'sortPersian — 1,000 object rows with getKey',
    () => {
      const rows = LARGE_CATALOG_1K.map((title, index) => ({
        id: index,
        title,
      }));
      sortPersian(rows, { getKey: (row) => row.title });
    },
    { time: 2000 },
  );

  bench(
    'sortPersian — cold default collator (first call after cache clear)',
    () => {
      clearDefaultPersianCollator();
      sortPersian(['گوشی سامسونگ كلاسیک', 'آیفون', 'لپ‌تاپ لنوو']);
    },
    { time: 1500 },
  );

  bench(
    'sortPersian — Arabic Kaf titles',
    () => {
      sortPersian([`برنامه${ZWNJ}نویسی`, 'برنامه نویسی', 'كلاسیک', 'کلاسیک']);
    },
    { time: 1500 },
  );
});
