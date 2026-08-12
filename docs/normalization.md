# Normalization

Stabilize Persian orthography without surprising edits. Yeh/Kaf variants and ZWNJ cleanup are always applied; digit, diacritic, and whitespace behavior are opt-in.

```ts
import { normalizePersian } from '@persian-web/core/normalize';
import type {
  DigitNormalization,
  NormalizePersianOptions,
} from '@persian-web/core/normalize';
```

---

## `normalizePersian`

### Description

Produces a stable Persian string form for storage, comparison, or further processing.

**Always applied**

| Input                            | Result                                                    |
| -------------------------------- | --------------------------------------------------------- |
| Arabic Yeh `ي` (U+064A)          | Persian Yeh `ی` (U+06CC)                                  |
| Alef Maksura `ى` (U+0649)        | Persian Yeh `ی` (U+06CC)                                  |
| Arabic Kaf `ك` (U+0643)          | Persian Kaf `ک` (U+06A9)                                  |
| Heh with Yeh above `ۀ` (U+06C0)  | `هٔ` (heh + hamza above), or `ه` if `removeDiacritics`    |
| ZWNJ runs / edge / next to space | Collapsed or dropped; meaningful joins like `می‌روم` kept |

**Invariant:** for any fixed options,

`normalizePersian(normalizePersian(input, options), options) === normalizePersian(input, options)`.

### Usage

```ts
normalizePersian(text: string, options?: NormalizePersianOptions): string
```

### Output

Normalized string. When nothing changes, the original string reference is returned. Inputs are never mutated.

### Options

| Option                | Type                                   | Default      | Description                                                                                  |
| --------------------- | -------------------------------------- | ------------ | -------------------------------------------------------------------------------------------- |
| `digits`              | `'persian' \| 'english' \| 'preserve'` | `'preserve'` | Digit script conversion                                                                      |
| `removeDiacritics`    | `boolean`                              | `false`      | Strip Arabic combining marks (tashkeel / harakat), including hamza above in `هٔ`             |
| `normalizeWhitespace` | `boolean`                              | `false`      | Trim and collapse whitespace runs to a single ASCII space (`U+0020`). ZWNJ is not whitespace |

#### `digits`

| Value        | Behavior                                                  |
| ------------ | --------------------------------------------------------- |
| `'preserve'` | Leave English, Persian, and Arabic-Indic digits unchanged |
| `'persian'`  | Map English and Arabic-Indic → Persian (`۰–۹`)            |
| `'english'`  | Map Persian and Arabic-Indic → English (`0–9`)            |

### Edge cases

| Situation                                        | Behavior                                                               |
| ------------------------------------------------ | ---------------------------------------------------------------------- |
| Unrelated Arabic letters (`أ`, `إ`, `ؤ`, `ة`, …) | Left as-is                                                             |
| NBSP, BOM, emoji                                 | Opaque (not rewritten except as whitespace when `normalizeWhitespace`) |
| Whitespace-only + `normalizeWhitespace: true`    | `''`                                                                   |
| ZWNJ next to NBSP                                | Dropped as part of ZWNJ cleanup                                        |
| Latin text / punctuation                         | Unchanged                                                              |
| Search / stemming                                | Out of scope — use [`search.md`](./search.md)                          |

### Examples

```ts
normalizePersian('كي'); // 'کی'
normalizePersian('خانۀ ما'); // 'خانهٔ ما'

normalizePersian('1٢۳'); // '1٢۳' (digits preserved)
normalizePersian('1٢۳', { digits: 'persian' }); // '۱۲۳'
normalizePersian('1٢۳', { digits: 'english' }); // '123'

normalizePersian('كِتَابٌ'); // 'کِتَابٌ'
normalizePersian('كِتَابٌ', { removeDiacritics: true }); // 'کتاب'
normalizePersian('خانهٔ ما', { removeDiacritics: true }); // 'خانه ما'

normalizePersian('  سلام\t\tدنیا  '); // unchanged
normalizePersian('  سلام\t\tدنیا  ', { normalizeWhitespace: true }); // 'سلام دنیا'
```
