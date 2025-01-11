import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Popup from './Popup.tsx'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/500.css'
import '@fontsource/manrope/600.css'
import '@fontsource/manrope/700.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import './index.scss'

createRoot(document.getElementById('luckit_app')!).render(
    <StrictMode>
        <Popup />
    </StrictMode>,
)
