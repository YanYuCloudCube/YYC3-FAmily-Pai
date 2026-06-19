/**
 * 根级 ESLint Flat Config
 * 解决 VS Code ESLint 扩展 "could not load some configs" 错误
 * 各子包有自己的 eslint.config.js，此处仅做根级兜底
 */
export default [
  // 全局忽略
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/*.d.ts',
      'docs-site/**',
      '.changeset/**',
      'public/**',
      'scripts/**',
      'server/**',
    ],
  },

  // 根目录配置文件（eslint.config.mjs 本身、prettier.config.js 等）
  {
    files: ['*.js', '*.mjs', '*.cjs'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        module: 'writable',
        require: 'readonly',
        process: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
        exports: 'writable',
      },
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
    },
  },

  // TypeScript 文件（根级兜底，子包有更具体的配置）
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        localStorage: 'readonly',
        HTMLElement: 'readonly',
        Event: 'readonly',
        CustomEvent: 'readonly',
        Node: 'readonly',
        Element: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        globalThis: 'readonly',
        URL: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
];
