# Numbers

Locale-aware number formatting via native `Intl.NumberFormat`, with optional Persian digit output.

```ts
import { formatNumber } from '@persian-web/core/format';
import type {
  FormatNumberDigits,
  FormatNumberNotation,
  FormatNumberOptions,
} from '@persian-web/core/format';
```

---

## `formatNumber`

### Description

Formats a finite or non-finite `number` for display. Uses a cached `Intl.NumberFormat` instance. After locale formatting, you may force Persian or English digits with `digits`.

### Usage

```ts
formatNumber(value: number, options?: FormatNumberOptions): string
```

### Output

Locale-formatted string. Separators, compact suffixes, and default digit script come from `locale` unless `digits` overrides the script.

### Options

| Option                  | Type                      | Default        | Description                                                |
| ----------------------- | ------------------------- | -------------- | ---------------------------------------------------------- |
| `locale`                | `string`                  | `'en-US'`      | BCP 47 locale (`'fa-IR'` for Persian separators `٬` / `٫`) |
| `digits`                | `'persian' \| 'english'`  | locale default | Override digit script after formatting                     |
| `useGrouping`           | `boolean`                 | `true`         | Thousands / grouping separators (standard notation only)   |
| `precision`             | `number`                  | —              | Fixed decimal places; overrides min/max                    |
| `minimumFractionDigits` | `number`                  | —              | Minimum fraction digits                                    |
| `maximumFractionDigits` | `number`                  | —              | Maximum fraction digits                                    |
| `notation`              | `'standard' \| 'compact'` | `'standard'`   | Full or compact form                                       |
| `compactDisplay`        | `'short' \| 'long'`       | `'short'`      | Compact wording                                            |

### Edge cases

| Situation                                                 | Behavior                                                                                                   |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `NaN` / `±Infinity`                                       | Formatted through `Intl` so labels stay locale-aware; grouping, precision, and compact options are ignored |
| `NaN` in `fa-IR`                                          | `ناعدد`                                                                                                    |
| `Infinity`                                                | `∞` (locale may add marks)                                                                                 |
| Invalid `minimumFractionDigits` > `maximumFractionDigits` | May throw `RangeError` from `Intl`                                                                         |
| Accepts `number` only                                     | Strings must be converted by the caller                                                                    |

Non-finite examples:

| Value       | `en-US` | `fa-IR` |
| ----------- | ------- | ------- |
| `NaN`       | `NaN`   | `ناعدد` |
| `Infinity`  | `∞`     | `∞`     |
| `-Infinity` | `-∞`    | `‎−∞`   |

### Examples

```ts
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

formatNumber(1234567, { useGrouping: false }); // '1234567'
formatNumber(1.2345, { precision: 2 }); // '1.23'
formatNumber(1234567, { locale: 'fa-IR', digits: 'english' }); // '1٬234٬567'
```
