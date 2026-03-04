import eslintComments from '@eslint-community/eslint-plugin-eslint-comments';
import js from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';
import { defineConfig } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import jest from 'eslint-plugin-jest';
import jsdoc from 'eslint-plugin-jsdoc';
import prettier from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';

const flatCompat = new FlatCompat();

export default defineConfig(
  js.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs.flat['recommended-latest'],
  jest.configs['flat/recommended'],
  jsdoc.configs['flat/recommended-typescript'],
  eslintReact.configs['recommended-typescript'],
  fixupConfigRules(flatCompat.config(eslintComments.configs['recommended'])),
  // ...reactNativeConfig,
  prettierConfig,
  [
    {
      name: 'files-ignore',
      ignores: [
        'node_modules/**',
        'lib/**',
        '**/*.d.ts',
        '**/*.test.ts(x)?',
        '**/*.config.js',
        'scripts/**',
        'example/index.js',
      ],
    },
    {
      languageOptions: {
        parserOptions: {
          tsconfigRootDir: import.meta.dirname,
          project: ['./tsconfig.json'],
        },
      },
      plugins: { prettier },
      rules: {
        'prettier/prettier': 'error',

        // Rules from `@eslint/js`
        'default-param-last': 'error',
        'implicit-arrow-linebreak': 'off',

        // React - rules from `@eslint-react/eslint-plugin`
        '@eslint-react/no-missing-key': 'error',
        '@eslint-react/no-duplicate-key': 'error',
        '@eslint-react/no-implicit-key': 'error',
        '@eslint-react/jsx-key-before-spread': 'error',

        // Comments
        '@eslint-community/eslint-comments/require-description': ['error'],
        '@eslint-community/eslint-comments/disable-enable-pair': 'off',

        // Jest
        'jest/expect-expect': [
          'error',
          { assertFunctionNames: ['expect', 'expect[a-zA-Z]*?'] },
        ],
      },
    },
    {
      name: 'typescript-custom',
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/array-type': 'warn',
      },
    },
  ]
);
