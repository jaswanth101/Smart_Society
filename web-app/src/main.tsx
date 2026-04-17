import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.tsx'

// ─────────────────────────────────────────────────────────
// Entry point — mounts React into #root.
// globals.css must be imported first (design system tokens).
// ─────────────────────────────────────────────────────────

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('[SmartSociety 360] Root element #root not found in DOM.')

console.log('MOUNTING REACT APP...');
try {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} catch (err) {
  console.error("REACT CRASHED:", err);
}
