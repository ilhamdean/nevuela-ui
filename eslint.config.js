import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import prettier from '@vue/eslint-config-prettier'
import storybook from 'eslint-plugin-storybook'

export default defineConfigWithVueTs(
  {
    name: 'nevuela/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    name: 'nevuela/files-to-ignore',
    ignores: ['dist/**', 'storybook-static/**', 'node_modules/**', 'coverage/**'],
  },

  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  storybook.configs['flat/recommended'],

  {
    name: 'nevuela/component-library-overrides',
    rules: {
      // This is a design-system library: single-word component names
      // (Button, Modal, Avatar) are intentional and idiomatic.
      'vue/multi-word-component-names': 'off',
      // cva-driven props are intentionally optional — `undefined` is a valid
      // variant value that falls through to `defaultVariants`.
      'vue/require-default-prop': 'off',
    },
  },

  // Prettier compatibility must come last so it can turn off conflicting
  // stylistic rules.
  prettier,
)
