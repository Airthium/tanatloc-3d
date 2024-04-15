import js from '@eslint/js'

export default [
  js.configs.recommended,
  {
    ignores: ['config/*', 'coverage/*', 'dist/*', 'docs/*']
  }
]
