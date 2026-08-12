# RTL / text direction

Detect overall text direction from strong bidirectional characters. Digits, punctuation, whitespace, and formatting marks (including ZWNJ) are treated as **neutral**.

```ts
import {
  getTextDirection,
  isRTL,
  isMixedDirection,
} from '@persian-web/core/direction';
import type { TextDirection } from '@persian-web/core/direction';
```

```ts
type TextDirection = 'rtl' | 'ltr' | 'mixed' | 'neutral';
```

Strong RTL letters include Arabic-script ranges used by Persian and Hebrew letters. Strong LTR covers Latin letters (including common Latin Extended ranges).

This module does **not** implement the full Unicode Bidirectional Algorithm — it classifies strings for UI heuristics (for example choosing `dir` on a label).

---

## `getTextDirection`

### Description

Scans the string for strong directional characters and returns the overall classification.

### Usage

```ts
getTextDirection(text: string): TextDirection
```

### Output

| Value       | Meaning                                                     |
| ----------- | ----------------------------------------------------------- |
| `'rtl'`     | At least one RTL letter, no LTR letters                     |
| `'ltr'`     | At least one LTR letter, no RTL letters                     |
| `'mixed'`   | Both RTL and LTR strong letters present                     |
| `'neutral'` | No strong letters (empty, digits-only, punctuation-only, …) |

### Options

None.

### Edge cases

| Input              | Result                                           |
| ------------------ | ------------------------------------------------ |
| `''`               | `'neutral'`                                      |
| `'123'` / `'۲۵۰۰'` | `'neutral'` (digits are neutral)                 |
| `'سلام!'`          | `'rtl'` (punctuation ignored)                    |
| Hebrew letters     | Count as RTL                                     |
| Early exit         | Returns `'mixed'` as soon as both sides are seen |

### Examples

```ts
getTextDirection('سلام'); // 'rtl'
getTextDirection('Hello'); // 'ltr'
getTextDirection('Hello سلام'); // 'mixed'
getTextDirection('123'); // 'neutral'
getTextDirection(''); // 'neutral'
getTextDirection('قیمت: ۲۵۰۰'); // 'rtl'
```

---

## `isRTL`

### Description

Returns whether the text is **purely** right-to-left (strong RTL only).

### Usage

```ts
isRTL(text: string): boolean
```

### Output

`true` only when `getTextDirection(text) === 'rtl'`. Neutral and mixed strings return `false`.

### Options

None.

### Edge cases

| Input          | Result            |
| -------------- | ----------------- |
| `'سلام دنیا'`  | `true`            |
| `'Hello سلام'` | `false` (mixed)   |
| `'123'`        | `false` (neutral) |
| `''`           | `false`           |

### Examples

```ts
isRTL('سلام'); // true
isRTL('Hello سلام'); // false
isRTL('123'); // false
```

---

## `isMixedDirection`

### Description

Returns whether the text contains both RTL and LTR strong characters.

### Usage

```ts
isMixedDirection(text: string): boolean
```

### Output

`true` when `getTextDirection(text) === 'mixed'`.

### Options

None.

### Edge cases

Pure RTL, pure LTR, and neutral strings all return `false`.

### Examples

```ts
isMixedDirection('Hello سلام'); // true
isMixedDirection('سلام'); // false
isMixedDirection('Galaxy S24'); // false
isMixedDirection('123'); // false
```
