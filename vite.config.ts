import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-vite-plugin'
import fs from 'node:fs'
import path from 'node:path'
import sitemap from '@axelrindle/vite-plugin-sitemap'

const ROUTES_DIR = path.resolve(__dirname, 'src/routes')

function collectRouteFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []

  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...collectRouteFiles(fullPath))
      continue
    }

    if (entry.isFile() && fullPath.endsWith('.tsx')) {
      files.push(fullPath)
    }
  }

  return files
}

function buildSitemapPages() {
  const routeFiles = collectRouteFiles(ROUTES_DIR)
  const routes = new Set<string>()

  for (const file of routeFiles) {
    const relative = path.relative(ROUTES_DIR, file)
    const withoutExt = relative.replace(/\.tsx$/, '')
    const normalized = withoutExt.replaceAll('\\', '/')

    // Remove route groups like (AboutUs), (Contacto), etc.
    const segments = normalized
      .split('/')
      .filter((segment) => segment !== '__root')
      .filter((segment) => !segment.startsWith('(') || !segment.endsWith(')'))

    if (segments.at(-1) === 'index') {
      segments.pop()
    }

    const route = segments.length === 0 ? '/' : `/${segments.join('/')}`
    routes.add(route)
  }

  return [...routes]
    .sort((a, b) => a.localeCompare(b))
    .map((route) => ({ file: 'index.html', route }))
}

function getManualChunk(id: string): string | undefined {
  if (!id.includes('node_modules')) return undefined

  if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) {
    return 'react-vendor'
  }

  if (id.includes('/@tanstack/')) {
    return 'tanstack-vendor'
  }

  if (id.includes('/framer-motion/') || id.includes('/lucide-react/')) {
    return 'motion-icons-vendor'
  }

  if (id.includes('/leaflet/')) {
    return 'maps-vendor'
  }

  if (
    id.includes('/zod/') ||
    id.includes('/react-hook-form/') ||
    id.includes('/@material-tailwind/') ||
    id.includes('/react-select/')
  ) {
    return 'forms-ui-vendor'
  }

  if (
    id.includes('/swiper/') ||
    id.includes('/react-slick/') ||
    id.includes('/slick-carousel/')
  ) {
    return 'carousel-vendor'
  }

  if (id.includes('/axios/') || id.includes('/date-fns/') || id.includes('/libphonenumber-js/')) {
    return 'utils-vendor'
  }

  return 'vendor'
}
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tanstackRouter({ target: 'react' }),
    sitemap({
      baseUrl: 'https://asadajuandiaz.com',
      pages: buildSitemapPages(),
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5174,
  },
  build: {
    outDir: 'dist', // importante para Cloudflare
    rollupOptions: {
      output: {
        manualChunks: getManualChunk,
      },
    },
  },
})
