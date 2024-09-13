module.exports = {
  extends: ['eslint:recommended', '@electron-toolkit/eslint-config-ts/recommended', 'prettier'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/consistent-type-imports': 'error'
  }
}
