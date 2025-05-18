import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { FocusProvider } from "./components/focus-provider";
import KeyVisualizer from './components/key-vis.tsx';
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FocusProvider>
      <App />
    </FocusProvider>
    <KeyVisualizer />
    <Toaster />
  </StrictMode>,
)
