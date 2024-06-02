import eslint from '@eslint/js';
import comments from 'eslint-plugin-eslint-comments';
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import airbnb from 'eslint-config-airbnb';
import airbnbHooks from 'eslint-config-airbnb/hooks';
import importConfig from 'eslint-plugin-import';
import importAlias from 'eslint-plugin-import-alias';
import prettier from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import rn from 'eslint-plugin-react-native';
import ts from 'typescript-eslint';

const flatCompat = new FlatCompat();

const addNameToEachConfig = (name, configs) =>
  configs.map((conf) => ({
    ...conf,
    name: [conf.name, name].filter(Boolean).join('-'),
  }));

const airbnbFix = addNameToEachConfig(
  'airbnb',
  fixupConfigRules(flatCompat.config(airbnb))
);
const airbnbHooksFix = addNameToEachConfig(
  'airbnb-hooks',
  fixupConfigRules(flatCompat.config(airbnbHooks.rules))
);

const reactFix = addNameToEachConfig(
  'react',
  fixupConfigRules(...flatCompat.config(react.configs.recommended))
);
const reactHooksFix = addNameToEachConfig(
  'react-hook',
  fixupConfigRules(...flatCompat.config(reactHooks.configs.recommended))
);

const rnFix = addNameToEachConfig(
  'react-native',
  fixupConfigRules(flatCompat.config(rn.configs.all))
);

const importFix = addNameToEachConfig(
  'imports',
  fixupConfigRules(flatCompat.config(importConfig.configs.recommended))
);

const commentsFix = addNameToEachConfig(
  'comments',
  fixupConfigRules(flatCompat.config(comments.configs.recommended))
);

const tsConfig = addNameToEachConfig(
  'typescript-custom',
  ts.config(
    ...ts.configs.recommended,
    eslint.configs.recommended,
    ...ts.configs.recommendedTypeChecked,
    {
      languageOptions: {
        parserOptions: {
          project: './tsconfig.json',
          tsconfigRootDir: './',
        },
      },
    }
  )
);

export default [
  {
    name: 'files-ignore',
    ignores: [
      'lib/**',
      '**/*.d.ts',
      '**/*.test.ts(x)?',
      '**/*.config.js',
      'scripts/**',
      '*.config.mjs',
    ],
  },
  ...reactFix,
  ...reactHooksFix,
  ...rnFix,
  ...importFix,
  ...tsConfig,
  ...commentsFix,
  ...airbnbFix,
  ...airbnbHooksFix,
  { ...prettier, name: 'prettier' },
  {
    name: 'global-custom',
    plugins: {
      'import-alias': fixupPluginRules(importAlias),
    },
    rules: {
      'implicit-arrow-linebreak': 'off',

      // React - rules from `eslint-plugin-react`
      'react/function-component-definition': [
        'error',
        { namedComponents: 'arrow-function' },
      ],
      'react/jsx-filename-extension': [
        'error',
        { extensions: ['.tsx', '.jsx'] },
      ],
      'react/jsx-key': 'error',
      'react/jsx-sort-props': ['error', { noSortAlphabetically: false }],

      // React native - rules from `eslint-plugin-react-native`
      'react-native/no-color-literals': 'off',
      'react-native/no-inline-styles': 'warn',

      // Import
      'import/prefer-default-export': 'off',
      'import/extensions': [
        'error',
        'never',
        { svg: 'always', json: 'always' },
      ],
      'import/order': ['error', { 'newlines-between': 'always' }],
      'import/no-extraneous-dependencies': 'off',

      // Import alias
      'import-alias/import-alias': [
        'error',
        {
          relativeDepth: 2,
          aliases: [{ alias: 'react-native-circle-layout', matcher: './src' }],
        },
      ],

      // Comments
      'eslint-comments/require-description': ['error'],
      'eslint-comments/disable-enable-pair': 'off',
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        typescript: {},
      },
    },
  },
  {
    name: 'typescript-custom',
    // files: ['*.ts', '*.tsx'],
    rules: {
      '@typescript-eslint/no-shadow': ['error'],
      'no-shadow': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/array-type': 'warn',
    },
  },
];
