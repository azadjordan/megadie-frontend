import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// No need to import tailwindcss here — it's configured in tailwind.config.js and postcss.config.js
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  },
});
