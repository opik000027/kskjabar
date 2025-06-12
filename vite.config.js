import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Konfigurasi server development jika diperlukan
  server: {
    // Port default untuk aplikasi Anda (misalnya 3000)
    port: 3000, 
    // Mengizinkan akses dari jaringan eksternal (penting untuk mobile testing di jaringan lokal)
    host: true 
  }
});
