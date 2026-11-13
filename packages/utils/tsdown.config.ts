import { defineConfig } from "tsdown"

export default defineConfig({
  target: "es2022",
  dts: true,
  entry: "src/index.ts",
  format: ["esm", "cjs"],
  sourcemap: true,
})
