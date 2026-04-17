import { RouterProvider } from 'react-router-dom'
import { router } from './router'

// ─────────────────────────────────────────────────────────
// App root — mounts the router. All providers should wrap here
// (e.g., ThemeProvider, QueryClient, ToastProvider)
// ─────────────────────────────────────────────────────────

export default function App() {
  return <RouterProvider router={router} />
}
