import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// Library build: emits an ESM bundle + a single stylesheet (nevuela.css).
// Type declarations are produced separately by `vue-tsc` (see `build:types`).
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    copyPublicDir: false,
    cssCodeSplit: false,
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      // Keep peers/runtime deps external — consumers install them.
      external: [
        'vue',
        /^reka-ui/,
        '@lucide/vue',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
        /^echarts/,
        'vue-echarts',
        'tw-animate-css',
      ],
      output: {
        assetFileNames: (asset) =>
          asset.names?.some((n) => n.endsWith('.css')) ? 'nevuela.css' : 'assets/[name][extname]',
      },
    },
  },
})
