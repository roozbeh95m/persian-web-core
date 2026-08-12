import { normalizePersian } from '../normalize/normalize-persian.js';
import { foldAsciiLatinCase } from '../shared/fold-ascii-latin-case.js';

import type {
  PersianCollator,
  PersianCollatorOptions,
  SortPersianDirection,
  SortPersianOptions,
} from './types.js';

/** Default locale for Persian collation. */
const DEFAULT_LOCALE = 'fa-IR';

/** Options passed to {@link normalizePersian} when building sort keys. */
const SORT_KEY_NORMALIZE_OPTIONS = {
  digits: 'english',
} as const;

/** Resolved collation options after defaults are applied. */
interface ResolvedCollatorOptions {
  locale: string;
  numeric: boolean;
  sensitivity: Intl.CollatorOptions['sensitivity'];
  normalizeDigits: boolean;
}

const DEFAULT_COLLATOR_OPTIONS: ResolvedCollatorOptions = {
  locale: DEFAULT_LOCALE,
  numeric: true,
  sensitivity: 'base',
  normalizeDigits: true,
};

interface PersianCollatorState {
  collator: Intl.Collator;
  tieBreaker: Intl.Collator;
  normalizeDigits: boolean;
}

function resolveCollatorOptions(
  options?: PersianCollatorOptions,
): ResolvedCollatorOptions {
  return {
    locale: options?.locale ?? DEFAULT_COLLATOR_OPTIONS.locale,
    numeric: options?.numeric ?? DEFAULT_COLLATOR_OPTIONS.numeric,
    sensitivity: options?.sensitivity ?? DEFAULT_COLLATOR_OPTIONS.sensitivity,
    normalizeDigits:
      options?.normalizeDigits ?? DEFAULT_COLLATOR_OPTIONS.normalizeDigits,
  };
}

function createIntlCollator(
  options: ResolvedCollatorOptions,
  sensitivity: Intl.CollatorOptions['sensitivity'],
): Intl.Collator {
  return new Intl.Collator(options.locale, {
    usage: 'sort',
    numeric: options.numeric,
    sensitivity,
  });
}

/**
 * Builds a normalized sort key from raw text.
 *
 * Always applies Yeh/Kaf fixes via {@link normalizePersian}. Optionally
 * converts digits to English so mixed-script numbers collate predictably.
 */
function buildSortKey(text: string, normalizeDigits: boolean): string {
  if (text.length === 0) {
    return text;
  }

  let result = normalizeDigits
    ? normalizePersian(text, SORT_KEY_NORMALIZE_OPTIONS)
    : normalizePersian(text);

  result = foldAsciiLatinCase(result);
  return result;
}

function comparePrepared(
  state: PersianCollatorState,
  keyA: string,
  keyB: string,
): number {
  if (keyA === keyB) {
    return 0;
  }

  const primaryResult = state.collator.compare(keyA, keyB);
  if (primaryResult !== 0) {
    return primaryResult;
  }

  return state.tieBreaker.compare(keyA, keyB);
}

function applyDirection(
  result: number,
  direction: SortPersianDirection,
): number {
  return direction === 'desc' ? -result : result;
}

const collatorStates = new WeakMap<PersianCollator, PersianCollatorState>();

let defaultCollator: PersianCollator | undefined;

function createCollatorState(
  options?: PersianCollatorOptions,
): PersianCollatorState {
  const resolved = resolveCollatorOptions(options);
  return {
    collator: createIntlCollator(resolved, resolved.sensitivity),
    tieBreaker: createIntlCollator(resolved, 'variant'),
    normalizeDigits: resolved.normalizeDigits,
  };
}

/**
 * Creates a reusable Persian string collator backed by `Intl.Collator`.
 *
 * Sort keys are normalized before comparison:
 *
 * | Aspect | Behavior |
 * | --- | --- |
 * | Arabic/Persian variants | Yeh/Kaf fixes via {@link normalizePersian} |
 * | Digits | English (`0–9`) when {@link PersianCollatorOptions.normalizeDigits} is on (default) |
 * | Latin case | ASCII `A–Z` folded to lowercase in sort keys |
 * | Mixed Persian/Latin | `Intl.Collator` with `fa-IR` locale |
 * | Numeric sequences | Natural order when {@link PersianCollatorOptions.numeric} is on (default) |
 *
 * Reuse the returned collator when sorting many arrays — constructing
 * `Intl.Collator` is the most expensive part of a sort.
 *
 * @param options - Collation controls; see {@link PersianCollatorOptions}.
 * @returns A {@link PersianCollator} with `compare` and the underlying `collator`.
 *
 * @example
 * ```ts
 * const collator = createPersianCollator();
 * collator.compare('كلاسیک', 'کلاسیک'); // 0
 * collator.compare('item 2', 'item 10'); // < 0
 *
 * ['ب', 'ا'].sort(collator.compare); // ['ا', 'ب']
 * ```
 */
export function createPersianCollator(
  options?: PersianCollatorOptions,
): PersianCollator {
  const state = createCollatorState(options);

  const persianCollator: PersianCollator = {
    collator: state.collator,
    compare(a: string, b: string): number {
      return comparePrepared(
        state,
        buildSortKey(a, state.normalizeDigits),
        buildSortKey(b, state.normalizeDigits),
      );
    },
  };

  collatorStates.set(persianCollator, state);
  return persianCollator;
}

function getDefaultCollatorState(): PersianCollatorState {
  defaultCollator ??= createPersianCollator();
  return collatorStates.get(defaultCollator)!;
}

/** Clears the cached default collator (for tests). */
export function clearDefaultPersianCollator(): void {
  defaultCollator = undefined;
}

function resolveSortState(
  options?: PersianCollatorOptions & Pick<SortPersianOptions, 'collator'>,
): PersianCollatorState {
  if (options?.collator !== undefined) {
    if (
      options.locale !== undefined ||
      options.numeric !== undefined ||
      options.sensitivity !== undefined ||
      options.normalizeDigits !== undefined
    ) {
      throw new TypeError(
        'sortPersian: pass either collator or collation options, not both',
      );
    }

    const state = collatorStates.get(options.collator);
    if (state === undefined) {
      throw new TypeError(
        'sortPersian: collator must come from createPersianCollator',
      );
    }

    return state;
  }

  if (
    options?.locale === undefined &&
    options?.numeric === undefined &&
    options?.sensitivity === undefined &&
    options?.normalizeDigits === undefined
  ) {
    return getDefaultCollatorState();
  }

  return createCollatorState(options);
}

function sortKeyedItems<T>(
  items: readonly T[],
  state: PersianCollatorState,
  getKey: (item: T) => string,
  direction: SortPersianDirection,
): T[] {
  type KeyedItem = { item: T; key: string };

  const keyed: KeyedItem[] = items.map((item) => {
    const original = getKey(item);
    return {
      item,
      key: buildSortKey(original, state.normalizeDigits),
    };
  });

  keyed.sort((left, right) => {
    const result = comparePrepared(state, left.key, right.key);
    return applyDirection(result, direction);
  });

  return keyed.map((entry) => entry.item);
}

/**
 * Sorts strings or arrays of objects using Persian locale rules.
 *
 * By default returns a **new** array and does not mutate the input. Pass
 * `{ inPlace: true }` to sort the input array in place.
 *
 * For object arrays, provide `getKey` to extract the string sort key.
 *
 * @param items - Strings or objects to sort (never mutated unless `inPlace: true`).
 * @param options - Sort direction, key accessor, and collation options.
 * @returns Sorted array (new reference unless `inPlace: true`).
 *
 * @example
 * ```ts
 * sortPersian(['ب', 'ا', 'پ']); // ['ا', 'ب', 'پ']
 *
 * sortPersian(['item 10', 'item 2']); // ['item 2', 'item 10']
 *
 * sortPersian(
 *   [{ title: 'گوشی سامسونگ' }, { title: 'آیفون' }],
 *   { getKey: (item) => item.title },
 * );
 *
 * const list = ['ب', 'ا'];
 * sortPersian(list, { inPlace: true }); // mutates list
 * ```
 */
export function sortPersian(
  items: string[],
  options?: SortPersianOptions,
): string[];
export function sortPersian<T>(
  items: T[],
  options: SortPersianOptions<T> & { getKey: (item: T) => string },
): T[];
export function sortPersian<T>(
  items: readonly T[],
  options?: SortPersianOptions<T>,
): T[] {
  const direction = options?.direction ?? 'asc';
  const inPlace = options?.inPlace ?? false;
  const state = resolveSortState(options);
  const getKey =
    options?.getKey ??
    ((item: T) => {
      if (typeof item !== 'string') {
        throw new TypeError(
          'sortPersian requires getKey when sorting non-string arrays',
        );
      }
      return item;
    });

  const sorted = sortKeyedItems(items, state, getKey, direction);

  if (inPlace) {
    const mutable = items as T[];
    for (let i = 0; i < sorted.length; i++) {
      mutable[i] = sorted[i]!;
    }
    return mutable;
  }

  return sorted;
}
