import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// CSS uses this flag to hide reveal-on-scroll text until it is split, never for reduced-motion users.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('motion-ok')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
