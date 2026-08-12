# Validation

Iranian national ID (کد ملی) validation: ten-digit identifiers with a modulo-11 check digit.

```ts
import {
  isValidNationalId,
  validateNationalId,
} from '@persian-web/core/national-id';
import type {
  NationalIdInvalidReason,
  ValidateNationalIdResult,
} from '@persian-web/core/national-id';
```

---

## `isValidNationalId`

### Description

Returns whether the input is a valid Iranian national ID after trim and digit-script conversion.

### Usage

```ts
isValidNationalId(value: string): boolean
```

### Output

`true` when valid; `false` otherwise (no reason payload — use `validateNationalId` for that).

### Options

None.

### Edge cases

Same rules as `validateNationalId` (length, format, repeated digits, checksum). Separators are **not** stripped.

### Examples

```ts
isValidNationalId('0123456789'); // true
isValidNationalId('0123456780'); // false
isValidNationalId('1111111111'); // false
isValidNationalId('۰۱۲۳۴۵۶۷۸۹'); // true (Persian digits)
```

---

## `validateNationalId`

### Description

Validates an Iranian national ID and returns a structured result with an explicit rejection reason when invalid.

Processing order:

1. Trim leading/trailing whitespace
2. Convert Persian / Arabic-Indic digits to English
3. Require digits-only, length 10
4. Reject all-identical digits
5. Verify modulo-11 check digit on the first nine digits

### Usage

```ts
validateNationalId(value: string): ValidateNationalIdResult
```

### Output

```ts
type ValidateNationalIdResult =
  { valid: true } | { valid: false; reason: NationalIdInvalidReason };
```

| Reason                    | When                                                           |
| ------------------------- | -------------------------------------------------------------- |
| `invalid_length`          | Empty, or not exactly ten digits after trim + digit conversion |
| `invalid_format`          | Non-digit characters remain (spaces, hyphens, letters, …)      |
| `invalid_repeated_digits` | All ten digits identical (`0000000000`, `5555555555`, …)       |
| `invalid_checksum`        | Failing check digit                                            |

### Options

None.

### Edge cases

| Situation                   | Behavior                               |
| --------------------------- | -------------------------------------- |
| `'012-345-6789'`            | `invalid_format` (hyphens not removed) |
| Internal spaces             | `invalid_format`                       |
| Persian digits of length 10 | Converted, then validated              |
| Leading/trailing spaces     | Trimmed                                |
| Inputs never mutated        | Callers keep their original string     |

### Examples

```ts
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

validateNationalId('  ۰۱۲۳۴۵۶۷۸۹  ');
// { valid: true }
```
