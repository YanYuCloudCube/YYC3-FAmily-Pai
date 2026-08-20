import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/__tests__/**',
        'src/next.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 75,
        lines: 80,
      },
    },
    include: ['src/**/*.test.{ts,tsx}', 'src/__tests__/**/*.{test,spec}.{ts,tsx}'],
    testTimeout: 10000,
  },
})
