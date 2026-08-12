# Currency

Locale-aware currency formatting for Iranian rials/tomans and common foreign currencies.

```ts
import {
  formatCurrency,
  formatToman,
  formatRial,
} from '@persian-web/core/currency';
import type {
  Currency,
  CurrencyDigits,
  CurrencyDisplay,
  FormatCurrencyOptions,
  FormatCurrencyOptionsWithCurrency,
} from '@persian-web/core/currency';
```

**No automatic conversion** between `IRR` and `IRT`. The numeric value is always in the selected unit.

---

## `formatCurrency`

### Description

Formats a monetary amount with a required currency code. `IRR`, `USD`, and `EUR` use native `Intl.NumberFormat`. `IRT` (toman) is not an ISO 4217 code and is formatted manually to mirror the same layout modes.

### Usage

```ts
formatCurrency(
  value: number,
  options: FormatCurrencyOptionsWithCurrency,
): string
```

### Output

Locale-formatted currency string. Default locale is `'fa-IR'`. Default fraction digits: `0` for `IRR` / `IRT`, `2` for `USD` / `EUR`.

### Options

| Option                  | Type                                             | Default          | Description                       |
| ----------------------- | ------------------------------------------------ | ---------------- | --------------------------------- |
| `currency`              | `'IRR' \| 'IRT' \| 'USD' \| 'EUR'`               | —                | **Required**                      |
| `locale`                | `string`                                         | `'fa-IR'`        | BCP 47 locale                     |
| `digits`                | `'persian' \| 'english'`                         | locale default   | Digit script override             |
| `precision`             | `number`                                         | —                | Fixed decimals; overrides min/max |
| `minimumFractionDigits` | `number`                                         | currency default | Min fraction digits               |
| `maximumFractionDigits` | `number`                                         | currency default | Max fraction digits               |
| `currencyDisplay`       | `'symbol' \| 'narrowSymbol' \| 'code' \| 'name'` | `'symbol'`       | Unit label style                  |

#### Supported currencies

| Code  | Unit   | Notes                                    |
| ----- | ------ | ---------------------------------------- |
| `IRR` | Rial   | Official Iranian currency; native `Intl` |
| `IRT` | Toman  | Common display unit; manual formatting   |
| `USD` | Dollar | Two decimals by default                  |
| `EUR` | Euro   | Two decimals by default                  |

#### `IRT` display modes

| `currencyDisplay`             | `fa-IR`               | `en-US`              |
| ----------------------------- | --------------------- | -------------------- |
| `'symbol'` / `'narrowSymbol'` | `تومان` before amount | `IRT` before amount  |
| `'code'`                      | `IRT` before amount   | `IRT` before amount  |
| `'name'`                      | amount then `تومان`   | amount then `tomans` |

### Edge cases

| Situation                       | Behavior                                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------------------- |
| IRR vs IRT                      | Same number means different units — no ×10 conversion                                                   |
| Non-finite values               | Locale-aware labels; fraction options ignored. `IRT` wraps the label with the same prefix/suffix layout |
| Invalid min/max fraction digits | May throw `RangeError` via `Intl`                                                                       |
| Negative values                 | Locale-appropriate minus (`-` in `en-US`, `‎−` in `fa-IR`)                                              |

### Examples

```ts
formatCurrency(1_250_000, { currency: 'IRT' });
// '‎تومان ۱٬۲۵۰٬۰۰۰'

formatCurrency(12_500_000, { currency: 'IRR' });
// '‎ریال ۱۲٬۵۰۰٬۰۰۰'

formatCurrency(12.5, { currency: 'USD', locale: 'en-US' });
// '$12.50'

formatCurrency(1_250_000, { currency: 'IRT', currencyDisplay: 'name' });
// '۱٬۲۵۰٬۰۰۰ تومان'
```

---

## `formatToman`

### Description

Shorthand for `formatCurrency(value, { ...options, currency: 'IRT' })`. The amount is in **tomans**.

### Usage

```ts
formatToman(value: number, options?: FormatCurrencyOptions): string
```

### Output

Same as `formatCurrency` with `currency: 'IRT'`.

### Options

Same as `formatCurrency`, except `currency` is fixed to `'IRT'` (passing `currency` in options is overwritten).

### Edge cases

Same non-finite and fraction-digit behavior as `formatCurrency` for `IRT`.

### Examples

```ts
formatToman(1_250_000);
// '‎تومان ۱٬۲۵۰٬۰۰۰'

formatToman(1_250_000, { digits: 'english' });
// '‎تومان 1٬250٬000'  (fa-IR separators, English digits)
```

---

## `formatRial`

### Description

Shorthand for `formatCurrency(value, { ...options, currency: 'IRR' })`. The amount is in **rials**.

### Usage

```ts
formatRial(value: number, options?: FormatCurrencyOptions): string
```

### Output

Same as `formatCurrency` with `currency: 'IRR'`.

### Options

Same as `formatCurrency`, except `currency` is fixed to `'IRR'`.

### Edge cases

Same as `formatCurrency` for `IRR`. Does **not** convert from tomans.

### Examples

```ts
formatRial(12_500_000);
// '‎ریال ۱۲٬۵۰۰٬۰۰۰'
```
