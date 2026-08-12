import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.{test,spec,bench}.ts',
        'src/**/fixtures.ts',
        'src/**/types.ts',
      ],
      reporter: ['text', 'text-summary', 'json-summary'],
      reportsDirectory: './coverage',
    },
  },
});
