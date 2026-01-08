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
  ]),
  {
    rules: {
      // Warn on direct Three.js imports - should use dynamic import pattern
      "no-restricted-imports": [
        "warn",
        {
          paths: [
            {
              name: "three",
              message:
                "Import Three.js via LazyScene pattern (dynamic import with ssr: false) to avoid SSR issues and reduce bundle size. See src/components/animations/LazyScene.tsx for the pattern.",
            },
          ],
        },
      ],
    },
  },
  {
    // Allow direct Three.js imports in the Scene component (loaded dynamically)
    files: ["**/components/animations/Scene.tsx"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
]);

export default eslintConfig;
