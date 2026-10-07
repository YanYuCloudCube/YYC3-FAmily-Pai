import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/test/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/**/*.ts'],
      exclude: ['src/lib/plugins/console-logger.ts', 'src/lib/types.ts', 'src/lib/plugins/index.ts'],
      thresholds: {
        statements: 90,
        // @vitest/coverage-v8 v4 分支计数更精确（??/||/三元臂），
        // 与正源 YYC3-i18n-Core 仓同步自 89 重校准为 85。
        branches: 85,
        functions: 90,
        lines: 90,
      },
    },
  },
});
