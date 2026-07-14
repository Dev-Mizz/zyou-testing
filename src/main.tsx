import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'

const root = document.getElementById('root')!

const app = (
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)

/**
 * Conditional hydration — T2 requirement.
 * When Playwright has pre-rendered the page, the #root div already has
 * child nodes. Using hydrateRoot in that case attaches React to the
 * existing DOM without wiping it (no flash of blank content).
 * In dev mode (vite dev) the div is empty, so we fall back to createRoot.
 */
if (root.hasChildNodes()) {
  ReactDOM.hydrateRoot(root, app)
} else {
  ReactDOM.createRoot(root).render(app)
}
