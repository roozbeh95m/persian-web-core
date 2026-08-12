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

## Typography

Conservative Persian display typography. Applies only deterministic, safe fixes — not grammar correction, spell checking, or NLP.

### `fixPersianTypography(text)`

```ts
import { fixPersianTypography } from '@persian-web/core';
// or: import { fixPersianTypography } from '@persian-web/core/typography';

fixPersianTypography('می رود'); // 'می\u200Cرود'
fixPersianTypography('سلام ، دنیا'); // 'سلام، دنیا'
fixPersianTypography('"کتاب"'); // '«کتاب»'
```

**Rules (applied in order)**

| Rule                        | Behavior                                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------------------------ |
| `zwnj-cleanup`              | Collapse consecutive ZWNJs; drop at edges and next to whitespace; keep meaningful joins like `می‌رود`. |
| `horizontal-space-collapse` | Collapse runs of 2+ spaces or NBSPs to one ASCII space (tabs and newlines preserved).                  |
| `guillemet-spacing`         | Remove space after `«` and before `»`.                                                                 |
| `parenthesis-spacing`       | Remove space after `(` and before `)`.                                                                 |
| `persian-straight-quotes`   | `"…"` → `«…»` when the inner segment is entirely Persian script with at least one letter.              |
| `verbal-prefix-zwnj`        | `می` / `نمی` / `بی` + space + Persian word (≥2 letters) → insert ZWNJ (e.g. `می رود` → `می‌رود`).      |
| `punctuation-space-before`  | Remove space before `،` `؛` `؟` `!`, and before `.` after a Persian letter.                            |
| `punctuation-space-after`   | Insert a space after `،` `؛` `؟` `!` when missing (except before `»`).                                 |

**Not changed (by design)**

| Input       | Why                                                                            |
| ----------- | ------------------------------------------------------------------------------ |
| `در شهر`    | `در` is not a closed-list verbal prefix.                                       |
| `هم کار`    | `هم` is not in the conservative prefix list.                                   |
| `"hello"`   | Latin-only quoted segments are left unchanged.                                 |
| `file .txt` | Space before `.` is kept when the preceding character is not a Persian letter. |

**Invariant:** `fixPersianTypography(fixPersianTypography(text)) === fixPersianTypography(text)`.

### Notes

- Inputs are never mutated. When nothing changes, the original string reference is returned.
- Grammar correction, spell checking, and open-ended rewriting are out of scope.

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

## National ID

Validate Iranian national IDs (کد ملی): ten-digit identifiers with a modulo-11 check digit.

### `isValidNationalId(value)`

Returns `true` when the input is a valid national ID, otherwise `false`.

```ts
import { isValidNationalId } from '@persian-web/core';
// or: import { isValidNationalId } from '@persian-web/core/national-id';

isValidNationalId('0123456789'); // true
isValidNationalId('0123456780'); // false
isValidNationalId('1111111111'); // false
isValidNationalId('۰۱۲۳۴۵۶۷۸۹'); // true (Persian digits)
```

### `validateNationalId(value)`

Returns a structured result with an explicit rejection reason when invalid.

```ts
import { validateNationalId } from '@persian-web/core';
// or: import { validateNationalId } from '@persian-web/core/national-id';

validateNationalId('0123456789');
// { valid: true }

validateNationalId('0123456780');
// { valid: false, reason: 'invalid_checksum' }

validateNationalId('123456789');
// { valid: false, reason: 'invalid_length' }

validateNationalId('012-345-6789');
// { valid: false, reason: 'invalid_format' }

validateNationalId('1111111111');
// { valid: false, reason: 'invalid_repeated_digits' }
```

#### Rejection reasons

| Reason                    | When it applies                                                               |
| ------------------------- | ----------------------------------------------------------------------------- |
| `invalid_length`          | Empty input or not exactly ten digits after trim and digit-script conversion. |
| `invalid_format`          | Non-digit characters remain (spaces, hyphens, letters, punctuation, etc.).    |
| `invalid_repeated_digits` | All ten digits are identical (for example `0000000000` or `5555555555`).      |
| `invalid_checksum`        | Ten digits with a failing check digit.                                        |

### Validation behavior

- **Digit scripts:** Persian (`۰–۹`) and Arabic-Indic (`٠–٩`) digits are converted to English before validation.
- **Whitespace:** Leading and trailing whitespace is trimmed. Internal separators are **not** removed.
- **Length:** Exactly ten digits are required.
- **Repeated digits:** Sequences where every digit is the same are rejected.
- **Check digit:** The tenth digit is validated with the standard Iranian weighted-sum modulo-11 algorithm applied to the first nine digits.

Inputs are never mutated. Unrelated characters are not normalized away.

## Sort

Persian-aware string sorting built on `Intl.Collator` with normalized sort keys for predictable ordering across Arabic/Persian variants and mixed digit scripts.

### `createPersianCollator(options?)`

Creates a reusable collator for pairwise string comparison.

```ts
import { createPersianCollator } from '@persian-web/core';
// or: import { createPersianCollator } from '@persian-web/core/sort';

const collator = createPersianCollator();

collator.compare('كلاسیک', 'کلاسیک'); // 0
collator.compare('item 2', 'item 10'); // < 0

['ب', 'ا', 'پ'].sort(collator.compare); // ['ا', 'ب', 'پ']
```

**Sort key normalization (always applied before `Intl.Collator`):**

| Aspect                  | Behavior                                                      |
| ----------------------- | ------------------------------------------------------------- |
| Arabic/Persian variants | Yeh/Kaf fixes via `normalizePersian`                          |
| Digits                  | English (`0–9`) when `normalizeDigits` is on (default)        |
| Latin case              | ASCII `A–Z` folded to lowercase in sort keys                  |
| Mixed Persian/Latin     | `Intl.Collator` with `fa-IR` locale                           |
| Numeric sequences       | Natural order when `numeric` is on (default)                  |
| Tie-breaking            | Variant sensitivity on normalized keys, then original strings |

### `sortPersian(items, options?)`

Sorts string arrays or object arrays via a typed `getKey` accessor.

```ts
import { sortPersian } from '@persian-web/core';
// or: import { sortPersian } from '@persian-web/core/sort';

sortPersian(['item 10', 'item 2']); // ['item 2', 'item 10']

sortPersian([{ title: 'گوشی سامسونگ' }, { title: 'آیفون' }], {
  getKey: (item) => item.title,
});

const list = ['ب', 'ا'];
sortPersian(list, { inPlace: true }); // mutates list in place
```

By default, `sortPersian` returns a **new array** and leaves the input unchanged. Pass `{ inPlace: true }` to sort the input array in place.

### Options

| Option            | Default   | Description                                                 |
| ----------------- | --------- | ----------------------------------------------------------- |
| `locale`          | `'fa-IR'` | BCP 47 locale for `Intl.Collator`                           |
| `numeric`         | `true`    | Natural numeric ordering (`2` before `10`)                  |
| `sensitivity`     | `'base'`  | Collation sensitivity (`'base'` folds Latin case)           |
| `normalizeDigits` | `true`    | Convert Persian/Arabic-Indic digits to English in sort keys |
| `direction`       | `'asc'`   | `'asc'` or `'desc'` (`sortPersian` only)                    |
| `getKey`          | identity  | Extract sort key from each item (`sortPersian` only)        |
| `inPlace`         | `false`   | Mutate the input array when `true` (`sortPersian` only)     |
| `collator`        | —         | Reuse a collator from `createPersianCollator`               |

Pass either `collator` **or** collation options to `sortPersian`, not both.

### Performance

| Operation                   | Cost                                                                     | Guidance                                                                        |
| --------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| `createPersianCollator()`   | One-time `Intl.Collator` construction                                    | Reuse the returned collator when sorting many arrays                            |
| `collator.compare(a, b)`    | O(m) per call — normalizes both strings, then compares                   | Best for occasional pairwise checks                                             |
| `sortPersian(array)`        | O(n log n) comparisons; each key normalized once (Schwartzian transform) | Default collator is cached across calls                                         |
| Large arrays (1k–10k items) | Dominated by comparison count and string length                          | Pass `{ collator }` to avoid option resolution; run `npm run benchmark` locally |

## Benchmarks

Reproducible Vitest microbenchmarks for hot paths (`toPersianDigits`,
`toEnglishDigits`, `normalizePersian`, `normalizeForSearch`, `formatNumber`,
`formatCurrency`, `sortPersian`). Fixtures are fixed; each case uses an
explicit iteration budget. Absolute timings vary by machine — compare ratios
and PR deltas on the same Node version.

```bash
npm run benchmark
```

## Date

Minimal Jalali (Persian / Solar Hijri) calendar helpers. Conversion uses the
[Borkowski algorithm](http://www.astro.uni.torun.pl/~kb/Papers/EMP/PersianC-EMP.htm)
(same family as [jalaali-js](https://github.com/jalaali/jalaali-js)). Formatting
is deterministic token-based — not delegated to `Intl`.

`Intl.DateTimeFormat` with `calendar: 'persian'` is fine for **display-only**
locale output, but it cannot convert Jalali → Gregorian, and `Date` input depends
on the active time zone. These helpers cover conversion and stable formatting.

### Time zone behavior

| Input                                   | Behavior                                     |
| --------------------------------------- | -------------------------------------------- |
| `toJalali(year, month, day)`            | Pure calendar math — no time zone            |
| `toGregorian(year, month, day)`         | Pure calendar math — no time zone            |
| `toJalali(date)` / `formatJalali(date)` | Civil date in the **local** time zone        |
| `…, { timeZone: 'UTC' }`                | Civil date read via `Intl` in that IANA zone |
| `formatJalali({ year, month, day })`    | Already Jalali — no time zone applied        |

### `toJalali(date | year, month?, day?, options?)`

```ts
import { toJalali } from '@persian-web/core';
// or: import { toJalali } from '@persian-web/core/date';

toJalali(2024, 3, 20);
// { year: 1403, month: 1, day: 1 }

toJalali(new Date('2024-03-20T00:00:00Z'), { timeZone: 'UTC' });
// { year: 1403, month: 1, day: 1 }
```

### `toGregorian(year, month, day)`

```ts
import { toGregorian } from '@persian-web/core';

toGregorian(1403, 1, 1);
// { year: 2024, month: 3, day: 20 }

toGregorian(1395, 12, 30);
// { year: 2017, month: 3, day: 20 } — leap-year Esfand
```

Throws `RangeError` for invalid dates (e.g. Esfand 30 in a common year).

### `formatJalali(date | { year, month, day }, options?)`

```ts
import { formatJalali } from '@persian-web/core';

formatJalali({ year: 1403, month: 1, day: 1 });
// '1403/01/01'

formatJalali(new Date('2024-03-20T00:00:00Z'), {
  timeZone: 'UTC',
  pattern: 'YYYY-MM-DD',
  digits: 'persian',
});
// '۱۴۰۳-۰۱-۰۱'
```

Supported pattern tokens: `YYYY`, `YY`, `MM`, `M`, `DD`, `D`.

### `relativeTime(date, options?)`

Formats how far a date is from a reference instant, in Persian, via
`Intl.RelativeTimeFormat`. Units are chosen automatically (seconds through
years). Past and future are both supported.

```ts
import { relativeTime } from '@persian-web/core';
// or: import { relativeTime } from '@persian-web/core/date';

const now = new Date('2024-06-15T12:00:00Z');

relativeTime(new Date('2024-06-15T11:57:00Z'), { now });
// '۳ دقیقه پیش'

relativeTime(new Date('2024-06-15T10:00:00Z'), { now });
// '۲ ساعت پیش'

relativeTime(new Date('2024-06-16T12:00:00Z'), { now });
// 'فردا'

relativeTime(new Date('2024-06-29T12:00:00Z'), { now });
// '۲ هفته بعد'
```

| Option    | Type                     | Default      | Notes                                                                   |
| --------- | ------------------------ | ------------ | ----------------------------------------------------------------------- |
| `digits`  | `'persian' \| 'english'` | `'persian'`  | Digit script after formatting                                           |
| `now`     | `Date`                   | `new Date()` | Reference instant (pin this in tests)                                   |
| `numeric` | `'auto' \| 'always'`     | `'auto'`     | `'auto'` allows phrases like `دیروز` / `فردا`; `'always'` stays numeric |

**Time zone:** comparison uses absolute instants (`Date#getTime`). Civil time
zones do not change the result. Invalid `date` or `options.now` throws
`RangeError`.

## Entry points

| Import                          | Exports                                                                                                                        |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `@persian-web/core`             | Full public API (digits + normalize + format + currency + phone + national-id + search + sort + typography + date + direction) |
| `@persian-web/core/digits`      | `toPersianDigits`, `toEnglishDigits`                                                                                           |
| `@persian-web/core/normalize`   | `normalizePersian`, `NormalizePersianOptions`, `DigitNormalization`                                                            |
| `@persian-web/core/typography`  | `fixPersianTypography`                                                                                                         |
| `@persian-web/core/search`      | `normalizeForSearch`, `includesPersian`, `matchesPersian`                                                                      |
| `@persian-web/core/sort`        | `createPersianCollator`, `sortPersian`, sort types                                                                             |
| `@persian-web/core/format`      | `formatNumber`, `FormatNumberOptions`, `FormatNumberDigits`, `FormatNumberNotation`                                            |
| `@persian-web/core/currency`    | `formatCurrency`, `formatToman`, `formatRial`, currency types                                                                  |
| `@persian-web/core/phone`       | `normalizePhone`, `isValidIranianPhone`, `formatIranianPhone`, phone types                                                     |
| `@persian-web/core/national-id` | `isValidNationalId`, `validateNationalId`, `NationalIdInvalidReason`, `ValidateNationalIdResult`                               |
| `@persian-web/core/date`        | `toJalali`, `toGregorian`, `formatJalali`, `relativeTime`, date types                                                          |
| `@persian-web/core/direction`   | `getTextDirection`, `isRTL`, `isMixedDirection`, `TextDirection`                                                               |

## License

MIT
