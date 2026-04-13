import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { routeTree } from './routeTree.gen';
import { QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {  RouterProvider, createRouter } from '@tanstack/react-router'
import { AlertProvider } from './context/AlertContext';

const warmUpApiConnection = () => {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  if (connection?.saveData) return

  // Fire a lightweight opaque request so the browser actually uses the preconnected origin.
  void fetch('https://api.asadajuandiaz.com/api/faq/', {
    method: 'GET',
    mode: 'no-cors',
    cache: 'no-store',
    keepalive: true,
  }).catch(() => undefined)
}

const idleCallback = (
  globalThis as typeof globalThis & {
    requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
  }
).requestIdleCallback

if (globalThis.window !== undefined) {
  if (typeof idleCallback === 'function') {
    idleCallback(warmUpApiConnection, { timeout: 3000 })
  } else {
    globalThis.setTimeout(warmUpApiConnection, 1500)
  }
}

const router = createRouter({ routeTree })
const queryClient = new QueryClient()
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
        <AlertProvider>
          <RouterProvider router={router} />
        </AlertProvider>
    </QueryClientProvider>
  </StrictMode>,
)


