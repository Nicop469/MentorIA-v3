// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // Simula un DOM real para que los Hooks funcionen
    environment: 'jsdom',
    // Permite usar describe/it/expect sin importarlos
    globals: true,
    // Carga tu setup para mocks antes de los tests
    setupFiles: ['./src/setupTests.ts'],
    // Asegura que Vitest transforme los archivos .ts/.tsx con el entorno web
    transformMode: {
      web: [/\.[jt]sx?$/],
    },
  },
});
