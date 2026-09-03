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
    // Código de terceiros instalado por registry (shadcn e React Bits). É
    // vendorizado como está para poder ser reinstalado ou atualizado sem
    // conflito, então não passa pelo nosso lint.
    "src/components/ui/**",
    "src/components/reactbits/**",
  ]),
]);

export default eslintConfig;
