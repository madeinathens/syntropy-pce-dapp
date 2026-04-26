import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IPFS-ready: relative paths so the build works at any gateway
// (ipfs.io/ipfs/CID, dweb.link, ENS .limo, your own gateway)
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Group large libs separately for better caching across IPFS pins
        manualChunks: {
          'wagmi-vendor': ['wagmi', 'viem', '@tanstack/react-query'],
          'rainbow-vendor': ['@rainbow-me/rainbowkit'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
