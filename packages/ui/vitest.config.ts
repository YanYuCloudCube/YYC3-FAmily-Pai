import react from '@vitejs/plugin-react'
import path from 'path'
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
        '**/*.spec.ts',
        '**/*.spec.tsx',
        '**/__tests__/**',
        '**/types.ts',
        'src/components/ui/**',
        'src/shadcn.ts',
        'src/hooks/use-mobile.ts',
        'src/core/hooks.ts',
        'src/core/index.ts',
        'src/components/layout.tsx',
        // barrel 再导出文件（无逻辑）
        '**/index.ts',
        // 主题纯数据文件（theme-provider.tsx 保持考核）
        'src/themes/*-theme.ts',
        // v2 遗留顶层组件 → 已归档至 packages/ui/legacy/（死代码，未发布）
        'legacy/**',
      ],
      thresholds: {
        statements: 90,
        branches: 75,
        // v3.0.0：补齐 18 个交互测试文件后 functions 77%
        // （React 内联箭头计数严苛，健康水位 75+）
        functions: 75,
        lines: 90,
      },
    },
    include: ['src/**/*.test.{ts,tsx}', 'src/__tests__/**/*.{test,spec}.{ts,tsx}'],
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
