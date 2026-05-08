import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: {
    resolve: false,
  },
  clean: true,
  splitting: false,
  sourcemap: true,
  external: ["react", "react-dom", "motion", "motion/react"],
})
