import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteGeminiApiPlugin from './server/viteGeminiApiPlugin.js';

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: './',
  plugins: [
    react(),
    command === 'serve' ? viteGeminiApiPlugin() : null,
  ].filter(Boolean),
}));
