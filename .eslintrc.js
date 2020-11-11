module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: ['prettier', 'plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': 'warn',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
      },
      plugins: ['eslint-plugin-react', '@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'no-console': 'off',
        'react/jsx-boolean-value': 'off',
        'react/jsx-key': 'error',
        'react/jsx-no-bind': 'off',
        'react/jsx-wrap-multilines': 'off',
      },
    },
  ],
};
