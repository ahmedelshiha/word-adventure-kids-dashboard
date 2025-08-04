import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Only add aliases if you're changing the path or using custom structure
      // Example (if needed): '@/components': '/src/components'
    }
  }
});
