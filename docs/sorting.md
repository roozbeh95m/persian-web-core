# Sorting

Persian-aware string sorting on `Intl.Collator`, with normalized sort keys for predictable ordering across Arabic/Persian variants and mixed digit scripts.

```ts
import { createPersianCollator, sortPersian } from '@persian-web/core/sort';
import type {
  PersianCollator,
  PersianCollatorOptions,
  SortPersianDirection,
  SortPersianOptions,
} from '@persian-web/core/sort';
```

**Sort key normalization (before `Intl.Collator`):**

| Aspect                  | Behavior                                       |
| ----------------------- | ---------------------------------------------- |
| Arabic/Persian variants | Yeh/Kaf fixes via `normalizePersian`           |
| Digits                  | English when `normalizeDigits` is on (default) |
| Latin case              | ASCII `A–Z` folded to lowercase in sort keys   |
| Numeric sequences       | Natural order when `numeric` is on (default)   |

---

## `createPersianCollator`

### Description

Creates a reusable collator for pairwise string comparison. Prefer this when sorting many arrays or comparing pairs repeatedly.

### Usage

```ts
createPersianCollator(options?: PersianCollatorOptions): PersianCollator
```

```ts
interface PersianCollator {
  readonly collator: Intl.Collator;
  compare: (a: string, b: string) => number;
}
```

### Output

A `PersianCollator` whose `compare` returns negative, zero, or positive like `Array.prototype.sort` comparators.

### Options

| Option            | Type                                  | Default   | Description                                                 |
| ----------------- | ------------------------------------- | --------- | ----------------------------------------------------------- |
| `locale`          | `string`                              | `'fa-IR'` | BCP 47 locale for `Intl.Collator`                           |
| `numeric`         | `boolean`                             | `true`    | Natural numeric ordering (`2` before `10`)                  |
| `sensitivity`     | `Intl.CollatorOptions['sensitivity']` | `'base'`  | Collation sensitivity                                       |
| `normalizeDigits` | `boolean`                             | `true`    | Convert Persian/Arabic-Indic digits to English in sort keys |

### Edge cases

| Situation               | Behavior                                              |
| ----------------------- | ----------------------------------------------------- |
| Yeh/Kaf-only difference | Compare equal at primary strength after normalization |
| Empty strings           | Ordered by `Intl.Collator` on empty keys              |
| Mixed Persian/Latin     | Locale collation on normalized keys                   |

### Examples

```ts
const collator = createPersianCollator();

collator.compare('كلاسیک', 'کلاسیک'); // 0
collator.compare('item 2', 'item 10'); // < 0

['ب', 'ا', 'پ'].sort(collator.compare); // ['ا', 'ب', 'پ']
```

---

## `sortPersian`

### Description

Sorts string arrays or object arrays via an optional typed `getKey` accessor. Uses a Schwartzian transform so each key is normalized once. By default returns a **new array**; pass `{ inPlace: true }` to mutate.

The default collator is cached across calls. Pass `{ collator }` to reuse an instance from `createPersianCollator`.

### Usage

```ts
sortPersian<T = string>(
  items: T[],
  options?: SortPersianOptions<T>,
): T[]
```

### Output

Sorted array (copy unless `inPlace: true`).

### Options

Extends collator options:

| Option      | Type                  | Default        | Description                   |
| ----------- | --------------------- | -------------- | ----------------------------- |
| `direction` | `'asc' \| 'desc'`     | `'asc'`        | Sort direction                |
| `getKey`    | `(item: T) => string` | identity       | Required for non-string items |
| `inPlace`   | `boolean`             | `false`        | Mutate the input array        |
| `collator`  | `PersianCollator`     | cached default | Reuse a collator              |

Pass either `collator` **or** collation options (`locale`, `numeric`, …), not both.

### Edge cases

| Situation                               | Behavior                                     |
| --------------------------------------- | -------------------------------------------- |
| `collator` + collation options together | Throws `TypeError`                           |
| Non-string items without `getKey`       | Throws `TypeError`                           |
| Fake / incomplete collator object       | Throws `TypeError`                           |
| Empty array                             | Returns empty (copy or same ref if in-place) |

### Examples

```ts
sortPersian(['item 10', 'item 2']);
// ['item 2', 'item 10']

sortPersian([{ title: 'گوشی سامسونگ' }, { title: 'آیفون' }], {
  getKey: (item) => item.title,
});

sortPersian(['ب', 'ا'], { direction: 'desc' });
// ['ب', 'ا']

const list = ['ب', 'ا'];
sortPersian(list, { inPlace: true }); // mutates list

const collator = createPersianCollator({ numeric: false });
sortPersian(['a10', 'a2'], { collator });
```

### Performance notes

| Operation                 | Guidance                                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------ |
| `createPersianCollator()` | Reuse when sorting many arrays                                                                   |
| `sortPersian(array)`      | Default collator cached; keys normalized once                                                    |
| Large arrays              | Pass `{ collator }` to skip option resolution; run `npm run benchmark` locally for relative cost |
