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

## Entry points

| Import                     | Exports                              |
| -------------------------- | ------------------------------------ |
| `@persian-web/core`        | Full public API (currently digits)   |
| `@persian-web/core/digits` | `toPersianDigits`, `toEnglishDigits` |

## License

MIT
