import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'
import prefixer from 'postcss-prefix-selector'

const APP_NAME = 'sub-vue3-b'
const SCOPE = `div[data-qiankun~="${APP_NAME}"]`

export default defineConfig({
  plugins: [
    vue(),
    qiankun(APP_NAME, { useDevMode: true }),
  ],
  css: {
    postcss: {
      plugins: [
        prefixer({
          prefix: SCOPE,
          transform(prefix, selector, prefixedSelector) {
            if (/^(html|:root|body)\b/.test(selector)) {
              return selector.replace(/^(html|:root|body)/, prefix)
            }
            return prefixedSelector
          },
        }),
      ],
    },
  },
  server: {
    port: 8083,
    cors: true,
    origin: 'http://localhost:8083',
  },
})
