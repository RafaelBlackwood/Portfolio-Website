import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const devOptimizerWorkaround = {
  disabled: 'dev',
  noDiscovery: true,
  include: [],
};

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  ...(command === 'serve' ? { optimizeDeps: devOptimizerWorkaround } : {}),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
}));
