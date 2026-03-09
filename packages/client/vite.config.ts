import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import VueRouter from 'unplugin-vue-router/vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => ({
  base: process.env.BASE_PATH || '/',
  plugins: [
    VueRouter({
      routesFolder: 'src/views',
    }),
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  ...(mode === 'development'
    ? {
        server: {
          proxy: {
            '/graphql': {
              target: 'http://localhost:3000',
            },
          },
        },
      }
    : {}),
}))
