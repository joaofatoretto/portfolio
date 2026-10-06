/* Build-time render: vite-plugin-seo.ts builds this for Node and writes one HTML file per page in seo/meta.ts's PAGES. */
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';

/** The app's HTML at `path`, the same tree main.tsx hydrates. */
export function render(path: string): string {
  return renderToString(<StrictMode><StaticRouter location={path}><App /></StaticRouter></StrictMode>);
}
