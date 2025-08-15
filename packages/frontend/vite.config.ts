import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    commonjsOptions: {
      include: [/node_modules/, /packages\/shared/]
    }
  },
  resolve: {
    alias: {
      '@microfarm/shared': path.resolve(__dirname, '../shared/dist/index.js')
    }
  },
  optimizeDeps: {
    include: ['@microfarm/shared']
  }
});
