/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { chunkName, seo } from './vite-plugin-seo';

export default defineConfig({
  plugins: [react(), seo()],
  build: { rollupOptions: { output: { chunkFileNames: chunk => chunkName(chunk.facadeModuleId) } } },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: false,
  },
});
