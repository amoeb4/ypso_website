import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LogAdmin from './LogAdmin.jsx'

createRoot(document.getElementById('tooor')).render(
  <StrictMode>
    <LogAdmin />
  </StrictMode>,
)
