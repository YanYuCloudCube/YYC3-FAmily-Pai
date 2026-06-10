import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    core: 'src/core/index.ts',
    components: 'src/components/index.ts',
    themes: 'src/themes/index.ts',
    shadcn: 'src/shadcn.ts',
  },
  format: ['esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', '@yyc3/core'],
  treeshake: true,
  minify: false,
})
