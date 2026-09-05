import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

/**
 * `hydrateRoot`, no `createRoot`: el HTML de `#root` ya viene renderizado
 * desde `scripts/prerender.ts`, y montar de cero lo descartaría entero.
 */
hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <App />
  </StrictMode>,
);
