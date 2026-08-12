# Typography

Conservative Persian **display** typography. Applies deterministic, safe fixes — not grammar correction, spell-checking, or NLP.

```ts
import { fixPersianTypography } from '@persian-web/core/typography';
```

**Invariant:** `fixPersianTypography(fixPersianTypography(text)) === fixPersianTypography(text)`.

---

## `fixPersianTypography`

### Description

Runs a fixed pipeline of display fixes in order:

| Rule                        | Behavior                                                                                              |
| --------------------------- | ----------------------------------------------------------------------------------------------------- |
| `zwnj-cleanup`              | Collapse consecutive ZWNJs; drop at edges and next to whitespace; keep meaningful joins like `می‌رود` |
| `horizontal-space-collapse` | Collapse runs of 2+ spaces or NBSPs to one ASCII space (tabs and newlines preserved)                  |
| `guillemet-spacing`         | Remove space after `«` and before `»`                                                                 |
| `parenthesis-spacing`       | Remove space after `(` and before `)`                                                                 |
| `persian-straight-quotes`   | `"…"` → `«…»` when the inner segment is entirely Persian script with at least one letter              |
| `verbal-prefix-zwnj`        | `می` / `نمی` / `بی` + space + Persian word (≥2 letters) → insert ZWNJ                                 |
| `punctuation-space-before`  | Remove space before `،` `؛` `؟` `!`, and before `.` after a Persian letter                            |
| `punctuation-space-after`   | Insert a space after `،` `؛` `؟` `!` when missing (except before `»`)                                 |

### Usage

```ts
fixPersianTypography(text: string): string
```

### Output

Typography-fixed string. When nothing changes, the original string reference is returned.

### Options

None.

### Edge cases

| Input                    | Why unchanged / special                                       |
| ------------------------ | ------------------------------------------------------------- |
| `در شهر`                 | `در` is not a closed-list verbal prefix                       |
| `هم کار`                 | `هم` is not in the conservative prefix list                   |
| `"hello"`                | Latin-only quoted segments stay as ASCII quotes               |
| `file .txt`              | Space before `.` kept when preceding char is not Persian      |
| Single letter after `می` | Prefix ZWNJ rule requires ≥2 Persian letters                  |
| Tabs / newlines          | Preserved (only horizontal space runs of space/NBSP collapse) |
| Empty string             | Identity                                                      |

### Examples

```ts
fixPersianTypography('می رود'); // 'می‌رود'
fixPersianTypography('سلام ، دنیا'); // 'سلام، دنیا'
fixPersianTypography('"کتاب"'); // '«کتاب»'
fixPersianTypography('نمی خواهم'); // 'نمی‌خواهم'
fixPersianTypography('« کتاب »'); // '«کتاب»'
```
