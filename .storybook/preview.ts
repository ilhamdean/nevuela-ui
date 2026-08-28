import { definePreview } from '@storybook/vue3-vite'
import addonDocs from '@storybook/addon-docs'
import addonThemes, { withThemeByClassName } from '@storybook/addon-themes'

// Self-hosted Inter (the extracted primary typeface) — loaded here so the docs
// environment matches production without a runtime CDN dependency.
import '@fontsource-variable/inter'

// Global design tokens + Tailwind layer, so every story renders with the
// Nevuela theme applied.
import '../src/style.css'

export default definePreview({
  addons: [addonDocs(), addonThemes()],

  // Apply the `autodocs` tag to every story so each component gets a generated
  // docs page from its argTypes.
  tags: ['autodocs'],

  // Adds the light/dark toolbar toggle. Applies `.dark` to <html>, matching the
  // `@custom-variant dark (&:is(.dark *))` selector in src/style.css.
  decorators: [
    withThemeByClassName({
      themes: { light: '', dark: 'dark' },
      defaultTheme: 'light',
    }),
  ],

  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'error' fails the a11y test run on violations; 'todo' surfaces them in
      // the UI without failing. This is an admin console — keep a11y visible.
      test: 'error',
    },
  },
})
