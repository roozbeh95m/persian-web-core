import { normalizePersian } from '../normalize/normalize-persian.js';
import { foldAsciiLatinCase } from '../shared/fold-ascii-latin-case.js';

import type { NormalizePersianOptions } from '../normalize/types.js';

/** Zero-width non-joiner — stripped during search normalization. */
const ZWNJ = '\u200C';

/** Options passed to {@link normalizePersian} for search normalization. */
const SEARCH_NORMALIZE_OPTIONS = {
  digits: 'english',
  removeDiacritics: true,
  normalizeWhitespace: true,
} as const satisfies NormalizePersianOptions;

/** Maximum cached {@link normalizeForSearch} results (LRU eviction). */
const SEARCH_CACHE_MAX_SIZE = 512;

const searchNormalizeCache = new Map<string, string>();

/**
 * Removes every ZWNJ so compound forms match their joined spellings during search.
 */
function stripZwnj(input: string): string {
  if (!input.includes(ZWNJ)) {
    return input;
  }
  return input.replaceAll(ZWNJ, '');
}

function applySearchNormalization(text: string): string {
  if (text.length === 0) {
    return text;
  }

  let result = normalizePersian(text, SEARCH_NORMALIZE_OPTIONS);
  result = stripZwnj(result);
  result = foldAsciiLatinCase(result);

  return result;
}

function rememberSearchNormalization(input: string, result: string): string {
  if (searchNormalizeCache.size >= SEARCH_CACHE_MAX_SIZE) {
    const oldestKey = searchNormalizeCache.keys().next().value;
    if (oldestKey !== undefined) {
      searchNormalizeCache.delete(oldestKey);
    }
  }
  searchNormalizeCache.set(input, result);
  return result;
}

/**
 * Normalizes text for Persian-aware exact search.
 *
 * Built on {@link normalizePersian} with search-oriented defaults:
 *
 * | Aspect | Behavior |
 * | --- | --- |
 * | Arabic/Persian variants | Yeh/Kaf and related always-applied fixes |
 * | Whitespace | Trimmed; internal runs collapsed to one ASCII space |
 * | Digits | English (`0–9`) so `۱۲۳` matches `123` |
 * | Diacritics | Removed (tashkeel, hamza above in `هٔ`, etc.) |
 * | ZWNJ | Removed entirely (`می‌روم` matches `میروم`) |
 * | Latin case | ASCII `A–Z` folded to lowercase; Persian unaffected |
 *
 * Results are memoized so repeated queries (typical in list filtering)
 * reuse the same normalized string.
 *
 * @param text - Input string (never mutated).
 * @returns Normalized search key, or `''` for empty input.
 *
 * @example
 * ```ts
 * normalizeForSearch('گوشی سامسونگ كلاسیک');
 * // 'گوشی سامسونگ کلاسیک'
 *
 * normalizeForSearch('  Galaxy S24  ');
 * // 'galaxy s24'
 *
 * normalizeForSearch('قیمت: ۲۵۰۰');
 * // 'قیمت: 2500'
 * ```
 */
export function normalizeForSearch(text: string): string {
  if (text.length === 0) {
    return text;
  }

  const cached = searchNormalizeCache.get(text);
  if (cached !== undefined) {
    return cached;
  }

  const result = applySearchNormalization(text);
  return rememberSearchNormalization(text, result);
}

/**
 * Returns whether `text` equals `query` after {@link normalizeForSearch}.
 *
 * An empty `query` matches any `text` (including empty), mirroring
 * `String.prototype.includes('')`.
 *
 * @example
 * ```ts
 * matchesPersian('گوشی سامسونگ كلاسیک', 'گوشی سامسونگ کلاسیک'); // true
 * matchesPersian('Samsung Galaxy', 'samsung galaxy'); // true
 * matchesPersian('anything', ''); // true
 * matchesPersian('', 'query'); // false
 * ```
 */
export function matchesPersian(text: string, query: string): boolean {
  const normalizedQuery = normalizeForSearch(query);
  if (normalizedQuery.length === 0) {
    return true;
  }

  return normalizeForSearch(text) === normalizedQuery;
}

/**
 * Returns whether normalized `text` contains normalized `query`.
 *
 * An empty `query` matches any `text` (including empty), mirroring
 * `String.prototype.includes('')`.
 *
 * @example
 * ```ts
 * includesPersian('گوشی سامسونگ Galaxy S24', 'سامسونگ'); // true
 * includesPersian('گوشی سامسونگ كلاسیک', 'كلاس'); // true
 * includesPersian('anything', ''); // true
 * includesPersian('', 'query'); // false
 * ```
 */
export function includesPersian(text: string, query: string): boolean {
  const normalizedQuery = normalizeForSearch(query);
  if (normalizedQuery.length === 0) {
    return true;
  }

  if (text.length === 0) {
    return false;
  }

  return normalizeForSearch(text).includes(normalizedQuery);
}

/** Clears the {@link normalizeForSearch} memoization cache (for tests). */
export function clearSearchNormalizeCache(): void {
  searchNormalizeCache.clear();
}
