import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import { ViteMinifyPlugin } from 'vite-plugin-minify';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // @ts-expect-error why?
    crx({ manifest }),
    ViteMinifyPlugin()
  ],
  build: {
    cssCodeSplit: false,
    minify: "terser",
    terserOptions: {
      parse: {
        html5_comments: false,
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      external: [
        "./backend/**"
      ]
    }
  }
})
