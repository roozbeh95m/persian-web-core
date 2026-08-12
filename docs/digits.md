# Digits

Convert between English, Persian, and Arabic-Indic digit scripts. Non-digit characters are left unchanged.

| Script       | Digits       |
| ------------ | ------------ |
| English      | `0123456789` |
| Persian      | `۰۱۲۳۴۵۶۷۸۹` |
| Arabic-Indic | `٠١٢٣٤٥٦٧٨٩` |

```ts
import { toPersianDigits, toEnglishDigits } from '@persian-web/core/digits';
// or from '@persian-web/core'
```

---

## `toPersianDigits`

### Description

Maps English (`0–9`) and Arabic-Indic (`٠–٩`) digits to Persian (`۰–۹`). Persian digits are left as-is. Letters, punctuation, whitespace, and signs are unchanged.

### Usage

```ts
toPersianDigits(value: string | number): string
```

### Output

A string with Persian digits. When no conversion is needed, the **original string reference** is returned. Numbers are stringified first (`String(value)`), so sign, decimal point, and exponent notation are preserved as characters.

### Options

None.

### Edge cases

| Input                       | Result                          | Notes                                       |
| --------------------------- | ------------------------------- | ------------------------------------------- |
| `''`                        | `''`                            | Empty stays empty                           |
| Already Persian digits      | Same string reference           | No allocation                               |
| Mixed scripts in one string | Each digit mapped independently | `'1٢۳'` → `'۱۲۳'`                           |
| Negatives / decimals        | Sign and `.` kept               | `-42.5` → `'-۴۲.۵'`                         |
| Non-digit text              | Unchanged                       | `'قیمت: 2500 تومان'` → `'قیمت: ۲۵۰۰ تومان'` |

### Examples

```ts
toPersianDigits('123'); // '۱۲۳'
toPersianDigits('٠١٢'); // '۰۱۲'
toPersianDigits('قیمت: 2500 تومان'); // 'قیمت: ۲۵۰۰ تومان'
toPersianDigits(-42.5); // '-۴۲.۵'
toPersianDigits(''); // ''
```

---

## `toEnglishDigits`

### Description

Maps Persian (`۰–۹`) and Arabic-Indic (`٠–٩`) digits to English (`0–9`). English digits are left as-is. Non-digit characters are unchanged.

### Usage

```ts
toEnglishDigits(value: string | number): string
```

### Output

A string with English digits. Identity return when nothing changes. Numbers are stringified first.

### Options

None.

### Edge cases

| Input                           | Result                                    | Notes               |
| ------------------------------- | ----------------------------------------- | ------------------- |
| `''`                            | `''`                                      | Empty stays empty   |
| Already English digits          | Same string reference                     | No allocation       |
| Mixed scripts                   | Each digit mapped                         | `'۱2٣'` → `'123'`   |
| Form inputs with Persian digits | Safe for numeric parsers after conversion | `'۲۵۰۰'` → `'2500'` |

### Examples

```ts
toEnglishDigits('۱۲۳'); // '123'
toEnglishDigits('٠١٢'); // '012'
toEnglishDigits('قیمت: ۲۵۰۰ تومان'); // 'قیمت: 2500 تومان'
toEnglishDigits(-42.5); // '-42.5'
toEnglishDigits(''); // ''
```
