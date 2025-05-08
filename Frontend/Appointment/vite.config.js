import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',  // Bind to localhost (can also use '0.0.0.0' for all interfaces)
    port: 3000,         // Ensure it uses the correct port
    open: true          // Automatically open the browser
  }
})
