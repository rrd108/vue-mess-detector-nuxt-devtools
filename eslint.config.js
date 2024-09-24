// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

// Run `npx @eslint/config-inspector` to inspect the resolved config interactively
export default createConfigForNuxt({
  features: {
    // Rules for module authors
    tooling: true,
    // Rules for formatting
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
  .append(
    // Add the rule configuration here
    {
      rules: {
        'no-console': 'off',
        'no-debugger': 'off',
        'semi': ['error', 'never'],
        'eqeqeq': 'off',
        'eol-last': ['error', 'always'],
        'comma-dangle': ['error', 'always-multiline'], 'vue/multi-word-component-names': ['error', {
          ignores: ['index'],
        }],
        'vue/no-v-html': 'off',
      },
    },
  )
