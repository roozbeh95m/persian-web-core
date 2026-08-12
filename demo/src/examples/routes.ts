export type DemoRoute = {
  path: string;
  title: string;
  titleFa: string;
  description: string;
  descriptionEn: string;
  importPath: string;
};

export const HOME_PATH = '/';

export const DEMO_ROUTES: readonly DemoRoute[] = [
  {
    path: '/digits',
    title: 'Digits',
    titleFa: 'ارقام',
    description: 'تبدیل ارقام انگلیسی، فارسی و عربی.',
    descriptionEn: 'Convert between English, Persian, and Arabic-Indic digits.',
    importPath: '@persian-web/core/digits',
  },
  {
    path: '/normalize',
    title: 'Normalize',
    titleFa: 'نرمال‌سازی',
    description: 'یکسان‌سازی ی/ک، فاصله مجازی و ارقام.',
    descriptionEn: 'Normalize Yeh/Kaf, ZWNJ, and optional digit scripts.',
    importPath: '@persian-web/core/normalize',
  },
  {
    path: '/numbers',
    title: 'Numbers',
    titleFa: 'اعداد',
    description: 'قالب‌بندی اعداد با Intl و ارقام فارسی.',
    descriptionEn: 'Locale-aware number formatting with Persian digits.',
    importPath: '@persian-web/core/format',
  },
  {
    path: '/currency',
    title: 'Currency',
    titleFa: 'واحد پول',
    description: 'نمایش تومان، ریال و ارزهای رایج.',
    descriptionEn: 'Format toman, rial, and common currencies.',
    importPath: '@persian-web/core/currency',
  },
  {
    path: '/date',
    title: 'Jalali date',
    titleFa: 'تاریخ جلالی',
    description: 'تبدیل و قالب‌بندی تقویم شمسی.',
    descriptionEn: 'Convert and format Jalali calendar dates.',
    importPath: '@persian-web/core/date',
  },
  {
    path: '/direction',
    title: 'Direction',
    titleFa: 'جهت متن',
    description: 'تشخیص rtl / ltr / mixed برای UI.',
    descriptionEn: 'Detect rtl, ltr, mixed, or neutral text direction.',
    importPath: '@persian-web/core/direction',
  },
  {
    path: '/typography',
    title: 'Typography',
    titleFa: 'تایپوگرافی',
    description: 'اصلاح نمایشی نقل‌قول و نیم‌فاصله.',
    descriptionEn: 'Display fixes for quotes, spacing, and ZWNJ.',
    importPath: '@persian-web/core/typography',
  },
  {
    path: '/search',
    title: 'Search',
    titleFa: 'جستجو',
    description: 'جستجوی مقاوم به اختلاف املای فارسی.',
    descriptionEn: 'Persian-aware search matching and normalization.',
    importPath: '@persian-web/core/search',
  },
  {
    path: '/sort',
    title: 'Sort',
    titleFa: 'مرتب‌سازی',
    description: 'مرتب‌سازی فارسی با Collator.',
    descriptionEn: 'Sort strings with Persian collation rules.',
    importPath: '@persian-web/core/sort',
  },
  {
    path: '/slug',
    title: 'Slug',
    titleFa: 'اسلاگ',
    description: 'ساخت اسلاگ URL با حفظ حروف فارسی.',
    descriptionEn: 'Build URL slugs that keep Persian letters.',
    importPath: '@persian-web/core/slug',
  },
  {
    path: '/phone',
    title: 'Phone',
    titleFa: 'تلفن',
    description: 'نرمال‌سازی و اعتبارسنجی موبایل ایران.',
    descriptionEn: 'Validate and normalize Iranian mobile numbers.',
    importPath: '@persian-web/core/phone',
  },
  {
    path: '/national-id',
    title: 'National ID',
    titleFa: 'کد ملی',
    description: 'اعتبارسنجی کد ملی با دلیل خطا.',
    descriptionEn: 'Validate Iranian national IDs with clear reasons.',
    importPath: '@persian-web/core/national-id',
  },
] as const;

export function normalizePath(raw: string): string {
  const path = raw.replace(/\/+$/, '') || '/';
  return path.startsWith('/') ? path : `/${path}`;
}

export function pathFromHash(hash: string): string {
  const value = hash.startsWith('#') ? hash.slice(1) : hash;
  return normalizePath(value || '/');
}

export function findRoute(path: string): DemoRoute | undefined {
  return DEMO_ROUTES.find((route) => route.path === path);
}
