# Release checklist — `@persian-web/core` 0.1.0

First public release. Target quality: **stable MVP** (current surface, no new features).

## Pre-release verification

| #   | Check               | Command / artifact                        | Status                                                                               |
| --- | ------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------ |
| 1   | Tests               | `npm test`                                | Pass (26 files / 722 tests)                                                          |
| 2   | Typecheck           | `npm run typecheck`                       | Pass                                                                                 |
| 3   | Lint                | `npm run lint`                            | Pass                                                                                 |
| 4   | Build               | `npm run build`                           | Pass                                                                                 |
| 4b  | Bundle size         | `npm run size`                            | Pass                                                                                 |
| 5   | Benchmarks          | `npm run benchmark`                       | Pass                                                                                 |
| 5b  | Format              | `npm run format:check`                    | Pass                                                                                 |
| 6   | `npm pack`          | `npm pack`                                | Pass (~67 kB packed)                                                                 |
| 7   | Package contents    | tarball inspection                        | Pass — only `dist/`, `docs/`, `LICENSE`, `README.md`, `CHANGELOG.md`, `package.json` |
| 8   | Exports             | `package.json` `exports` + packed runtime | Pass — root + 12 subpaths                                                            |
| 9   | Documentation       | `docs/*.md` vs public API                 | Pass — every public function documented                                              |
| 10  | CHANGELOG           | `CHANGELOG.md`                            | Pass — `0.1.0` entry                                                                 |
| 11  | LICENSE             | `LICENSE` (MIT)                           | Pass                                                                                 |
| 12  | README installation | `npm` / `pnpm` / `yarn`, Node 20+, ESM    | Pass                                                                                 |

## Package metadata

- [x] `version` is `0.1.0`
- [x] `name` is `@persian-web/core`
- [x] `license` is `MIT`
- [x] `publishConfig.access` is `public`
- [x] `files` includes `dist`, `README.md`, `LICENSE`, `CHANGELOG.md`, `docs`
- [x] `sideEffects` is `false`
- [x] `engines.node` is `>=20`
- [x] No source, tests, benches, or `node_modules` in the tarball

## Publish steps (manual)

1. Ensure `main` is clean and CI is green on the release commit.
2. Tag: `git tag -a v0.1.0 -m "v0.1.0"` then `git push origin v0.1.0` (after pushing commits).
3. Create a GitHub Release from the tag; body can mirror `CHANGELOG.md` `0.1.0`.
4. Publish to npm when ready:
   - Local: `npm publish --access public` (requires npm auth for `@persian-web`)
   - Or enable live publish in `.github/workflows/publish.yml` (currently dry-run only) and run the workflow with `dry_run=false` after wiring `NPM_TOKEN` / trusted publishing.
5. Verify install: `npm view @persian-web/core version` and a fresh `npm install @persian-web/core@0.1.0`.

## Out of scope for 0.1.0

- New features or API expansions
- Live npm publish automation (dry-run workflow remains until intentionally enabled)
- Docs site beyond Markdown under `docs/`
