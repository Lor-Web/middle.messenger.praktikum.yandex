import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist/**/*']),
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js, 'simple-import-sort': simpleImportSort },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-var': 'error',
      'prefer-const': 'error',

      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      '@typescript-eslint/no-unused-vars': ['error', { caughtErrorsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
    },
  },
  tseslint.configs.recommended,
  prettier,
]);
