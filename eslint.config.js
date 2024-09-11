import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: globals.browser,
      parser: tsParser, // Usa el parser de TypeScript
      parserOptions: {
        ecmaVersion: 2020, // Especifica la versión de ECMAScript que usarás
        sourceType: "module", // Si usas módulos
        project: './tsconfig.json', // Especifica el tsconfig si es necesario
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...pluginJs.configs.recommended.rules, // Reglas recomendadas para JS
      ...tseslint.configs.recommended.rules, // Reglas recomendadas para TS
    },
  },
];
