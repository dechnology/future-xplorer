module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  extends: ['@nuxtjs/eslint-config-typescript', 'plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    camelcase: ['error', { allow: ['fakerZH_TW'] }],
    'no-console': 'off',
    'no-unused-vars': 'off',
    'vue/multi-word-component-names': 'off',
    'no-useless-return': 'warn',
    'require-await': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: '^_' }],
  },
};
