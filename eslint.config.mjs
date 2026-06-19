/**
 * 根级 ESLint 配置 (Flat Config)
 * 解决 VS Code ESLint 扩展 "could not load some configs" 错误
 * 各子包有自己的 eslint.config.js，此处仅做根级忽略
 */
export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/*.js',
      '**/*.mjs',
      '**/*.cjs',
      '**/*.d.ts',
      'docs-site/**',
      '.changeset/**',
      'public/**',
    ],
  },
];
