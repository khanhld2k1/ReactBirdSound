import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import globPlugin from 'vite-plugin-glob';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), globPlugin()],
})