import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Wir nutzen durchgehend deutsche typografische Anführungszeichen
      // („…") und Apostrophe (Wenn's, gibt's). Das ist Absicht.
      "react/no-unescaped-entities": "off",
      // Wir setzen revealed gezielt in useEffect — siehe site-header.tsx
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
