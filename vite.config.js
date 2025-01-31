import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8080,  // Definindo a porta 8080
    allowedHosts: ['diogo.paynbox.com'],  // Permitindo esse host
  }
})
