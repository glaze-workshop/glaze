module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'plugin:react/recommended',
    'standard'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'react',
    '@typescript-eslint'
  ],
  rules: {
    'no-use-before-define': 0,
    'no-unused-vars': 0,
    semi: 'off',
    '@typescript-eslint/semi': ['error', 'never'],
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: {
        delimiter: 'none' // 'none' or 'semi' or 'comma'
      },
      singleline: {
        delimiter: 'semi' // 'semi' or 'comma'
      }
    }],
    'spaced-comment': ['error', 'always', {
      line: {
        markers: ['#region', '#endregion', 'region', 'endregion']
      }
    }],
    'react/jsx-indent': [2, 2]
  }
}
