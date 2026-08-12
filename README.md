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

## Format

Locale-aware number formatting powered by native `Intl.NumberFormat`, with optional Persian digit output.

### `formatNumber(value, options?)`

```ts
import { formatNumber } from '@persian-web/core';
// or: import { formatNumber } from '@persian-web/core/format';

formatNumber(1234567);
// '1,234,567'

formatNumber(1234567, { locale: 'fa-IR' });
// '۱٬۲۳۴٬۵۶۷'

formatNumber(-1234.5, { locale: 'fa-IR', precision: 2 });
// '‎−۱٬۲۳۴٫۵۰'

formatNumber(1_200_000, { notation: 'compact' });
// '1.2M'

formatNumber(1_200_000, { locale: 'fa-IR', notation: 'compact' });
// '۱٫۲ میلیون'
```

#### Non-finite values

`NaN` and `±Infinity` are formatted explicitly through `Intl.NumberFormat` so labels stay locale-aware. Grouping, precision, and compact options are ignored for these values.

| Value       | `en-US` | `fa-IR` |
| ----------- | ------- | ------- |
| `NaN`       | `NaN`   | `ناعدد` |
| `Infinity`  | `∞`     | `∞`     |
| `-Infinity` | `-∞`    | `‎−∞`   |

### Options

| Option                  | Type                      | Default        | Description                                               |
| ----------------------- | ------------------------- | -------------- | --------------------------------------------------------- |
| `locale`                | `string`                  | `'en-US'`      | BCP 47 locale (`'fa-IR'` for Persian separators).         |
| `digits`                | `'persian' \| 'english'`  | locale default | Override digit script after formatting.                   |
| `useGrouping`           | `boolean`                 | `true`         | Thousands / grouping separators (standard notation only). |
| `precision`             | `number`                  | —              | Fixed decimal places; overrides min/max fraction digits.  |
| `minimumFractionDigits` | `number`                  | —              | Minimum digits after the decimal separator.               |
| `maximumFractionDigits` | `number`                  | —              | Maximum digits after the decimal separator.               |
| `notation`              | `'standard' \| 'compact'` | `'standard'`   | Full numeral or compact form (`1.2M`, `۱٫۲ میلیون`).      |
| `compactDisplay`        | `'short' \| 'long'`       | `'short'`      | Wording for compact notation.                             |

```ts
formatNumber(1234567, { useGrouping: false }); // '1234567'
formatNumber(1.2345, { precision: 2 }); // '1.23'
formatNumber(1234567, { locale: 'fa-IR', digits: 'english' }); // '1٬234٬567'
formatNumber(987, { notation: 'compact' }); // '987'
```

### Notes

- Accepts `number` only. `NaN` and `±Infinity` are supported and documented above.
- Uses native `Intl.NumberFormat`; no extra runtime dependencies.
- Inputs are never mutated.

## Currency

Locale-aware currency formatting for Iranian rials/tomans and common foreign currencies.

### `formatCurrency(value, options)`

```ts
import { formatCurrency } from '@persian-web/core';
// or: import { formatCurrency } from '@persian-web/core/currency';

formatCurrency(1_250_000, { currency: 'IRT' });
// '‎تومان ۱٬۲۵۰٬۰۰۰'

formatCurrency(12_500_000, { currency: 'IRR' });
// '‎ریال ۱۲٬۵۰۰٬۰۰۰'

formatCurrency(12.5, { currency: 'USD', locale: 'en-US' });
// '$12.50'
```

### `formatToman(value, options?)`

Shorthand for `formatCurrency(value, { ...options, currency: 'IRT' })`. The amount is in **tomans**.

```ts
formatToman(1_250_000);
// '‎تومان ۱٬۲۵۰٬۰۰۰'
```

### `formatRial(value, options?)`

Shorthand for `formatCurrency(value, { ...options, currency: 'IRR' })`. The amount is in **rials**.

```ts
formatRial(12_500_000);
// '‎ریال ۱۲٬۵۰۰٬۰۰۰'
```

### Supported currencies

| Code  | Unit   | Notes                                                                           |
| ----- | ------ | ------------------------------------------------------------------------------- |
| `IRR` | Rial   | Official Iranian currency; formatted with native `Intl`.                        |
| `IRT` | Toman  | Common display unit (not ISO 4217); formatted manually to mirror `Intl` layout. |
| `USD` | Dollar | Two decimal places by default.                                                  |
| `EUR` | Euro   | Two decimal places by default.                                                  |

**No automatic conversion** between `IRR` and `IRT`. The numeric value is always in the selected unit:

| Input        | Code  | Meaning                                                        |
| ------------ | ----- | -------------------------------------------------------------- |
| `1_250_000`  | `IRT` | 1,250,000 tomans                                               |
| `12_500_000` | `IRR` | 12,500,000 rials (equivalent display magnitude, not converted) |

### Defaults

| Option            | Default                                      |
| ----------------- | -------------------------------------------- |
| `locale`          | `'fa-IR'`                                    |
| `currencyDisplay` | `'symbol'`                                   |
| fraction digits   | `0` for `IRR` / `IRT`, `2` for `USD` / `EUR` |
| `digits`          | locale script (no conversion)                |

### Options

| Option                  | Type                                             | Description                              |
| ----------------------- | ------------------------------------------------ | ---------------------------------------- |
| `currency`              | `'IRR' \| 'IRT' \| 'USD' \| 'EUR'`               | Required for `formatCurrency`.           |
| `locale`                | `string`                                         | BCP 47 locale tag.                       |
| `digits`                | `'persian' \| 'english'`                         | Override digit script after formatting.  |
| `precision`             | `number`                                         | Fixed decimal places; overrides min/max. |
| `minimumFractionDigits` | `number`                                         | Minimum digits after decimal separator.  |
| `maximumFractionDigits` | `number`                                         | Maximum digits after decimal separator.  |
| `currencyDisplay`       | `'symbol' \| 'narrowSymbol' \| 'code' \| 'name'` | Currency label style.                    |

For `IRT`, `'symbol'` shows `تومان` (`fa-IR`) or `IRT` (`en-US`). `'name'` puts the label after the amount (`۱٬۲۵۰٬۰۰۰ تومان`).

### Non-finite values

`NaN` and `±Infinity` use locale-aware labels for `IRR` / `USD` / `EUR` via `Intl` (including currency symbols where the runtime supplies them, for example `$∞` or `‎ریالناعدد`). Fraction-digit options are ignored. For `IRT`, the locale-aware label is wrapped with the same prefix/suffix layout as finite amounts (for example `‎تومان ناعدد`).

### Notes

- Accepts `number` only. Inputs are never mutated.
- Uses native `Intl.NumberFormat` for `IRR`, `USD`, and `EUR`; `IRT` is formatted manually.
- Negative values use locale-appropriate minus signs (`-` in `en-US`, `‎−` in `fa-IR`).

## Entry points

| Import                        | Exports                                                                             |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| `@persian-web/core`           | Full public API (digits + normalize + format + currency)                            |
| `@persian-web/core/digits`    | `toPersianDigits`, `toEnglishDigits`                                                |
| `@persian-web/core/normalize` | `normalizePersian`, `NormalizePersianOptions`, `DigitNormalization`                 |
| `@persian-web/core/format`    | `formatNumber`, `FormatNumberOptions`, `FormatNumberDigits`, `FormatNumberNotation` |
| `@persian-web/core/currency`  | `formatCurrency`, `formatToman`, `formatRial`, currency types                       |

## License

MIT
