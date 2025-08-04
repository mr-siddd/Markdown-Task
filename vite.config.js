import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist/renderer',
    rollupOptions: {
      input: './public/index.html'  // Explicitly set the entry point
    }
  },
  server: {
    port: 5173
  }
});
