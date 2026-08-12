# Slug

URL-friendly slugs that **preserve Persian letters** (no Latin transliteration).

```ts
import { persianSlug } from '@persian-web/core/slug';
```

Processing pipeline:

1. `normalizePersian` with English digits, diacritics removed, whitespace normalized
2. ZWNJ (`U+200C`) → hyphen (e.g. `می‌رود` → `می-رود`)
3. ASCII Latin `A–Z` folded to lowercase
4. Spaces and unsafe punctuation → single hyphens between segments
5. Leading/trailing hyphens removed; runs collapsed

**Invariant:** `persianSlug(persianSlug(text)) === persianSlug(text)`.

---

## `persianSlug`

### Description

Converts free text into a hyphenated slug suitable for paths while keeping Persian script readable in the URL.

### Usage

```ts
persianSlug(text: string): string
```

### Output

Slug string, or `''` when nothing slug-safe remains (empty or punctuation-only input).

### Options

None.

### Edge cases

| Situation                     | Behavior                                                   |
| ----------------------------- | ---------------------------------------------------------- |
| Empty string                  | `''`                                                       |
| Punctuation-only              | `''`                                                       |
| Persian digits in input       | Become English digits in the slug                          |
| ZWNJ compounds                | Hyphenated, not joined                                     |
| Multiple spaces / punctuation | Single hyphen between segments                             |
| No leading/trailing `--`      | Leading/trailing hyphens stripped; internal runs collapsed |
| Latin words                   | Lowercased ASCII only                                      |

### Examples

```ts
persianSlug('گوشی سامسونگ گلکسی S25');
// 'گوشی-سامسونگ-گلکسی-s25'

persianSlug('  قیمت: ۲۵۰۰  ');
// 'قیمت-2500'

persianSlug('می‌رود');
// 'می-رود'

persianSlug('كلاسیک --- ویژه!');
// 'کلاسیک-ویژه'

persianSlug('!!!');
// ''

persianSlug('');
// ''
```
