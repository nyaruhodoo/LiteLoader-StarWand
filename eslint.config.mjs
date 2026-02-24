import antfu from '@antfu/eslint-config'

const config = antfu({
  vue: true,
  typescript: true,
  formatters: {
    css: true,
    html: true,
    markdown: true,
  },
  rules: {
    'no-console': 'off',
    'node/prefer-global/buffer': 'off',
  },
})

export default config
