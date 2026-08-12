# @persian-web/core

Core Persian web utilities. Dependency-free TypeScript helpers for Persian text and numbers.

## Install

```bash
npm install @persian-web/core
```

## Digits

Convert between English, Persian, and Arabic-Indic digit forms.

| Script       | Digits       |
| ------------ | ------------ |
| English      | `0123456789` |
| Persian      | `۰۱۲۳۴۵۶۷۸۹` |
| Arabic-Indic | `٠١٢٣٤٥٦٧٨٩` |

### `toPersianDigits(value)`

Converts English and Arabic-Indic digits to Persian. Non-digit characters stay unchanged.

```ts
import { toPersianDigits } from '@persian-web/core';
// or: import { toPersianDigits } from '@persian-web/core/digits';

toPersianDigits('123'); // '۱۲۳'
toPersianDigits('٠١٢'); // '۰۱۲'
toPersianDigits('قیمت: 2500 تومان'); // 'قیمت: ۲۵۰۰ تومان'
toPersianDigits(-42.5); // '-۴۲.۵'
toPersianDigits(''); // ''
```

### `toEnglishDigits(value)`

Converts Persian and Arabic-Indic digits to English. Non-digit characters stay unchanged.

```ts
import { toEnglishDigits } from '@persian-web/core';
// or: import { toEnglishDigits } from '@persian-web/core/digits';

toEnglishDigits('۱۲۳'); // '123'
toEnglishDigits('٠١٢'); // '012'
toEnglishDigits('قیمت: ۲۵۰۰ تومان'); // 'قیمت: 2500 تومان'
toEnglishDigits(-42.5); // '-42.5'
toEnglishDigits(''); // ''
```

### Notes

- Accepts `string` or `number`. Numbers are stringified first; sign and decimal point are preserved.
- Inputs are never mutated. When no digit conversion is needed, the original string is returned.
- Only digit code points are mapped; punctuation, letters, and whitespace are left as-is.

## Normalize

Stabilize Persian orthography without surprising edits. Always fixes Yeh/Kaf variants and cleans ZWNJ; digit, diacritic, and whitespace behavior are opt-in.

### `normalizePersian(text, options?)`

```ts
import { normalizePersian } from '@persian-web/core';
// or: import { normalizePersian } from '@persian-web/core/normalize';

normalizePersian('كي'); // 'کی'
normalizePersian('خانۀ ما'); // 'خانهٔ ما'
normalizePersian('١٢٣', { digits: 'persian' }); // '۱۲۳'
normalizePersian('مِنْ', { removeDiacritics: true }); // 'من'
normalizePersian('  سلام   دنیا  ', { normalizeWhitespace: true }); // 'سلام دنیا'
```

**Always applied**

| Input                            | Result                                                     |
| -------------------------------- | ---------------------------------------------------------- |
| Arabic Yeh `ي` (U+064A)          | Persian Yeh `ی` (U+06CC)                                   |
| Alef Maksura `ى` (U+0649)        | Persian Yeh `ی` (U+06CC)                                   |
| Arabic Kaf `ك` (U+0643)          | Persian Kaf `ک` (U+06A9)                                   |
| Heh with Yeh above `ۀ` (U+06C0)  | `هٔ` (heh + hamza above), or `ه` if diacritics are removed |
| ZWNJ runs / edge / next to space | collapsed or dropped; meaningful joins like `می‌روم` kept  |

**Invariant:** for any fixed options,
`normalizePersian(normalizePersian(input, options), options) === normalizePersian(input, options)`.

### Options

All options default to preserving content beyond the always-applied character/ZWNJ rules.

#### `digits?: 'persian' | 'english' | 'preserve'`

Controls digit script conversion. Default: `'preserve'`.

| Value        | Behavior                                                             |
| ------------ | -------------------------------------------------------------------- |
| `'preserve'` | Leave English, Persian, and Arabic-Indic digits unchanged (default). |
| `'persian'`  | Map English and Arabic-Indic digits to Persian (`۰–۹`).              |
| `'english'`  | Map Persian and Arabic-Indic digits to English (`0–9`).              |

```ts
normalizePersian('1٢۳'); // '1٢۳'
normalizePersian('1٢۳', { digits: 'persian' }); // '۱۲۳'
normalizePersian('1٢۳', { digits: 'english' }); // '123'
```

#### `removeDiacritics?: boolean`

When `true`, strip Arabic combining marks (tashkeel / harakat), including the hamza above in `هٔ`. Base letters remain. Default: `false`.

```ts
normalizePersian('كِتَابٌ'); // 'کِتَابٌ'
normalizePersian('كِتَابٌ', { removeDiacritics: true }); // 'کتاب'
normalizePersian('خانهٔ ما', { removeDiacritics: true }); // 'خانه ما'
```

#### `normalizeWhitespace?: boolean`

When `true`, trim the string and collapse every internal run of whitespace (spaces, tabs, newlines, NBSP, etc.) to a single ASCII space (`U+0020`). ZWNJ is not treated as whitespace. Default: `false`.

```ts
normalizePersian('  سلام\t\tدنیا  '); // unchanged
normalizePersian('  سلام\t\tدنیا  ', { normalizeWhitespace: true }); // 'سلام دنیا'
```

### Notes

- Punctuation, Latin text, and unrelated Arabic letters (for example `أ`, `إ`, `ؤ`, `ة`) are left as-is.
- Inputs are never mutated. When nothing changes, the original string reference is returned.
- Search / stemming / tokenizing are out of scope for this module.

## Entry points

| Import                        | Exports                                                             |
| ----------------------------- | ------------------------------------------------------------------- |
| `@persian-web/core`           | Full public API (digits + normalize)                                |
| `@persian-web/core/digits`    | `toPersianDigits`, `toEnglishDigits`                                |
| `@persian-web/core/normalize` | `normalizePersian`, `NormalizePersianOptions`, `DigitNormalization` |

## License

MIT
