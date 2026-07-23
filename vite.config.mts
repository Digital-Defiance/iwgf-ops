import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const tauriBuild = Boolean(process.env.TAURI_ENV_PLATFORM);

export default defineConfig({
  root: import.meta.dirname,
  base: tauriBuild ? './' : '/',
  envDir: import.meta.dirname,
  envPrefix: ['VITE_', 'TAURI_ENV_'],
  cacheDir: 'node_modules/.vite',
  plugins: [react()],
  server: {
    port: 4220,
    host: 'localhost',
    strictPort: true,
  },
  preview: {
    port: 4320,
    host: 'localhost',
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
