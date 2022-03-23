module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [],
  rules: {
    'operator-linebreak': 'off',
    camelcase: 0,
    'no-use-before-define': 0,
    'no-unused-vars': 0,
    'spaced-comment': [
      'error',
      'always',
      {
        line: {
          markers: ['#region', '#endregion', 'region', 'endregion'],
        },
      },
    ],

    'no-useless-constructor': 0,
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'node/no-callback-literal': 'off',

    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
}
