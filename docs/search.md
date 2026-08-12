# Search

Persian-aware exact search helpers built on search-oriented normalization (not stemming or fuzzy matching).

```ts
import {
  normalizeForSearch,
  includesPersian,
  matchesPersian,
} from '@persian-web/core/search';
```

`normalizeForSearch` applies:

| Aspect                  | Behavior                                                        |
| ----------------------- | --------------------------------------------------------------- |
| Arabic/Persian variants | Yeh/Kaf and related always-applied fixes via `normalizePersian` |
| Whitespace              | Trimmed; internal runs collapsed to one ASCII space             |
| Digits                  | English (`0–9`) so `۱۲۳` matches `123`                          |
| Diacritics              | Removed                                                         |
| ZWNJ                    | Removed entirely (`می‌روم` matches `میروم`)                     |
| Latin case              | ASCII `A–Z` → lowercase; Persian unaffected                     |

Results are memoized (LRU, max **512** entries).

---

## `normalizeForSearch`

### Description

Builds a stable search key from arbitrary text. Use this when you need to store or compare normalized keys yourself.

### Usage

```ts
normalizeForSearch(text: string): string
```

### Output

Normalized search key, or `''` for empty input. Input is never mutated.

### Options

None (search defaults are fixed).

### Edge cases

| Situation                       | Behavior                      |
| ------------------------------- | ----------------------------- |
| Empty string                    | `''` (same reference)         |
| Non-ASCII Latin case (e.g. `İ`) | Not folded — only ASCII `A–Z` |
| Stemming / fuzzy                | Out of scope                  |
| Repeated calls with same string | Cached                        |

### Examples

```ts
normalizeForSearch('گوشی سامسونگ كلاسیک');
// 'گوشی سامسونگ کلاسیک'

normalizeForSearch('  Galaxy S24  ');
// 'galaxy s24'

normalizeForSearch('قیمت: ۲۵۰۰');
// 'قیمت: 2500'

normalizeForSearch('می‌روم');
// 'میروم'
```

---

## `matchesPersian`

### Description

Returns whether `text` equals `query` after both sides pass through `normalizeForSearch`.

### Usage

```ts
matchesPersian(text: string, query: string): boolean
```

### Output

`boolean`. An empty `query` matches any `text` (including empty), mirroring `String.prototype.includes('')` semantics for empty needles used elsewhere — here empty normalized query → `true`.

### Options

None.

### Edge cases

| `text`                 | `query`               | Result  |
| ---------------------- | --------------------- | ------- |
| anything               | `''`                  | `true`  |
| `''`                   | `'query'`             | `false` |
| Yeh/Kaf variants       | matching Persian form | `true`  |
| Differing only by ZWNJ | equal after strip     | `true`  |

### Examples

```ts
matchesPersian('گوشی سامسونگ كلاسیک', 'گوشی سامسونگ کلاسیک'); // true
matchesPersian('Samsung Galaxy', 'samsung galaxy'); // true
matchesPersian('anything', ''); // true
matchesPersian('', 'query'); // false
```

---

## `includesPersian`

### Description

Returns whether normalized `text` contains normalized `query` as a substring.

### Usage

```ts
includesPersian(text: string, query: string): boolean
```

### Output

`boolean`. Empty query → `true`. Empty text with non-empty query → `false`.

### Options

None.

### Edge cases

| Situation                                 | Behavior                  |
| ----------------------------------------- | ------------------------- |
| Empty query                               | `true`                    |
| Empty text, non-empty query               | `false`                   |
| Query matches across former ZWNJ boundary | `true` after strip        |
| Partial Yeh/Kaf variants in query         | Match after normalization |

### Examples

```ts
includesPersian('گوشی سامسونگ Galaxy S24', 'سامسونگ'); // true
includesPersian('گوشی سامسونگ كلاسیک', 'كلاس'); // true
includesPersian('می‌روم به خانه', 'میروم'); // true
includesPersian('anything', ''); // true
includesPersian('', 'query'); // false
```
