import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/tokens.css';
import './styles/base.css';
import './styles/home.css';
import './styles/case.css';
import './styles/hire.css';

// The build prerenders every page (vite-plugin-seo.ts), so the browser takes over that HTML. In dev the root is empty.
// The tree must match src/entry-server.tsx.
const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
