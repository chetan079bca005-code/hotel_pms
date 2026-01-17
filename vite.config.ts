import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    strictPort: false, // Use next available port if 3000 is busy
    open: true, // Auto-open browser
    host: true, // Listen on all addresses including LAN
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  css: {
    postcss: './postcss.config.js',
  },
});
