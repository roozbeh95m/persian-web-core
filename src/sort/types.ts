/**
 * Options for {@link createPersianCollator} and {@link sortPersian}.
 */
export interface PersianCollatorOptions {
  /**
   * BCP 47 locale tag passed to `Intl.Collator`.
   *
   * @defaultValue `'fa-IR'`
   */
  locale?: string;

  /**
   * When `true`, digit sequences sort numerically (`2` before `10`).
   *
   * @defaultValue `true`
   */
  numeric?: boolean;

  /**
   * Collation sensitivity forwarded to `Intl.Collator`.
   *
   * `'base'` ignores case and most accent differences (Latin `A`/`a`, Arabic
   * `ك`/`ک` when not pre-normalized). Sort keys are still normalized for
   * Yeh/Kaf variants before comparison.
   *
   * @defaultValue `'base'`
   */
  sensitivity?: Intl.CollatorOptions['sensitivity'];

  /**
   * When `true`, convert Persian and Arabic-Indic digits to English in sort
   * keys so `۱۲` and `12` collate consistently with {@link numeric}.
   *
   * @defaultValue `true`
   */
  normalizeDigits?: boolean;
}

/**
 * Sort direction for {@link sortPersian}.
 */
export type SortPersianDirection = 'asc' | 'desc';

/**
 * Options for {@link sortPersian}.
 */
export interface SortPersianOptions<T = string> extends PersianCollatorOptions {
  /**
   * Extract the string sort key from each item. Required when sorting arrays
   * of non-string values.
   */
  getKey?: (item: T) => string;

  /**
   * Sort order.
   *
   * @defaultValue `'asc'`
   */
  direction?: SortPersianDirection;

  /**
   * When `true`, mutates the input array in place and returns it. When `false`
   * (default), returns a new sorted array and leaves the input unchanged.
   *
   * @defaultValue `false`
   */
  inPlace?: boolean;

  /**
   * Reuse a collator from {@link createPersianCollator} instead of creating
   * one per call. Useful when sorting many arrays with identical options.
   */
  collator?: PersianCollator;
}

/**
 * Persian-aware string collator built on `Intl.Collator`.
 */
export interface PersianCollator {
  /** Underlying `Intl.Collator` instance. */
  readonly collator: Intl.Collator;

  /**
   * Compare two strings using Persian locale rules.
   *
   * Inputs are never mutated. Sort keys are derived internally.
   */
  compare: (a: string, b: string) => number;
}
