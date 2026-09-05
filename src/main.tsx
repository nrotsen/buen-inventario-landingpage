import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { inject, track as vercelTrack } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';
import './index.css';
import App from './App.tsx';
import { configureAnalyticsSink } from '@/lib/analytics';

/**
 * Único punto del repo que conoce al proveedor de analytics. Todo lo
 * demás llama `track()` del adapter — ver `src/lib/analytics.ts`.
 */
inject();
injectSpeedInsights();
configureAnalyticsSink((event, props) => vercelTrack(event, props));

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
