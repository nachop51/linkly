import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { ThemeProvider } from './components/theme-provider.tsx'
import App from './app.tsx'
import './index.css'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './lib/auth/auth-provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)
