import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.{test,spec,bench}.ts',
        'src/benchmark/**',
        'src/**/fixtures.ts',
        'src/**/types.ts',
      ],
      reporter: ['text', 'text-summary', 'json-summary'],
      reportsDirectory: './coverage',
    },
    /**
     * Benchmark suite (`npm run benchmark`).
     *
     * Reproducibility notes:
     * - Fixtures in `src/benchmark/fixtures.ts` are fixed (no RNG).
     * - Each bench uses explicit `iterations` / `warmupIterations`.
     * - Absolute ns/op varies by CPU; compare ratios and PR deltas on the
     *   same machine/Node version.
     */
    benchmark: {
      include: ['src/**/*.bench.ts'],
      reporters: ['verbose'],
    },
  },
});
