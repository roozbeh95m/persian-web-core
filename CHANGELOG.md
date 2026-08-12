# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.3] - 2026-08-12

### Changed

- Ship npm discoverability improvements that landed after `0.1.2` was already published: richer `description`, `keywords`, `author`, README, `CONTRIBUTING.md`, and `examples/`.

### Notes

- No public API or runtime behavior changes. npm versions are immutable, so this patch republishes the docs/metadata work under a new version.

[0.1.3]: https://github.com/roozbeh95m/persian-web-core/releases/tag/v0.1.3

## [0.1.2] - 2026-08-12

### Changed

- Publish from GitHub Actions via npm Trusted Publishing (OIDC), without a long-lived `NPM_TOKEN`.
- Improved npm package discoverability: richer `description`, relevant `keywords`, `author`, and `module` fields.
- Rewrote README with a clearer Persian/Farsi web development positioning, npm/GitHub badges, and links to runnable examples.
- Added [`CONTRIBUTING.md`](./CONTRIBUTING.md) and an [`examples/`](./examples/) directory demonstrating the real public API.

### Notes

- No public API or runtime behavior changes.
- The discoverability file changes above were committed after this version was already on npm; consumers get them from `0.1.3+`.

[0.1.2]: https://github.com/roozbeh95m/persian-web-core/releases/tag/v0.1.2

## [0.1.1] - 2026-08-12

### Changed

- Link npm package metadata to the GitHub repository (`repository`, `homepage`, `bugs`).

[0.1.1]: https://github.com/roozbeh95m/persian-web-core/releases/tag/v0.1.1

## [0.1.0] - 2026-08-12

First public release of `@persian-web/core`: a dependency-free TypeScript MVP for Persian (Farsi) web utilities.

### Added

- **Digits** — `toPersianDigits`, `toEnglishDigits` (English / Persian / Arabic-Indic)
- **Normalization** — `normalizePersian` with conservative Yeh/Kaf/ZWNJ defaults and opt-in digits, diacritics, and whitespace options
- **Numbers** — `formatNumber` via `Intl.NumberFormat` with digit overrides
- **Currency** — `formatCurrency`, `formatToman`, `formatRial`
- **Phone** — `normalizePhone`, `isValidIranianPhone`, `formatIranianPhone` for Iranian mobiles
- **National ID** — `isValidNationalId`, `validateNationalId` with structured rejection reasons
- **Search** — `normalizeForSearch`, `includesPersian`, `matchesPersian`
- **Typography** — `fixPersianTypography` for conservative display fixes
- **Sorting** — `createPersianCollator`, `sortPersian`
- **Date** — `toJalali`, `toGregorian`, `formatJalali`, `relativeTime`
- **Direction** — `getTextDirection`, `isRTL`, `isMixedDirection`
- **Slug** — `persianSlug` (Persian-preserving, no Latin transliteration)
- ESM-only package with root and per-module subpath exports, TypeScript declarations, and `"sideEffects": false`
- API docs under `docs/`, MIT license, CI on Node 20/22

### Notes

- Pre-1.0: APIs may still change before `1.0.0`. Prefer pinning a version range that matches your tolerance for breaking changes.
- Number, currency, sort, and relative-time string output can vary slightly across `Intl` implementations.

[0.1.0]: https://github.com/roozbeh95m/persian-web-core/releases/tag/v0.1.0
