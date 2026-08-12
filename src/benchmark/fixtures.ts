/**
 * Shared fixtures for Vitest benchmarks.
 *
 * Inputs are fixed (no randomness) so runs are reproducible on the same
 * machine/runtime. Absolute timings still vary by hardware; compare ratios
 * and regressions, not wall-clock alone.
 */

export const ZWNJ = '\u200C';

/** Realistic e-commerce product titles (mixed Arabic/Persian, Latin, digits). */
export const PRODUCT_TITLES = [
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
  'کفش پیاده‌روی آدیداس Ultraboost 23',
  'ساعت هوشمند شیائومی Mi Band 8 Pro',
  'ساعت اپل Apple Watch Series 9 GPS',
  'قیمت ویژه: ۲۵٬۹۰۰٬۰۰۰ ریال — ارسال رایگان',
  'تخفیف ۱۵٪ برای خرید بالای ۵٬۰۰۰٬۰۰۰ تومان',
  'آدرس فروشگاه: تهران، خیابان ولیعصر، پلاک ۱۲۳، واحد ۴',
  'ارسال به شهرستان — زمان تحویل ۲ تا ۵ روز کاری',
  'پشتیبانی ۲۴ ساعته — تماس: ۰۲۱-۱۲۳۴۵۶۷۸',
  'گارانتی ۱۸ ماهه شرکتی — کد رهگیری ١٤٠٣٠٩٨٧٦',
  'محصول اصل — ساخت کره جنوبی',
] as const;

/** Typical live-search queries (short, mixed script). */
export const SEARCH_QUERIES = [
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
] as const;

/** Short UI copy with Persian digits (~40 chars). */
export const SMALL_PERSIAN_DIGITS = 'قیمت: ۲۵٬۹۰۰٬۰۰۰ ریال — ارسال رایگان';

/** Same copy with English digits. */
export const SMALL_ENGLISH_DIGITS = 'قیمت: 25,900,000 ریال — ارسال رایگان';

/** Short Arabic-Indic digits mixed into Persian prose. */
export const SMALL_ARABIC_DIGITS = 'کد رهگیری: ١٤٠٣٠٩٨٧٦ — گارانتی ١٨ ماهه';

/**
 * Orthographically noisy short string: Arabic Yeh/Kaf, ZWNJ, diacritics,
 * and mixed digits — typical of user-generated / scraped Persian text.
 */
export const SMALL_NOISY = `كيفيت بالا — گوشي سامسونگ كلاسيك B310 با باتري قوي و کد رهگيري ١٤٠٣؛ برنامه‌${ZWNJ}${ZWNJ}نویسی مِنْ متن`;

/** Medium product-description paragraph (~500+ chars). */
export const MEDIUM_DESCRIPTION = [
  'توضیحات محصول: این گوشی موبایل سامسونگ Galaxy S24 Ultra با حافظه ۲۵۶ گیگابایت',
  'و دو سیم‌کارت برای کاربران حرفه‌ای طراحی شده است. صفحه‌نمایش Dynamic AMOLED',
  'با نرخ نوسازی ۱۲۰ هرتز، دوربین ۲۰۰ مگاپیکسلی و باتری ۵۰۰۰ میلی‌آمپرساعتی از',
  'ویژگی‌های اصلی آن هستند. قیمت ویژه: ۲۵٬۹۰۰٬۰۰۰ ریال. ارسال رایگان به سراسر',
  'کشور طی ۲ تا ۵ روز کاری. گارانتی ۱۸ ماهه شرکتی. پشتیبانی ۲۴ ساعته از طریق',
  'شماره ۰۲۱-۱۲۳۴۵۶۷۸. آدرس فروشگاه: تهران، خیابان ولیعصر، پلاک ۱۲۳، واحد ۴.',
  'نسخه نرم‌افزاری ۱۴۰۳ و کد رهگیری نمونه ١٤٠٣٠٩٨٧٦ در فاکتور درج می‌شود.',
  'کلمات کلیدی: گوشي، كلاسيك، برنامه‌نویسی، Galaxy، Samsung، iPhone مقایسه.',
].join(' ');

/**
 * Same medium text with Arabic Yeh/Kaf sprinkled in (forces normalize work).
 */
export const MEDIUM_NOISY = MEDIUM_DESCRIPTION.replaceAll('ی', 'ي').replaceAll(
  'ک',
  'ك',
);

const LARGE_SEED = `${MEDIUM_NOISY}\n\n`;

/** ~20k characters of realistic Persian product/catalog prose. */
export const LARGE_TEXT = LARGE_SEED.repeat(
  Math.ceil(20_000 / LARGE_SEED.length),
).slice(0, 20_000);

/** ~100k characters for stress paths (normalize / digit map). */
export const XLARGE_TEXT = LARGE_SEED.repeat(
  Math.ceil(100_000 / LARGE_SEED.length),
).slice(0, 100_000);

/** Realistic Iranian price / amount samples for format benches. */
export const SAMPLE_AMOUNTS = [
  0, 12, 99.5, 1_250, 12_500, 1_250_000, 12_500_000, 25_900_000, 99_999_999,
  -1_250_000, 1.5, 1234.56,
] as const;

/**
 * Builds a deterministic catalog by suffixing titles with an index.
 * Used for sort / search list workloads.
 */
export function buildCatalog(multiplier: number): string[] {
  const items: string[] = [];
  for (let i = 0; i < multiplier; i++) {
    for (const title of PRODUCT_TITLES) {
      items.push(`${title} #${i + 1}`);
    }
  }
  return items;
}

export const CATALOG_25 = [...PRODUCT_TITLES];
export const CATALOG_1K = buildCatalog(40);
export const CATALOG_10K = buildCatalog(400);

/**
 * Default Vitest / Tinybench options for reproducible relative comparisons.
 *
 * Tinybench treats `iterations` as a *maximum* while `time` (default 500ms)
 * is a *minimum* duration — so fixed `iterations` alone still runs for ~500ms.
 * Setting `time: 0` makes each case run exactly `iterations` measured loops.
 */
export const BENCH_OPTIONS = {
  time: 0,
  warmupTime: 0,
  warmupIterations: 20,
  iterations: 500,
} as const;

/** Heavier workloads: fewer measured iterations. */
export const BENCH_OPTIONS_HEAVY = {
  time: 0,
  warmupTime: 0,
  warmupIterations: 10,
  iterations: 80,
} as const;

/** Very heavy (large text / 10k sort): keep runs practical. */
export const BENCH_OPTIONS_STRESS = {
  time: 0,
  warmupTime: 0,
  warmupIterations: 5,
  iterations: 20,
} as const;
