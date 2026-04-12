import js from "@eslint/js";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import importPlugin from "eslint-plugin-import";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["tests/**/*.js"],

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  {
    files: ["**/*.js"],
    ignores: ["dist/**", "node_modules/**"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },

    plugins: {
      sonarjs,
      unicorn,
      import: importPlugin,
    },

    rules: {
      /*
       * === ERREURS CRITIQUES (bloquantes) ===
       */
      "no-undef": "error",
      "no-console": "error",
      "no-unreachable": "error",
      "no-constant-condition": "error",
      "no-debugger": "error",
      "no-dupe-keys": "error",
      "no-duplicate-case": "error",
      "no-ex-assign": "error",
      "no-func-assign": "error",
      "no-import-assign": "error",

      /*
       * === QUALITÉ / ROBUSTESSE ===
       */
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
      "no-var": "error",
      "prefer-const": "error",
      "no-return-await": "error",
      "require-await": "error",

      /*
       * === VARIABLES ===
       */
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      /*
       * === IMPORTS ===
       */
      "import/no-unresolved": "error",
      "import/no-duplicates": "error",
      "import/order": [
        "error",
        {
          "newlines-between": "always",
        },
      ],

      /*
       * === SONAR (code smells / complexité) ===
       */
      "sonarjs/no-identical-functions": "error",
      "sonarjs/no-redundant-boolean": "error",
      "sonarjs/no-implicit-dependencies": "error",
      "sonarjs/cognitive-complexity": "error",

      /*
       * === UNICORN (modern JS / Node) ===
       */
      "unicorn/prefer-node-protocol": "error",
      "unicorn/prefer-top-level-await": "error",
      "unicorn/error-message": "error",
      "unicorn/no-array-callback-reference": "error",
      "unicorn/no-useless-undefined": "error",

      /*
       * === STYLE STRICT MAIS UTILE ===
       */
      "consistent-return": "error",
      "no-nested-ternary": "error",
      "no-shadow": "error",
    },
  },
];
