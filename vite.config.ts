import { fileURLToPath, URL } from "url"
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from "vite-plugin-singlefile"

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), viteSingleFile()],

  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      { find: '@appsscript', replacement: fileURLToPath(new URL('./src/appsscript', import.meta.url)) },
      { find: '@components', replacement: fileURLToPath(new URL('./src/components', import.meta.url)) },
      { find: '@functions', replacement: fileURLToPath(new URL('./src/functions', import.meta.url)) },
      { find: '@layouts', replacement: fileURLToPath(new URL('./src/layouts', import.meta.url)) },
      { find: '@stores', replacement: fileURLToPath(new URL('./src/stores', import.meta.url)) }
    ],
    extensions: [ '.js', '.json', '.ts', '.vue' ]
  },

  build: {
    emptyOutDir: false,
    outDir: './src/appsscript',
    minify: false,
    terserOptions: {
      compress: false,
      mangle: false
    }
  }
})
