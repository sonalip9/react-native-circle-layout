module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    '@react-native-community',
    'airbnb',
    'airbnb/hooks',
    'plugin:react-hooks/recommended',
    'eslint:recommended',
    'plugin:react-native/all',
    'plugin:import/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'react'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: './',
      },
      plugins: ['@typescript-eslint', 'import-alias', 'react', 'react-native'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
      },
    },
  ],
  rules: {
    // React hooks
    'react-hooks/exhaustive-deps': 'warn',

    // React
    'react/function-component-definition': [
      'error',
      { namedComponents: 'arrow-function' },
    ],
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
    'react/jsx-sort-props': [
      'error',
      {
        noSortAlphabetically: false,
      },
    ],

    // React native
    'react-native/no-color-literals': 'off',

    // Prettier
    'prettier/prettier': [
      'error',
      {
        quoteProps: 'consistent',
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5',
        useTabs: false,
      },
    ],

    // Import
    'import/prefer-default-export': 'off',
    'import/extensions': [
      'error',
      'never',
      {
        svg: 'always',
        json: 'always',
      },
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
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {},
    },
  },
};
