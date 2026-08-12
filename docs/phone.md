# Phone

Iranian **mobile** phone helpers: normalize to E.164, validate, and format for display.

Landlines, premium numbers, and non-Iranian international numbers are rejected (`null` / `false`).

```ts
import {
  normalizePhone,
  isValidIranianPhone,
  formatIranianPhone,
} from '@persian-web/core/phone';
import type {
  FormatIranianPhoneOptions,
  IranianPhoneDigits,
  IranianPhoneFormat,
} from '@persian-web/core/phone';
```

Accepted input shapes (after digit-script conversion and separator stripping):

- National with leading zero: `09121234567`
- Bare 10-digit: `9121234567`
- `+98…`, `0098…`, or 12-digit `98…`
- Persian / Arabic-Indic digits
- Separators: spaces, hyphens, dots, `()`, `/`, `_`

Operator pattern (national significant number):  
`9(?:0[1-9]|1\d|2[0-3]|3\d|4[01]|9\d)\d{7}`

---

## `normalizePhone`

### Description

Parses a valid Iranian mobile number into canonical E.164: `+989XXXXXXXXX`.

### Usage

```ts
normalizePhone(value: string): string | null
```

### Output

| Result    | Meaning                                 |
| --------- | --------------------------------------- |
| `'+989…'` | Valid mobile, canonical form            |
| `null`    | Invalid, landline, malformed, or non-IR |

### Options

None.

### Edge cases

| Input                                         | Result                                 |
| --------------------------------------------- | -------------------------------------- |
| `'۰۹۱۲۱۲۳۴۵۶۷'`                               | `'+989121234567'`                      |
| `'0912 123 4567'`, hyphens, dots, parentheses | Accepted if digits form a valid mobile |
| `'02112345678'` (landline)                    | `null`                                 |
| `'+14155552671'`                              | `null`                                 |
| Letters, `#`, multiple `+`                    | `null`                                 |
| Wrong length                                  | `null`                                 |
| Leading/trailing whitespace                   | Trimmed                                |

### Examples

```ts
normalizePhone('۰۹۱۲۱۲۳۴۵۶۷'); // '+989121234567'
normalizePhone('09121234567'); // '+989121234567'
normalizePhone('+98 912 123 4567'); // '+989121234567'
normalizePhone('00989121234567'); // '+989121234567'
normalizePhone('9121234567'); // '+989121234567'
normalizePhone('+14155552671'); // null
normalizePhone('02112345678'); // null
```

---

## `isValidIranianPhone`

### Description

Returns whether the string is a valid Iranian mobile number under the same parsing rules as `normalizePhone`.

### Usage

```ts
isValidIranianPhone(value: string): boolean
```

### Output

`true` if `normalizePhone(value) !== null`, otherwise `false`.

### Options

None.

### Edge cases

Same acceptance/rejection set as `normalizePhone`. Empty string and separator-only strings are `false`.

### Examples

```ts
isValidIranianPhone('09121234567'); // true
isValidIranianPhone('+989121234567'); // true
isValidIranianPhone('02112345678'); // false (landline)
isValidIranianPhone('+14155552671'); // false
isValidIranianPhone('0912abc1234567'); // false
```

---

## `formatIranianPhone`

### Description

Formats a valid Iranian mobile for display.

- **National:** `0912 123 4567` (4-3-4 grouping)
- **International:** `+98 912 123 4567` (3-3-4 after country code)

### Usage

```ts
formatIranianPhone(
  value: string,
  options?: FormatIranianPhoneOptions,
): string | null
```

### Output

Formatted string, or `null` when the input is not a valid Iranian mobile.

### Options

| Option   | Type                            | Default      | Description                |
| -------- | ------------------------------- | ------------ | -------------------------- |
| `format` | `'national' \| 'international'` | `'national'` | Display layout             |
| `digits` | `'persian' \| 'english'`        | `'english'`  | Digit script in the output |

### Edge cases

| Situation            | Behavior                                                                         |
| -------------------- | -------------------------------------------------------------------------------- |
| Invalid input        | `null`                                                                           |
| Persian input digits | Parsed; default output still English digits unless `digits: 'persian'`           |
| Round-trip           | `normalizePhone(formatIranianPhone(x)!) === normalizePhone(x)` for valid mobiles |

### Examples

```ts
formatIranianPhone('09121234567');
// '0912 123 4567'

formatIranianPhone('+989121234567', { format: 'international' });
// '+98 912 123 4567'

formatIranianPhone('۰۹۱۲۱۲۳۴۵۶۷', { digits: 'persian' });
// '۰۹۱۲ ۱۲۳ ۴۵۶۷'

formatIranianPhone('02112345678'); // null
```
