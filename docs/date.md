# Date

Minimal Jalali (Persian / Solar Hijri) calendar helpers plus Persian relative time.

Conversion uses the [Borkowski algorithm](http://www.astro.uni.torun.pl/~kb/Papers/EMP/PersianC-EMP.htm) (same family as [jalaali-js](https://github.com/jalaali/jalaali-js)). Formatting is deterministic token-based — not delegated to `Intl`.

```ts
import {
  toJalali,
  toGregorian,
  formatJalali,
  relativeTime,
} from '@persian-web/core/date';
import type {
  FormatJalaliDigits,
  FormatJalaliOptions,
  GregorianDate,
  JalaliDate,
  RelativeTimeDigits,
  RelativeTimeOptions,
  ToJalaliOptions,
} from '@persian-web/core/date';
```

### Time zone behavior

| Input                                   | Behavior                                                            |
| --------------------------------------- | ------------------------------------------------------------------- |
| `toJalali(year, month, day)`            | Pure calendar math — no time zone                                   |
| `toGregorian(year, month, day)`         | Pure calendar math — no time zone                                   |
| `toJalali(date)` / `formatJalali(date)` | Civil date in the **local** time zone                               |
| `…, { timeZone: 'UTC' }`                | Civil date via `Intl` in that IANA zone                             |
| `formatJalali({ year, month, day })`    | Already Jalali — no time zone applied                               |
| `relativeTime`                          | Absolute instants (`Date#getTime`); zone does not change the result |

Jalali years supported by the algorithm are roughly **−61…3177**.

---

## `toJalali`

### Description

Converts a Gregorian civil date or a `Date` to `{ year, month, day }` in the Jalali calendar.

### Usage

```ts
toJalali(date: Date, options?: ToJalaliOptions): JalaliDate
toJalali(year: number, month: number, day: number): JalaliDate
```

### Output

```ts
type JalaliDate = { year: number; month: number; day: number };
```

### Options

| Option     | Type     | Default    | Description                                                     |
| ---------- | -------- | ---------- | --------------------------------------------------------------- |
| `timeZone` | `string` | host local | IANA zone when input is a `Date` (ignored for numeric overload) |

### Edge cases

| Situation                 | Behavior                                          |
| ------------------------- | ------------------------------------------------- |
| Numeric overload          | Pure; ignores `timeZone`                          |
| `Date` without `timeZone` | Uses local `getFullYear` / `getMonth` / `getDate` |
| Month/day are 1-based     | Gregorian `2024, 3, 20` is March 20               |

### Examples

```ts
toJalali(2024, 3, 20);
// { year: 1403, month: 1, day: 1 }

toJalali(new Date('2024-03-20T00:00:00Z'), { timeZone: 'UTC' });
// { year: 1403, month: 1, day: 1 }
```

---

## `toGregorian`

### Description

Converts a Jalali civil date to Gregorian `{ year, month, day }`.

### Usage

```ts
toGregorian(year: number, month: number, day: number): GregorianDate
```

### Output

```ts
type GregorianDate = { year: number; month: number; day: number };
```

### Options

None.

### Edge cases

| Situation                                             | Behavior            |
| ----------------------------------------------------- | ------------------- |
| Invalid Jalali date (e.g. Esfand 30 in a common year) | Throws `RangeError` |
| Leap Esfand 30                                        | Valid in leap years |

### Examples

```ts
toGregorian(1403, 1, 1);
// { year: 2024, month: 3, day: 20 }

toGregorian(1395, 12, 30);
// { year: 2017, month: 3, day: 20 } — leap-year Esfand
```

---

## `formatJalali`

### Description

Formats a `Date` or Jalali date object with a simple token pattern.

Supported tokens: `YYYY`, `YY`, `MM`, `M`, `DD`, `D`.

### Usage

```ts
formatJalali(
  date: Date | JalaliDate,
  options?: FormatJalaliOptions,
): string
```

### Output

Pattern string with optional Persian digits.

### Options

| Option     | Type                     | Default        | Description                 |
| ---------- | ------------------------ | -------------- | --------------------------- |
| `pattern`  | `string`                 | `'YYYY/MM/DD'` | Output pattern              |
| `digits`   | `'english' \| 'persian'` | `'english'`    | Digit script                |
| `timeZone` | `string`                 | host local     | Only when input is a `Date` |

### Edge cases

| Situation                   | Behavior                                           |
| --------------------------- | -------------------------------------------------- |
| Jalali object input         | No time zone applied                               |
| Unknown pattern text        | Passed through as literal characters around tokens |
| `Date` near zone boundaries | Civil day depends on `timeZone` / local zone       |

### Examples

```ts
formatJalali({ year: 1403, month: 1, day: 1 });
// '1403/01/01'

formatJalali(new Date('2024-03-20T00:00:00Z'), {
  timeZone: 'UTC',
  pattern: 'YYYY-MM-DD',
  digits: 'persian',
});
// '۱۴۰۳-۰۱-۰۱'

formatJalali({ year: 1403, month: 1, day: 5 }, { pattern: 'D/M/YYYY' });
// '5/1/1403'
```

---

## `relativeTime`

### Description

Formats how far a date is from a reference instant, in Persian, via `Intl.RelativeTimeFormat` (`fa`). Units are chosen automatically (seconds through years). Past and future are both supported.

### Usage

```ts
relativeTime(date: Date, options?: RelativeTimeOptions): string
```

### Output

Persian relative-time string (for example `۳ دقیقه پیش`, `فردا`). Exact phrases depend on the runtime `Intl` data.

### Options

| Option    | Type                     | Default      | Description                                                |
| --------- | ------------------------ | ------------ | ---------------------------------------------------------- |
| `digits`  | `'persian' \| 'english'` | `'persian'`  | Digit script after formatting                              |
| `now`     | `Date`                   | `new Date()` | Reference instant (pin in tests)                           |
| `numeric` | `'always' \| 'auto'`     | `'auto'`     | `'auto'` allows `دیروز` / `فردا`; `'always'` stays numeric |

### Edge cases

| Situation                       | Behavior                                                                         |
| ------------------------------- | -------------------------------------------------------------------------------- |
| Invalid `date` or `options.now` | Throws `RangeError`                                                              |
| Time zones                      | Comparison is by absolute instant; civil zone does not change the result         |
| Exact wording                   | May vary slightly across `Intl` implementations — pin `now` and assert carefully |

### Examples

```ts
const now = new Date('2024-06-15T12:00:00Z');

relativeTime(new Date('2024-06-15T11:57:00Z'), { now });
// '۳ دقیقه پیش'

relativeTime(new Date('2024-06-15T10:00:00Z'), { now });
// '۲ ساعت پیش'

relativeTime(new Date('2024-06-16T12:00:00Z'), { now });
// 'فردا'

relativeTime(new Date('2024-06-29T12:00:00Z'), { now });
// '۲ هفته بعد'

relativeTime(new Date('2024-06-15T11:57:00Z'), { now, digits: 'english' });
// '3 دقیقه پیش'
```
