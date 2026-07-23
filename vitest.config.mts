import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  envDir: import.meta.dirname,
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts'],
  },
});
