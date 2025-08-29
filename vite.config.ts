import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter} from '@tanstack/router-vite-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
    tanstackRouter({ target: 'react'})
  ],
  server: {
    host: true,  // necesario para que funcione bien en DevTunnel
    port: 5174,
  },
})
