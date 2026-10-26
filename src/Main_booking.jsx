import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Booking from './Booking.jsx'
import Nda from './Booking_nda.jsx'

createRoot(document.getElementById('toor')).render(
  <StrictMode>
    <Booking />
  </StrictMode>,
) 