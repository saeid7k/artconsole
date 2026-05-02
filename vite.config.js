import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/js/app.tsx', 'resources/css/app.css'],
      refresh: true,
    }),
    react(),
    tailwindcss()
  ],
  assetsInclude: [
    '**/*.lottie'
  ],
  server: {
    watch: {
      ignored: ['**/*.php'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'resources/js'),
      '~': path.resolve(__dirname),
      '@css': path.resolve(__dirname, 'resources/css'),
      '@images': path.resolve(__dirname, 'resources/images'),
      '@animations': path.resolve(__dirname, 'resources/animations'),
    }
  }
});
