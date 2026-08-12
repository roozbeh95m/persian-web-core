/**
 * Cached `Intl.NumberFormat` instances.
 *
 * Constructing `Intl.NumberFormat` dominates `formatNumber` /
 * `formatCurrency` cost when the same options are reused (price lists,
 * carts). A small LRU keeps correctness identical while avoiding rebuilds.
 */
const CACHE_MAX_SIZE = 64;

const numberFormatCache = new Map<string, Intl.NumberFormat>();

function cacheKey(locale: string, options: Intl.NumberFormatOptions): string {
  // Manual key — faster and more stable than JSON.stringify for our fixed shape.
  return [
    locale,
    options.style ?? '',
    options.currency ?? '',
    options.currencyDisplay ?? '',
    options.notation ?? '',
    options.compactDisplay ?? '',
    options.useGrouping === false
      ? '0'
      : options.useGrouping === true
        ? '1'
        : '',
    options.minimumFractionDigits ?? '',
    options.maximumFractionDigits ?? '',
  ].join('|');
}

/**
 * Returns a cached `Intl.NumberFormat` for the given locale/options.
 * Evicts the least-recently-used entry when the cache is full.
 */
export function getCachedNumberFormat(
  locale: string,
  options: Intl.NumberFormatOptions,
): Intl.NumberFormat {
  const key = cacheKey(locale, options);
  const cached = numberFormatCache.get(key);
  if (cached !== undefined) {
    // Refresh LRU order (Map preserves insertion order).
    numberFormatCache.delete(key);
    numberFormatCache.set(key, cached);
    return cached;
  }

  const formatter = new Intl.NumberFormat(locale, options);

  if (numberFormatCache.size >= CACHE_MAX_SIZE) {
    const oldestKey = numberFormatCache.keys().next().value;
    if (oldestKey !== undefined) {
      numberFormatCache.delete(oldestKey);
    }
  }

  numberFormatCache.set(key, formatter);
  return formatter;
}

/** Clears the formatter cache (for tests). */
export function clearNumberFormatCache(): void {
  numberFormatCache.clear();
}
