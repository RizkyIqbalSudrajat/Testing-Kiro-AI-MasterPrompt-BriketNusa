// Ensure window.fetch is writable and has setter in sandboxed iframe environments
try {
  const origFetch = window.fetch;
  let curFetch = typeof origFetch === 'function' ? origFetch.bind(window) : origFetch;
  const desc = {
    get: () => curFetch,
    set: (v: typeof window.fetch) => {
      curFetch = v;
    },
    configurable: true,
    enumerable: true,
  };
  Object.defineProperty(window, 'fetch', desc);
  if (typeof Window !== 'undefined' && Window.prototype) {
    try {
      Object.defineProperty(Window.prototype, 'fetch', desc);
    } catch {}
  }
} catch {}

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
