import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { FocusProvider } from "./components/focus-provider";
import KeyVisualizer from './components/key-vis.tsx';
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from './components/theme-provider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FocusProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </FocusProvider>
    <KeyVisualizer />
    <Toaster />
  </StrictMode>,
)
