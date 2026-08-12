# @persian-web/core

[![CI](https://github.com/roozbeh95m/persian-web-core/actions/workflows/ci.yml/badge.svg)](https://github.com/roozbeh95m/persian-web-core/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Dependency-free TypeScript utilities for Persian (Farsi) text, numbers, dates, and Iranian web forms.

The library covers digit conversion, orthographic normalization, display typography, locale-aware formatting, Iranian phone and national ID helpers, search keys, URL slugs, sorting, Jalali dates, and text direction detection. Every public function is typed, tree-shakeable, and covered by unit and property tests.

## Why Persian Web needs this library

Persian web apps repeatedly hit the same low-level problems that generic i18n stacks do not solve well:

| Problem              | What goes wrong without shared utilities                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| Mixed digit scripts  | English `0–9`, Persian `۰–۹`, and Arabic-Indic `٠–٩` appear in the same forms and search queries |
| Yeh / Kaf variants   | Arabic `ي` / `ك` vs Persian `ی` / `ک` break equality, search, and sort                           |
| ZWNJ                 | `می‌روم` vs `میروم` must match for search but remain distinct for display                        |
| Iranian domain rules | Mobile numbers, کد ملی checksums, rial/toman display, and Jalali civil dates                     |
| RTL / mixed UI       | Direction must be inferred from strong characters, not assumed from locale alone                 |

`@persian-web/core` is the shared foundation for those concerns: small, deterministic helpers with no runtime dependencies, so product packages can import only what they need.

## Installation

Requires **Node.js 20+** (for development and Node consumers). Modern browsers that support ESM and current `Intl` APIs can use the same builds.

```bash
npm install @persian-web/core
```

```bash
pnpm add @persian-web/core
```

```bash
yarn add @persian-web/core
```

The package is **ESM-only** (`"type": "module"`). There is no CommonJS build.

## Quick start

```ts
import {
  toPersianDigits,
  normalizePersian,
  formatToman,
  normalizePhone,
  includesPersian,
  toJalali,
  isRTL,
} from '@persian-web/core';

toPersianDigits('قیمت: 2500'); // 'قیمت: ۲۵۰۰'
normalizePersian('كي'); // 'کی'
formatToman(1_250_000); // '‎تومان ۱٬۲۵۰٬۰۰۰'
normalizePhone('۰۹۱۲۱۲۳۴۵۶۷'); // '+989121234567'
includesPersian('گوشی سامسونگ كلاسیک', 'کلاس'); // true
toJalali(2024, 3, 20); // { year: 1403, month: 1, day: 1 }
isRTL('سلام دنیا'); // true
```

Prefer subpath imports when you only need one module:

```ts
import { toPersianDigits } from '@persian-web/core/digits';
import { normalizePersian } from '@persian-web/core/normalize';
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

Each docs page documents **description**, **usage**, **output**, **options**, **edge cases**, and **examples** for every public function in that module.

## Feature list

- **Digit conversion** between English, Persian, and Arabic-Indic scripts
- **Conservative normalization** (Yeh/Kaf/ZWNJ always; digits, diacritics, whitespace opt-in)
- **Display typography** fixes (quotes, verbal-prefix ZWNJ, punctuation spacing) — not spell-checking
- **`Intl`-backed** number and currency formatting with optional digit overrides
- **Iranian mobile** parse / validate / format (national + E.164)
- **کد ملی** validation with structured rejection reasons
- **Search normalization** that folds Yeh/Kaf, digits, diacritics, ZWNJ, and ASCII case
- **Persian-preserving URL slugs** (no Latin transliteration)
- **Persian collation** via `Intl.Collator` with normalized sort keys
- **Jalali ↔ Gregorian** conversion and token formatting (Borkowski algorithm)
- **Relative time** in Persian via `Intl.RelativeTimeFormat`
- **Text direction** detection (`rtl` / `ltr` / `mixed` / `neutral`)

## TypeScript support

- Written in TypeScript with strict compiler settings (`strict`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`)
- Published `.d.ts` declarations for every export and subpath
- Option objects and result unions are exported as named types (for example `NormalizePersianOptions`, `ValidateNationalIdResult`)
- No `@types/*` runtime dependency — consumers get types from the package itself

```ts
import type {
  FormatNumberOptions,
  ValidateNationalIdResult,
  JalaliDate,
} from '@persian-web/core';
```

## Browser and Node support

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

## Performance philosophy

The library optimizes for **predictable cost** and **allocation avoidance**, not absolute marketing numbers:

- Allocate a new string only when a conversion changes the input; otherwise return the same reference
- Cache hot `Intl.NumberFormat` instances (LRU, size 64)
- Memoize `normalizeForSearch` results (LRU, size 512)
- Cache the default Persian collator used by `sortPersian`
- Use a Schwartzian transform in `sortPersian` so each key is normalized once

Reproducible Vitest microbenchmarks live next to the source (`*.bench.ts`). Absolute timings vary by machine — compare ratios and PR deltas on the same Node version:

```bash
npm run benchmark
```

## Testing philosophy

Tests favor **invariants** over brittle snapshots:

| Kind                          | What they protect                                                               |
| ----------------------------- | ------------------------------------------------------------------------------- |
| Unit tests                    | Exact outputs, rejection reasons, and documented edge cases                     |
| Property tests (`fast-check`) | Idempotence, round-trips, and “never throw on arbitrary strings” where promised |
| Integration tests             | Cross-module contracts (digits ↔ phone, normalize ↔ search, …)                  |
| Export tests                  | Public `exports` map and tree-shake isolation of subpaths                       |
| Benchmarks                    | Relative cost of hot paths with fixed fixtures                                  |

Pre-commit hooks run typecheck, lint, and format checks. Commits follow [Conventional Commits](https://www.conventionalcommits.org/).

```bash
npm test
npm run test:coverage
```

## Contribution guide

1. Open an issue for behavior changes or new APIs before large PRs.
2. Keep helpers **deterministic**, **pure**, and free of runtime dependencies unless discussed.
3. Prefer opt-in behavior for anything that rewrites user-visible text beyond Yeh/Kaf/ZWNJ.
4. Add unit tests for new cases; add property tests when the function claims an invariant (idempotence, round-trip).
5. Update the matching file under [`docs/`](./docs/) and the API overview table in this README.
6. Use Conventional Commit messages (`feat:`, `fix:`, `docs:`, `test:`, `chore:`, …).

Do **not** expand scope into stemming, spell-checking, OCR, or full NLP without an explicit design discussion — those are out of scope for this package.

## Development setup

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
| `npm run benchmark`               | Vitest benches (`--run`)                    |

Pull requests run install, typecheck, lint, tests, build, coverage, and bundle size checks on GitHub Actions (Node 20 and 22). Publishing is a separate manual workflow and stays dry-run until intentionally enabled.

Husky runs typecheck, lint, and format checks on commit, and commitlint on the commit message.

## License

[MIT](./LICENSE)

See [CHANGELOG.md](./CHANGELOG.md) for release notes.

## Roadmap

Current version is **`0.1.0`** (first public MVP; still pre-1.0). Planned work, in priority order:

1. **API freeze toward `1.0.0`** — stabilize option names, result unions, and subpath exports; document breaking changes in [CHANGELOG.md](./CHANGELOG.md) before the major bump.
2. **Release automation** — enable live npm publish (trusted publishing / `NPM_TOKEN`) once the first publish is verified; keep CI green on every release tag.
3. **Phone coverage maintenance** — keep Iranian mobile prefix ranges aligned with allocations; evaluate optional landline helpers as a separate, explicitly scoped API if needed.
4. **Intl compatibility notes** — document known output differences across Node and major browsers for currency/number/relative-time assertions.
5. **Docs site (optional)** — if the Markdown tree outgrows GitHub browsing, generate a static docs site from `docs/` without changing the library API.

Items deliberately **not** on the roadmap: automatic IRR↔IRT conversion, Latin transliteration of Persian slugs, and open-ended grammar correction.
