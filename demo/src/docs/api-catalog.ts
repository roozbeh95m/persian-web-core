/**
 * API reference catalog generated from the real `@persian-web/core` exports.
 * Every function/type listed here is imported from the library — unused or
 * invented symbols will fail TypeScript checks.
 */
import {
  formatCurrency,
  formatRial,
  formatToman,
  type Currency,
  type CurrencyDigits,
  type CurrencyDisplay,
  type FormatCurrencyOptions,
  type FormatCurrencyOptionsWithCurrency,
} from '@persian-web/core/currency';
import {
  formatJalali,
  relativeTime,
  toGregorian,
  toJalali,
  type FormatJalaliDigits,
  type FormatJalaliOptions,
  type GregorianDate,
  type JalaliDate,
  type RelativeTimeDigits,
  type RelativeTimeOptions,
  type ToJalaliOptions,
} from '@persian-web/core/date';
import { toEnglishDigits, toPersianDigits } from '@persian-web/core/digits';
import {
  getTextDirection,
  isMixedDirection,
  isRTL,
  type TextDirection,
} from '@persian-web/core/direction';
import {
  formatNumber,
  type FormatNumberDigits,
  type FormatNumberNotation,
  type FormatNumberOptions,
} from '@persian-web/core/format';
import {
  isValidNationalId,
  validateNationalId,
  type NationalIdInvalidReason,
  type ValidateNationalIdResult,
} from '@persian-web/core/national-id';
import {
  normalizePersian,
  type DigitNormalization,
  type NormalizePersianOptions,
} from '@persian-web/core/normalize';
import {
  formatIranianPhone,
  isValidIranianPhone,
  normalizePhone,
  type FormatIranianPhoneOptions,
  type IranianPhoneDigits,
  type IranianPhoneFormat,
} from '@persian-web/core/phone';
import {
  includesPersian,
  matchesPersian,
  normalizeForSearch,
} from '@persian-web/core/search';
import { persianSlug } from '@persian-web/core/slug';
import {
  createPersianCollator,
  sortPersian,
  type PersianCollator,
  type PersianCollatorOptions,
  type SortPersianDirection,
  type SortPersianOptions,
} from '@persian-web/core/sort';
import { fixPersianTypography } from '@persian-web/core/typography';

import type { ApiModuleDoc } from './types';

/** Compile-time anchors so removing a public export breaks this catalog. */
const _apiAnchors = {
  toPersianDigits,
  toEnglishDigits,
  normalizePersian,
  formatNumber,
  formatCurrency,
  formatToman,
  formatRial,
  normalizePhone,
  isValidIranianPhone,
  formatIranianPhone,
  isValidNationalId,
  validateNationalId,
  normalizeForSearch,
  matchesPersian,
  includesPersian,
  persianSlug,
  fixPersianTypography,
  createPersianCollator,
  sortPersian,
  toJalali,
  toGregorian,
  formatJalali,
  relativeTime,
  getTextDirection,
  isRTL,
  isMixedDirection,
} as const;

void _apiAnchors;

type _TypeAnchors = [
  DigitNormalization,
  NormalizePersianOptions,
  FormatNumberDigits,
  FormatNumberNotation,
  FormatNumberOptions,
  Currency,
  CurrencyDigits,
  CurrencyDisplay,
  FormatCurrencyOptions,
  FormatCurrencyOptionsWithCurrency,
  IranianPhoneFormat,
  IranianPhoneDigits,
  FormatIranianPhoneOptions,
  NationalIdInvalidReason,
  ValidateNationalIdResult,
  JalaliDate,
  GregorianDate,
  FormatJalaliDigits,
  FormatJalaliOptions,
  RelativeTimeDigits,
  RelativeTimeOptions,
  ToJalaliOptions,
  PersianCollator,
  PersianCollatorOptions,
  SortPersianDirection,
  SortPersianOptions<string>,
  TextDirection,
];

type _AssertTypesExist = _TypeAnchors[number];
void 0 as unknown as _AssertTypesExist;

export const API_MODULES: readonly ApiModuleDoc[] = [
  {
    id: 'digits',
    path: '/digits',
    title: 'Digits',
    titleFa: 'ارقام',
    importPath: '@persian-web/core/digits',
    description:
      'Convert between English, Persian, and Arabic-Indic digit scripts. Non-digit characters are left unchanged.',
    symbols: [
      {
        name: 'toPersianDigits',
        kind: 'function',
        signature: 'toPersianDigits(value: string | number): string',
        description:
          'Maps English (0–9) and Arabic-Indic (٠–٩) digits to Persian (۰–۹). Numbers are stringified first.',
        examples: [
          {
            code: `toPersianDigits('قیمت: 2500')`,
            run: () => toPersianDigits('قیمت: 2500'),
          },
          {
            code: `toPersianDigits('٠١٢')`,
            run: () => toPersianDigits('٠١٢'),
          },
          {
            code: `toPersianDigits(-42.5)`,
            run: () => toPersianDigits(-42.5),
          },
        ],
      },
      {
        name: 'toEnglishDigits',
        kind: 'function',
        signature: 'toEnglishDigits(value: string | number): string',
        description:
          'Maps Persian (۰–۹) and Arabic-Indic (٠–٩) digits to English (0–9). Useful before numeric parsers.',
        examples: [
          {
            code: `toEnglishDigits('قیمت: ۲۵۰۰')`,
            run: () => toEnglishDigits('قیمت: ۲۵۰۰'),
          },
          {
            code: `toEnglishDigits('١2٣')`,
            run: () => toEnglishDigits('١2٣'),
          },
        ],
      },
    ],
  },
  {
    id: 'normalize',
    path: '/normalize',
    title: 'Normalize',
    titleFa: 'نرمال‌سازی',
    importPath: '@persian-web/core/normalize',
    description:
      'Stabilize Persian orthography: Yeh/Kaf/Heh fixes and ZWNJ cleanup, with optional digit, diacritic, and whitespace options.',
    symbols: [
      {
        name: 'normalizePersian',
        kind: 'function',
        signature:
          'normalizePersian(text: string, options?: NormalizePersianOptions): string',
        description:
          'Always applies Yeh/Kaf/Heh and ZWNJ cleanup. Digit, diacritic, and whitespace behavior are opt-in.',
        options: [
          {
            name: 'digits',
            type: "'persian' | 'english' | 'preserve'",
            defaultValue: "'preserve'",
            description: 'Digit script conversion.',
          },
          {
            name: 'removeDiacritics',
            type: 'boolean',
            defaultValue: 'false',
            description: 'Strip Arabic combining marks (tashkeel / harakat).',
          },
          {
            name: 'normalizeWhitespace',
            type: 'boolean',
            defaultValue: 'false',
            description:
              'Trim and collapse whitespace runs to a single ASCII space.',
          },
        ],
        examples: [
          {
            code: `normalizePersian('كي')`,
            run: () => normalizePersian('كي'),
          },
          {
            code: `normalizePersian('1٢۳', { digits: 'persian' })`,
            run: () => normalizePersian('1٢۳', { digits: 'persian' }),
          },
          {
            code: `normalizePersian('كِتَابٌ', { removeDiacritics: true })`,
            run: () => normalizePersian('كِتَابٌ', { removeDiacritics: true }),
          },
        ],
      },
      {
        name: 'DigitNormalization',
        kind: 'type',
        signature:
          "type DigitNormalization = 'persian' | 'english' | 'preserve'",
        description: 'Digit script policy for normalizePersian.',
      },
      {
        name: 'NormalizePersianOptions',
        kind: 'type',
        signature:
          'interface NormalizePersianOptions { digits?; removeDiacritics?; normalizeWhitespace? }',
        description: 'Optional behavior for normalizePersian.',
      },
    ],
  },
  {
    id: 'format',
    path: '/numbers',
    title: 'Numbers',
    titleFa: 'اعداد',
    importPath: '@persian-web/core/format',
    description:
      'Locale-aware number formatting via Intl.NumberFormat, with optional Persian digits and compact notation.',
    symbols: [
      {
        name: 'formatNumber',
        kind: 'function',
        signature:
          'formatNumber(value: number, options?: FormatNumberOptions): string',
        description:
          'Formats a number with locale grouping and optional Persian digit remapping.',
        options: [
          {
            name: 'locale',
            type: 'string',
            defaultValue: "'en-US'",
            description: 'BCP 47 locale passed to Intl.NumberFormat.',
          },
          {
            name: 'digits',
            type: "'persian' | 'english'",
            description: 'Digit script after Intl formatting.',
          },
          {
            name: 'useGrouping',
            type: 'boolean',
            defaultValue: 'true',
            description: 'Thousand separators (ignored for compact notation).',
          },
          {
            name: 'precision',
            type: 'number',
            description: 'Fixed fraction digits (sets min and max).',
          },
          {
            name: 'notation',
            type: "'standard' | 'compact'",
            defaultValue: "'standard'",
            description: 'Standard or compact (1.2M) formatting.',
          },
        ],
        examples: [
          {
            code: `formatNumber(1_250_000, { locale: 'fa-IR', digits: 'persian' })`,
            run: () =>
              formatNumber(1_250_000, { locale: 'fa-IR', digits: 'persian' }),
          },
          {
            code: `formatNumber(1_200_000, { notation: 'compact' })`,
            run: () => formatNumber(1_200_000, { notation: 'compact' }),
          },
        ],
      },
      {
        name: 'FormatNumberOptions',
        kind: 'type',
        signature:
          'interface FormatNumberOptions { locale?; digits?; useGrouping?; precision?; minimumFractionDigits?; maximumFractionDigits?; notation?; compactDisplay? }',
        description: 'Options for formatNumber.',
      },
      {
        name: 'FormatNumberDigits',
        kind: 'type',
        signature: "type FormatNumberDigits = 'persian' | 'english'",
        description: 'Digit script for formatNumber output.',
      },
      {
        name: 'FormatNumberNotation',
        kind: 'type',
        signature: "type FormatNumberNotation = 'standard' | 'compact'",
        description: 'NumberFormat notation mode.',
      },
    ],
  },
  {
    id: 'currency',
    path: '/currency',
    title: 'Currency',
    titleFa: 'واحد پول',
    importPath: '@persian-web/core/currency',
    description:
      'Format amounts for IRR (rial), IRT (toman), USD, and EUR with locale and digit options.',
    symbols: [
      {
        name: 'formatCurrency',
        kind: 'function',
        signature:
          'formatCurrency(value: number, options: FormatCurrencyOptionsWithCurrency): string',
        description:
          'Format an amount for a required currency code. IRT uses a toman label; others use Intl currency formatting.',
        options: [
          {
            name: 'currency',
            type: "'IRR' | 'IRT' | 'USD' | 'EUR'",
            description: 'Required currency code.',
          },
          {
            name: 'locale',
            type: 'string',
            description: 'BCP 47 locale for Intl formatting.',
          },
          {
            name: 'digits',
            type: "'persian' | 'english'",
            description: 'Digit script in the output.',
          },
          {
            name: 'currencyDisplay',
            type: "'symbol' | 'narrowSymbol' | 'code' | 'name'",
            description: 'How the currency is labeled (Intl currencies).',
          },
        ],
        examples: [
          {
            code: `formatCurrency(1_250_000, { currency: 'IRT', digits: 'persian' })`,
            run: () =>
              formatCurrency(1_250_000, {
                currency: 'IRT',
                digits: 'persian',
              }),
          },
          {
            code: `formatCurrency(12.5, { currency: 'USD', locale: 'en-US' })`,
            run: () =>
              formatCurrency(12.5, { currency: 'USD', locale: 'en-US' }),
          },
        ],
      },
      {
        name: 'formatToman',
        kind: 'function',
        signature:
          'formatToman(value: number, options?: FormatCurrencyOptions): string',
        description:
          "Shorthand for formatCurrency with currency: 'IRT'. Amount is in tomans.",
        examples: [
          {
            code: `formatToman(1_250_000)`,
            run: () => formatToman(1_250_000),
          },
        ],
      },
      {
        name: 'formatRial',
        kind: 'function',
        signature:
          'formatRial(value: number, options?: FormatCurrencyOptions): string',
        description:
          "Shorthand for formatCurrency with currency: 'IRR'. Amount is in rials.",
        examples: [
          {
            code: `formatRial(12_500_000)`,
            run: () => formatRial(12_500_000),
          },
        ],
      },
      {
        name: 'Currency',
        kind: 'type',
        signature: "type Currency = 'IRR' | 'IRT' | 'USD' | 'EUR'",
        description: 'Supported currency codes.',
      },
      {
        name: 'FormatCurrencyOptions',
        kind: 'type',
        signature:
          'interface FormatCurrencyOptions { locale?; digits?; precision?; currencyDisplay?; … }',
        description: 'Shared options for currency helpers (currency optional).',
      },
      {
        name: 'FormatCurrencyOptionsWithCurrency',
        kind: 'type',
        signature:
          'type FormatCurrencyOptionsWithCurrency = FormatCurrencyOptions & { currency: Currency }',
        description: 'Options for formatCurrency (currency required).',
      },
    ],
  },
  {
    id: 'phone',
    path: '/phone',
    title: 'Phone',
    titleFa: 'تلفن',
    importPath: '@persian-web/core/phone',
    description:
      'Iranian mobile helpers: normalize to E.164, validate, and format for display. Landlines and non-IR numbers are rejected.',
    symbols: [
      {
        name: 'normalizePhone',
        kind: 'function',
        signature: 'normalizePhone(value: string): string | null',
        description:
          'Parse a valid Iranian mobile into canonical E.164 (+989…). Returns null when invalid.',
        examples: [
          {
            code: `normalizePhone('۰۹۱۲۱۲۳۴۵۶۷')`,
            run: () => normalizePhone('۰۹۱۲۱۲۳۴۵۶۷'),
          },
          {
            code: `normalizePhone('02112345678')`,
            run: () => normalizePhone('02112345678'),
          },
        ],
      },
      {
        name: 'isValidIranianPhone',
        kind: 'function',
        signature: 'isValidIranianPhone(value: string): boolean',
        description: 'True when the value is a valid Iranian mobile number.',
        examples: [
          {
            code: `isValidIranianPhone('09121234567')`,
            run: () => isValidIranianPhone('09121234567'),
          },
        ],
      },
      {
        name: 'formatIranianPhone',
        kind: 'function',
        signature:
          'formatIranianPhone(value: string, options?: FormatIranianPhoneOptions): string | null',
        description:
          'Format a valid Iranian mobile for display (national or international).',
        options: [
          {
            name: 'format',
            type: "'national' | 'international'",
            defaultValue: "'national'",
            description: 'Display style.',
          },
          {
            name: 'digits',
            type: "'persian' | 'english'",
            defaultValue: "'english'",
            description: 'Digit script in the formatted string.',
          },
        ],
        examples: [
          {
            code: `formatIranianPhone('09121234567', { format: 'international', digits: 'persian' })`,
            run: () =>
              formatIranianPhone('09121234567', {
                format: 'international',
                digits: 'persian',
              }),
          },
        ],
      },
      {
        name: 'FormatIranianPhoneOptions',
        kind: 'type',
        signature: 'interface FormatIranianPhoneOptions { format?; digits? }',
        description: 'Options for formatIranianPhone.',
      },
      {
        name: 'IranianPhoneFormat',
        kind: 'type',
        signature: "type IranianPhoneFormat = 'national' | 'international'",
        description: 'Display format for Iranian mobiles.',
      },
      {
        name: 'IranianPhoneDigits',
        kind: 'type',
        signature: "type IranianPhoneDigits = 'persian' | 'english'",
        description: 'Digit script for phone formatting.',
      },
    ],
  },
  {
    id: 'national-id',
    path: '/national-id',
    title: 'National ID',
    titleFa: 'کد ملی',
    importPath: '@persian-web/core/national-id',
    description:
      'Validate Iranian national IDs (کد ملی) with checksum and structured invalid reasons.',
    symbols: [
      {
        name: 'isValidNationalId',
        kind: 'function',
        signature: 'isValidNationalId(value: string): boolean',
        description: 'Boolean validity check for a national ID string.',
        examples: [
          {
            code: `isValidNationalId('0013542419')`,
            run: () => isValidNationalId('0013542419'),
          },
        ],
      },
      {
        name: 'validateNationalId',
        kind: 'function',
        signature:
          'validateNationalId(value: string): ValidateNationalIdResult',
        description:
          'Structured result: { valid: true } or { valid: false, reason }.',
        examples: [
          {
            code: `validateNationalId('0013542419')`,
            run: () => validateNationalId('0013542419'),
          },
          {
            code: `validateNationalId('0000000000')`,
            run: () => validateNationalId('0000000000'),
          },
        ],
      },
      {
        name: 'ValidateNationalIdResult',
        kind: 'type',
        signature:
          'type ValidateNationalIdResult = { valid: true } | { valid: false; reason: NationalIdInvalidReason }',
        description: 'Discriminated union returned by validateNationalId.',
      },
      {
        name: 'NationalIdInvalidReason',
        kind: 'type',
        signature:
          "type NationalIdInvalidReason = 'invalid_length' | 'invalid_format' | 'invalid_checksum' | 'invalid_repeated_digits'",
        description: 'Why a national ID failed validation.',
      },
    ],
  },
  {
    id: 'search',
    path: '/search',
    title: 'Search',
    titleFa: 'جستجو',
    importPath: '@persian-web/core/search',
    description:
      'Persian-aware search folding and matching across Yeh/Kaf, digits, ZWNJ, and Latin case.',
    symbols: [
      {
        name: 'normalizeForSearch',
        kind: 'function',
        signature: 'normalizeForSearch(text: string): string',
        description:
          'Fold text into a stable search key (orthography, digits, ZWNJ, ASCII case).',
        examples: [
          {
            code: `normalizeForSearch('كلاسیک')`,
            run: () => normalizeForSearch('كلاسیک'),
          },
        ],
      },
      {
        name: 'matchesPersian',
        kind: 'function',
        signature: 'matchesPersian(text: string, query: string): boolean',
        description: 'True when both sides normalize to the same search key.',
        examples: [
          {
            code: `matchesPersian('كلاسیک', 'کلاسیک')`,
            run: () => matchesPersian('كلاسیک', 'کلاسیک'),
          },
        ],
      },
      {
        name: 'includesPersian',
        kind: 'function',
        signature: 'includesPersian(text: string, query: string): boolean',
        description:
          'Substring match after search normalization on both sides.',
        examples: [
          {
            code: `includesPersian('گوشی سامسونگ كلاسیک', 'کلاس')`,
            run: () => includesPersian('گوشی سامسونگ كلاسیک', 'کلاس'),
          },
        ],
      },
    ],
  },
  {
    id: 'slug',
    path: '/slug',
    title: 'Slug',
    titleFa: 'اسلاگ',
    importPath: '@persian-web/core/slug',
    description:
      'Build URL slugs that keep Persian letters while lowercasing Latin and normalizing separators.',
    symbols: [
      {
        name: 'persianSlug',
        kind: 'function',
        signature: 'persianSlug(text: string): string',
        description:
          'Produce a URL-safe slug that preserves Persian letters (does not transliterate to Latin).',
        examples: [
          {
            code: `persianSlug('سلام دنیا — Hello World!')`,
            run: () => persianSlug('سلام دنیا — Hello World!'),
          },
        ],
      },
    ],
  },
  {
    id: 'typography',
    path: '/typography',
    title: 'Typography',
    titleFa: 'تایپوگرافی',
    importPath: '@persian-web/core/typography',
    description:
      'Conservative display fixes for Persian typography: verbal-prefix ZWNJ, guillemets, and punctuation spacing.',
    symbols: [
      {
        name: 'fixPersianTypography',
        kind: 'function',
        signature: 'fixPersianTypography(text: string): string',
        description:
          'Apply display-oriented typography fixes without aggressive grammar rewriting.',
        examples: [
          {
            code: `fixPersianTypography('می رود')`,
            run: () => fixPersianTypography('می رود'),
          },
          {
            code: `fixPersianTypography('"سلام"')`,
            run: () => fixPersianTypography('"سلام"'),
          },
        ],
      },
    ],
  },
  {
    id: 'sort',
    path: '/sort',
    title: 'Sort',
    titleFa: 'مرتب‌سازی',
    importPath: '@persian-web/core/sort',
    description:
      'Persian-aware sorting on Intl.Collator with normalized sort keys for Yeh/Kaf and mixed digits.',
    symbols: [
      {
        name: 'createPersianCollator',
        kind: 'function',
        signature:
          'createPersianCollator(options?: PersianCollatorOptions): PersianCollator',
        description:
          'Create a reusable collator for pairwise compare or Array.sort.',
        options: [
          {
            name: 'locale',
            type: 'string',
            defaultValue: "'fa-IR'",
            description: 'BCP 47 locale for Intl.Collator.',
          },
          {
            name: 'numeric',
            type: 'boolean',
            defaultValue: 'true',
            description: 'Natural numeric ordering (2 before 10).',
          },
          {
            name: 'normalizeDigits',
            type: 'boolean',
            defaultValue: 'true',
            description:
              'Convert Persian/Arabic-Indic digits to English in sort keys.',
          },
        ],
        examples: [
          {
            code: `createPersianCollator().compare('كلاسیک', 'کلاسیک')`,
            run: () => createPersianCollator().compare('كلاسیک', 'کلاسیک'),
          },
        ],
      },
      {
        name: 'sortPersian',
        kind: 'function',
        signature:
          'sortPersian<T = string>(items: T[], options?: SortPersianOptions<T>): T[]',
        description:
          'Sort strings or objects with Persian collation. Returns a new array unless inPlace is set.',
        options: [
          {
            name: 'direction',
            type: "'asc' | 'desc'",
            defaultValue: "'asc'",
            description: 'Sort direction.',
          },
          {
            name: 'getKey',
            type: '(item: T) => string',
            description: 'Extract a string key when sorting objects.',
          },
          {
            name: 'inPlace',
            type: 'boolean',
            defaultValue: 'false',
            description: 'Mutate the input array when true.',
          },
        ],
        examples: [
          {
            code: `sortPersian(['یوسف', 'آرش', 'كيان', '۱۲', '2'])`,
            run: () => sortPersian(['یوسف', 'آرش', 'كيان', '۱۲', '2']),
          },
        ],
      },
      {
        name: 'PersianCollator',
        kind: 'type',
        signature:
          'interface PersianCollator { readonly collator: Intl.Collator; compare(a: string, b: string): number }',
        description: 'Reusable Persian collator wrapper.',
      },
      {
        name: 'PersianCollatorOptions',
        kind: 'type',
        signature:
          'interface PersianCollatorOptions { locale?; numeric?; sensitivity?; normalizeDigits? }',
        description: 'Options for createPersianCollator / sortPersian.',
      },
      {
        name: 'SortPersianOptions',
        kind: 'type',
        signature:
          'interface SortPersianOptions<T> { …collator options; getKey?; direction?; inPlace?; collator? }',
        description: 'Options for sortPersian.',
      },
      {
        name: 'SortPersianDirection',
        kind: 'type',
        signature: "type SortPersianDirection = 'asc' | 'desc'",
        description: 'Sort direction.',
      },
    ],
  },
  {
    id: 'date',
    path: '/date',
    title: 'Jalali date',
    titleFa: 'تاریخ جلالی',
    importPath: '@persian-web/core/date',
    description:
      'Jalali (Persian calendar) conversion, formatting, and relative time helpers.',
    symbols: [
      {
        name: 'toJalali',
        kind: 'function',
        signature:
          'toJalali(date: Date, options?: ToJalaliOptions): JalaliDate\ntoJalali(year: number, month: number, day: number): JalaliDate',
        description:
          'Convert Gregorian Date or Y/M/D civil parts to Jalali { year, month, day }.',
        examples: [
          {
            code: `toJalali(2024, 3, 20)`,
            run: () => toJalali(2024, 3, 20),
          },
        ],
      },
      {
        name: 'toGregorian',
        kind: 'function',
        signature:
          'toGregorian(year: number, month: number, day: number): GregorianDate',
        description:
          'Convert Jalali civil year/month/day to Gregorian { year, month, day }. Pure calendar math — no time zone.',
        examples: [
          {
            code: `toGregorian(1403, 1, 1)`,
            run: () => toGregorian(1403, 1, 1),
          },
        ],
      },
      {
        name: 'formatJalali',
        kind: 'function',
        signature:
          'formatJalali(date: Date | JalaliDate, options?: FormatJalaliOptions): string',
        description:
          'Format a Jalali or Gregorian Date with patterns like YYYY/MM/DD.',
        options: [
          {
            name: 'pattern',
            type: 'string',
            defaultValue: "'YYYY/MM/DD'",
            description: 'Format pattern tokens (YYYY, MM, DD, …).',
          },
          {
            name: 'digits',
            type: "'english' | 'persian'",
            defaultValue: "'english'",
            description: 'Digit script in the formatted string.',
          },
          {
            name: 'timeZone',
            type: 'string',
            description: 'Time zone when formatting a Date instance.',
          },
        ],
        examples: [
          {
            code: `formatJalali({ year: 1403, month: 1, day: 1 }, { digits: 'persian' })`,
            run: () =>
              formatJalali(
                { year: 1403, month: 1, day: 1 },
                { digits: 'persian' },
              ),
          },
        ],
      },
      {
        name: 'relativeTime',
        kind: 'function',
        signature:
          'relativeTime(date: Date, options?: RelativeTimeOptions): string',
        description:
          'Relative time phrasing via Intl.RelativeTimeFormat (locale-dependent).',
        examples: [
          {
            code: `relativeTime(new Date(Date.now() - 60_000), { digits: 'persian' })`,
            run: () =>
              relativeTime(new Date(Date.now() - 60_000), {
                digits: 'persian',
              }),
          },
        ],
      },
      {
        name: 'JalaliDate',
        kind: 'type',
        signature:
          'interface JalaliDate { year: number; month: number; day: number }',
        description: 'Jalali civil date parts.',
      },
      {
        name: 'GregorianDate',
        kind: 'type',
        signature:
          'interface GregorianDate { year: number; month: number; day: number }',
        description: 'Gregorian civil date parts.',
      },
      {
        name: 'FormatJalaliOptions',
        kind: 'type',
        signature:
          'interface FormatJalaliOptions { pattern?; digits?; timeZone? }',
        description: 'Options for formatJalali.',
      },
      {
        name: 'ToJalaliOptions',
        kind: 'type',
        signature: 'interface ToJalaliOptions { timeZone? }',
        description: 'Options when converting a Date with toJalali.',
      },
      {
        name: 'RelativeTimeOptions',
        kind: 'type',
        signature: 'interface RelativeTimeOptions { digits?; now?; numeric? }',
        description: 'Options for relativeTime.',
      },
    ],
  },
  {
    id: 'direction',
    path: '/direction',
    title: 'Direction',
    titleFa: 'جهت متن',
    importPath: '@persian-web/core/direction',
    description:
      'Detect text direction from strong bidirectional characters for UI dir heuristics.',
    symbols: [
      {
        name: 'getTextDirection',
        kind: 'function',
        signature: 'getTextDirection(text: string): TextDirection',
        description:
          "Returns 'rtl' | 'ltr' | 'mixed' | 'neutral' based on strong characters.",
        examples: [
          {
            code: `getTextDirection('سلام دنیا')`,
            run: () => getTextDirection('سلام دنیا'),
          },
          {
            code: `getTextDirection('Android گوشی ۱۲۳')`,
            run: () => getTextDirection('Android گوشی ۱۲۳'),
          },
        ],
      },
      {
        name: 'isRTL',
        kind: 'function',
        signature: 'isRTL(text: string): boolean',
        description: "True only when getTextDirection returns 'rtl'.",
        examples: [
          {
            code: `isRTL('سلام دنیا')`,
            run: () => isRTL('سلام دنیا'),
          },
        ],
      },
      {
        name: 'isMixedDirection',
        kind: 'function',
        signature: 'isMixedDirection(text: string): boolean',
        description: "True only when getTextDirection returns 'mixed'.",
        examples: [
          {
            code: `isMixedDirection('Android گوشی')`,
            run: () => isMixedDirection('Android گوشی'),
          },
        ],
      },
      {
        name: 'TextDirection',
        kind: 'type',
        signature: "type TextDirection = 'rtl' | 'ltr' | 'mixed' | 'neutral'",
        description: 'Direction classification for UI heuristics.',
      },
    ],
  },
] as const satisfies readonly ApiModuleDoc[];

export function findApiModule(path: string): ApiModuleDoc | undefined {
  return API_MODULES.find((module) => module.path === path);
}

export function findApiModuleById(id: string): ApiModuleDoc | undefined {
  return API_MODULES.find((module) => module.id === id);
}

/** Flat list of every documented function name (for FAQ / indexes). */
export function listFunctionNames(): string[] {
  return API_MODULES.flatMap((module) =>
    module.symbols.filter((s) => s.kind === 'function').map((s) => s.name),
  );
}
