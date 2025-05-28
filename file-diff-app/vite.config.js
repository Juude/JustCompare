import { defineConfig } from 'vite';

export default defineConfig({
  root: 'ui', // Set the root to the 'ui' directory
  build: {
    outDir: 'dist', // Output directory for the build
    emptyOutDir: true,
  },
  server: {
    port: 5173, // Default vite port
    strictPort: true, // Fail if port is already in use
  }
});
