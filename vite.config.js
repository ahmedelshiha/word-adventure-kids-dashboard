import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react( )],
  resolve: {
    alias: {
      'react-router-dom': 'react-router-dom',
      'lucide-react': 'lucide-react',
      '@radix-ui/react-progress': '@radix-ui/react-progress' // Add this line
    }
  }
})
