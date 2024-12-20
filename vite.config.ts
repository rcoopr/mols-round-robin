import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  // @ts-expect-error unsure why types don't match
  plugins: [react(), tailwindcss()],
  test: {
    includeSource: ['src/**/*.{js,ts}'],
  },
});
