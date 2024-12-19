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
