# @persian-web/core

[![npm version](https://img.shields.io/npm/v/@persian-web/core.svg)](https://www.npmjs.com/package/@persian-web/core)
[![npm downloads](https://img.shields.io/npm/dm/@persian-web/core.svg)](https://www.npmjs.com/package/@persian-web/core)
[![CI](https://github.com/roozbeh95m/persian-web-core/actions/workflows/ci.yml/badge.svg)](https://github.com/roozbeh95m/persian-web-core/actions/workflows/ci.yml)
[![GitHub stars](https://img.shields.io/github/stars/roozbeh95m/persian-web-core.svg)](https://github.com/roozbeh95m/persian-web-core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-0B6B56?logo=github)](https://roozbeh95m.github.io/persian-web-core/)

**Modern JavaScript & TypeScript utilities for Persian, Farsi, and RTL web applications.**

Dependency-free toolkit for Jalali calendar dates, Persian digits and number formatting, RTL heuristics, typography, localization helpers, and Iranian form validation — without pulling in a full i18n framework.

Use it in frontend apps, Node services, and Iranian web workflows that mix Latin and Persian text.

### 🔗 Live Demo

**Try the interactive docs & playground:**  
**[https://roozbeh95m.github.io/persian-web-core/](https://roozbeh95m.github.io/persian-web-core/)**

API reference, executable examples, and live playgrounds for every public module.

| Resource      | Link                                                                          |
| ------------- | ----------------------------------------------------------------------------- |
| Live Demo     | [GitHub Pages](https://roozbeh95m.github.io/persian-web-core/)                |
| npm           | [@persian-web/core](https://www.npmjs.com/package/@persian-web/core)          |
| GitHub        | [roozbeh95m/persian-web-core](https://github.com/roozbeh95m/persian-web-core) |
| Markdown docs | [`docs/`](./docs/)                                                            |

---

## Installation

Requires **Node.js 20+** for development and Node consumers. Modern browsers with ESM and current `Intl` APIs can use the same builds.

```bash
npm install @persian-web/core
```

```bash
pnpm add @persian-web/core
```

```bash
yarn add @persian-web/core
```

The package is **ESM-only** (`"type": "module"`). There is no CommonJS (`require`) build.

## Quick Start

```ts
import {
  toPersianDigits,
  normalizePersian,
  formatNumber,
  formatToman,
  normalizePhone,
  includesPersian,
  toJalali,
  formatJalali,
  isRTL,
  fixPersianTypography,
} from '@persian-web/core';

toPersianDigits('قیمت: 2500');
// 'قیمت: ۲۵۰۰'

normalizePersian('كي');
// 'کی'

formatNumber(1_250_000, { locale: 'fa-IR' });
// '۱٬۲۵۰٬۰۰۰'

formatToman(1_250_000);
// '‎تومان ۱٬۲۵۰٬۰۰۰'

normalizePhone('۰۹۱۲۱۲۳۴۵۶۷');
// '+989121234567'

includesPersian('گوشی سامسونگ كلاسیک', 'کلاس');
// true

toJalali(2024, 3, 20);
// { year: 1403, month: 1, day: 1 }

formatJalali({ year: 1403, month: 1, day: 1 }, { digits: 'persian' });
// '۱۴۰۳/۰۱/۰۱'

isRTL('سلام دنیا');
// true

fixPersianTypography('می رود');
// 'می‌رود'
```

Prefer subpath imports when you only need one module:

```ts
import { toPersianDigits } from '@persian-web/core/digits';
import { normalizePersian } from '@persian-web/core/normalize';
import { toJalali } from '@persian-web/core/date';
import { isRTL } from '@persian-web/core/direction';
```

## Main features

- **Persian digit conversion** between English, Persian, and Arabic-Indic scripts
- **Persian number formatting** via `Intl`, with optional Persian digits and `fa-IR` grouping
- **Jalali date** conversion and formatting (Persian calendar / Solar Hijri)
- **RTL utilities** — detect `rtl` / `ltr` / `mixed` / `neutral` for UI `dir` heuristics
- **Persian typography** — conservative display fixes (quotes, verbal-prefix ZWNJ, punctuation spacing)
- **Persian localization helpers** — orthographic normalization, search folding, collation, and Persian-preserving URL slugs
- **Iranian web forms** — mobile normalize/validate/format and کد ملی validation
- **Currency display** — toman and rial formatting helpers
- Tree-shakeable ESM modules with full TypeScript declarations and **no runtime dependencies**

## Why this library exists

Persian and Farsi web apps repeatedly hit the same low-level problems that generic i18n stacks do not solve well:

| Problem              | What goes wrong without shared utilities                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------------------------- |
| Mixed digit scripts  | English `0–9`, Persian `۰–۹`, and Arabic-Indic `٠–٩` appear in the same forms and search queries           |
| Yeh / Kaf variants   | Arabic `ي` / `ك` vs Persian `ی` / `ک` break equality, search, and sort                                     |
| ZWNJ                 | `می‌روم` vs `میروم` must match for search but remain distinct for display                                  |
| Iranian domain rules | Mobile numbers, کد ملی checksums, rial/toman display, and Jalali (Persian calendar) civil dates            |
| RTL / mixed UI       | Right-to-left JavaScript UI needs direction inferred from strong characters, not assumed from locale alone |

`@persian-web/core` is the shared foundation for those concerns: small, deterministic helpers so product packages can import only what they need.

## API examples

```ts
import {
  toEnglishDigits,
  formatIranianPhone,
  validateNationalId,
  sortPersian,
  getTextDirection,
  toGregorian,
  persianSlug,
} from '@persian-web/core';

toEnglishDigits('۲۵۰۰');
// '2500'

formatIranianPhone('09121234567', {
  format: 'international',
  digits: 'persian',
});
// '+۹۸ ۹۱۲ ۱۲۳ ۴۵۶۷'

validateNationalId('0013542419');
// { valid: true }

sortPersian(['یوسف', 'آرش', 'كيان', '۱۲', '2']);
// ['2', '۱۲', 'آرش', 'كيان', 'یوسف']

getTextDirection('Android گوشی ۱۲۳');
// 'mixed'

toGregorian(1403, 1, 1);
// { year: 2024, month: 3, day: 20 }

persianSlug('راهنمای شروع سریع');
// 'راهنمای-شروع-سریع'
```

## API overview

| Area          | Entry                           | Main exports                                                  | Docs                                        |
| ------------- | ------------------------------- | ------------------------------------------------------------- | ------------------------------------------- |
| Digits        | `@persian-web/core/digits`      | `toPersianDigits`, `toEnglishDigits`                          | [digits.md](./docs/digits.md)               |
| Normalization | `@persian-web/core/normalize`   | `normalizePersian`                                            | [normalization.md](./docs/normalization.md) |
| Numbers       | `@persian-web/core/format`      | `formatNumber`                                                | [numbers.md](./docs/numbers.md)             |
| Currency      | `@persian-web/core/currency`    | `formatCurrency`, `formatToman`, `formatRial`                 | [currency.md](./docs/currency.md)           |
| Phone         | `@persian-web/core/phone`       | `normalizePhone`, `isValidIranianPhone`, `formatIranianPhone` | [phone.md](./docs/phone.md)                 |
| Validation    | `@persian-web/core/national-id` | `isValidNationalId`, `validateNationalId`                     | [validation.md](./docs/validation.md)       |
| Search        | `@persian-web/core/search`      | `normalizeForSearch`, `includesPersian`, `matchesPersian`     | [search.md](./docs/search.md)               |
| Typography    | `@persian-web/core/typography`  | `fixPersianTypography`                                        | [typography.md](./docs/typography.md)       |
| Sorting       | `@persian-web/core/sort`        | `createPersianCollator`, `sortPersian`                        | [sorting.md](./docs/sorting.md)             |
| Date          | `@persian-web/core/date`        | `toJalali`, `toGregorian`, `formatJalali`, `relativeTime`     | [date.md](./docs/date.md)                   |
| RTL           | `@persian-web/core/direction`   | `getTextDirection`, `isRTL`, `isMixedDirection`               | [rtl.md](./docs/rtl.md)                     |
| Slug          | `@persian-web/core/slug`        | `persianSlug`                                                 | [slug.md](./docs/slug.md)                   |

Root import `@persian-web/core` re-exports the full public API and associated types.

Each docs page covers **description**, **usage**, **output**, **options**, **edge cases**, and **examples** for every public function in that module.

## Documentation

- **Live docs & playground:** [https://roozbeh95m.github.io/persian-web-core/](https://roozbeh95m.github.io/persian-web-core/)
- **Markdown API reference:** [`docs/`](./docs/) (also published with the npm package)
- **Local demo app:** [`demo/`](./demo/)

```bash
npm --prefix demo install --ignore-scripts
npm run demo
```

## Examples

Runnable Node examples live in [`examples/`](./examples/):

| Example                                                       | Demonstrates                                   |
| ------------------------------------------------------------- | ---------------------------------------------- |
| [`quick-start.mjs`](./examples/quick-start.mjs)               | Digits, Jalali date, numbers, RTL, typography  |
| [`jalali-date.mjs`](./examples/jalali-date.mjs)               | Jalali ↔ Gregorian conversion and formatting   |
| [`persian-numbers.mjs`](./examples/persian-numbers.mjs)       | Persian number formatting and digit conversion |
| [`rtl-and-typography.mjs`](./examples/rtl-and-typography.mjs) | RTL utilities and Persian typography           |
| [`iranian-forms.mjs`](./examples/iranian-forms.mjs)           | Iranian phone and national ID helpers          |

```bash
npm run examples
# or after build:
node examples/jalali-date.mjs
```

## TypeScript usage

- Written in TypeScript with strict compiler settings (`strict`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`)
- Published `.d.ts` declarations for every export and subpath
- Option objects and result unions are exported as named types (for example `NormalizePersianOptions`, `ValidateNationalIdResult`, `JalaliDate`)
- No `@types/*` runtime dependency — consumers get types from the package itself

```ts
import type {
  FormatNumberOptions,
  ValidateNationalIdResult,
  JalaliDate,
  TextDirection,
} from '@persian-web/core';

const date: JalaliDate = { year: 1403, month: 1, day: 1 };
const direction: TextDirection = 'rtl';
```

## Browser and Node compatibility

| Environment                                  | Support                                                                                                 |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Node.js                                      | `>= 20` (declared in `engines`)                                                                         |
| Bundlers (Vite, Webpack, Rollup, esbuild, …) | ESM + `exports` map                                                                                     |
| Browsers                                     | Modern engines with ESM and `Intl` (`NumberFormat`, `Collator`, `DateTimeFormat`, `RelativeTimeFormat`) |

Notes:

- There is no CommonJS (`require`) entry.
- Currency, number, sort, and relative-time output can vary slightly across `Intl` implementations; pin locales in tests when asserting exact strings.
- Jalali conversion overloads that take numeric year/month/day are pure calendar math and do not depend on the host time zone.

## Tree-shaking

- `"sideEffects": false` in `package.json`
- Per-module subpath exports so unused domains stay out of the bundle
- Root entry only re-exports; modules do not register global side effects on import
- Pure functions; many helpers return the original string reference when nothing changes

```ts
// Pulls only the digits module into a well-configured bundler graph
import { toPersianDigits } from '@persian-web/core/digits';
```

## Development

```bash
git clone https://github.com/roozbeh95m/persian-web-core.git
cd persian-web-core
npm install
npm run typecheck
npm test
npm run build
```

| Script                            | Purpose                                     |
| --------------------------------- | ------------------------------------------- |
| `npm run build`                   | Emit `dist/` (JS + `.d.ts` + source maps)   |
| `npm run typecheck`               | `tsc --noEmit`                              |
| `npm run lint` / `lint:fix`       | ESLint                                      |
| `npm run format` / `format:check` | Prettier                                    |
| `npm test`                        | Vitest unit / property / integration suite  |
| `npm run test:coverage`           | Coverage report under `coverage/`           |
| `npm run size`                    | Fail if `dist/` import graphs exceed budget |
| `npm run examples`                | Build and run the quick-start example       |
| `npm run benchmark`               | Vitest benches (`--run`)                    |
| `npm run demo`                    | Local docs & playground (`demo/`)           |
| `npm run demo:build`              | Production build of the docs site           |

Tests favor **invariants** over brittle snapshots: unit tests, property tests (`fast-check`), cross-module integration tests, export/tree-shake checks, and Vitest microbenchmarks.

```bash
npm test
npm run test:coverage
npm run benchmark
```

Pre-commit hooks run typecheck, lint, and format checks. Commits follow [Conventional Commits](https://www.conventionalcommits.org/).

Pull requests run install, typecheck, lint, tests, build, coverage, demo build, and bundle size checks on GitHub Actions (Node 20 and 22).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup, coding standards, and PR expectations.

## License

[MIT](./LICENSE)

See [CHANGELOG.md](./CHANGELOG.md) for release notes.

## Roadmap

Current version is **`0.1.3`** (pre-1.0). Planned work, in priority order:

1. **API freeze toward `1.0.0`** — stabilize option names, result unions, and subpath exports; document breaking changes in [CHANGELOG.md](./CHANGELOG.md) before the major bump.
2. **Release automation** — keep trusted publishing / CI green on every release tag.
3. **Phone coverage maintenance** — keep Iranian mobile prefix ranges aligned with allocations.
4. **Intl compatibility notes** — document known output differences across Node and major browsers for currency/number/relative-time assertions.
5. **Docs site polish** — keep the live demo ([GitHub Pages](https://roozbeh95m.github.io/persian-web-core/)) aligned with the public API and Markdown docs under [`docs/`](./docs/).

Items deliberately **not** on the roadmap: automatic IRR↔IRT conversion, Latin transliteration of Persian slugs, open-ended grammar correction, and keyboard layout simulation.
