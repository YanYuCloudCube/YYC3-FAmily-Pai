import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    next: 'src/next.ts',
  },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: true,
  treeshake: true,
  minify: true,
  external: ['react', 'react-dom', '@yyc3/i18n-core', 'next', 'next/server'],
})
