import { defineConfig } from "vitest/config"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["lib/__tests__/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      reporter: ["text", "lcov"],
      include: ["lib/imageUrl.ts", "lib/validations/**/*.ts"],
      thresholds: {
        lines: 60,
        statements: 60,
        branches: 60,
        functions: 60,
      },
    },
  },
})
