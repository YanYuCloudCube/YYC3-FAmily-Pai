import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      'motion/react': path.resolve(import.meta.dirname, './src/__mocks__/motion-react.ts'),
    },
  },
})
