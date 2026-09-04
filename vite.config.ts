import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path' // You can delete this line or leave it

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        admin: './admin.html',
      },
    },
  },
})
