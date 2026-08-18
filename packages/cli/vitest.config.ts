import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@/src': path.resolve(__dirname, './src'),
      '../../../tests/src/utils/registry': path.resolve(__dirname, './tests/src/utils/registry'),
    },
  },
})
