import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteGroqApiPlugin from './server/viteGroqApiPlugin.js';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteGroqApiPlugin()],
});
