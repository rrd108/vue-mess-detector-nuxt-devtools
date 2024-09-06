import antfu from '@antfu/eslint-config'

export default antfu({},
  {
    rules: {
      // allow console and debugger
      'no-console': 'off',
      'no-debugger': 'off',
      // ignore top-level functions should be declared with function keywordes
      'antfu/top-level-function': 'off',
      'style/semi': ['error', 'never'],
      'eqeqeq': 'off',
      'eol-last': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
    },
    features: {
      tooling: true,
      stylistic: true,
    },
    dirs: {
      root: [
        '',
        'playground',
        'client',
      ],
    },
  })
