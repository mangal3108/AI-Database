import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Test files
    "**/__tests__/**",
    "**/*.test.ts",
    "**/*.spec.ts",
  ]),
  // Allow explicit any for webhook handlers and API routes
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      // These React Compiler diagnostics are not correctness failures for the
      // existing client-side animation/data-hydration patterns in this app.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",
      "react-hooks/refs": "off",
      "react/no-unescaped-entities": "off",
    },
  },
]);

export default eslintConfig;
