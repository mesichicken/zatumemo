import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  resolve: {
    alias: {
      '@renderer': resolve(__dirname, 'src/renderer/src')
    }
  },
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom'
  }
});
