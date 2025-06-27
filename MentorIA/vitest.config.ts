import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // use a DOM-like environment without needing extra deps
    environment: 'happy-dom',
  },
});
