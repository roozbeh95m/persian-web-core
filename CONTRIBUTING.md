# Contributing to @persian-web/core

Thanks for helping improve this Persian / Farsi JavaScript and TypeScript utility library.

## Development setup

```bash
git clone https://github.com/roozbeh95m/persian-web-core.git
cd persian-web-core
npm install
npm run typecheck
npm test
npm run build
```

Requires **Node.js 20+**.

## Project guidelines

1. Open an issue for behavior changes or new APIs before large PRs.
2. Keep helpers **deterministic**, **pure**, and free of runtime dependencies unless discussed.
3. Prefer opt-in behavior for anything that rewrites user-visible text beyond Yeh/Kaf/ZWNJ.
4. Add unit tests for new cases; add property tests when the function claims an invariant (idempotence, round-trip).
5. Update the matching file under [`docs/`](./docs/) and the API overview table in [`README.md`](./README.md).
6. If you add a usage demo, prefer a small script under [`examples/`](./examples/) that imports the real public API.
7. Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `test:`, `chore:`, …).

Do **not** expand scope into stemming, spell-checking, OCR, keyboard layout simulation, or full NLP without an explicit design discussion — those are out of scope for this package.

## Useful scripts

| Script              | Purpose                                  |
| ------------------- | ---------------------------------------- |
| `npm run build`     | Emit `dist/`                             |
| `npm run typecheck` | TypeScript check                         |
| `npm run lint`      | ESLint                                   |
| `npm run format`    | Prettier write                           |
| `npm test`          | Vitest suite                             |
| `npm run examples`  | Build and run `examples/quick-start.mjs` |
| `npm run size`      | Bundle size budget                       |
| `npm run benchmark` | Microbenchmarks                          |

Husky runs typecheck, lint, and format checks on commit, and commitlint on the commit message.

## Pull requests

- Keep PRs focused; separate docs/discoverability changes from API changes when possible.
- Ensure CI is green (Node 20 and 22).
- Do not publish from forks — releases are handled from the main repository workflows.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](./LICENSE).
