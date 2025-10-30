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
  },
})

export default config
