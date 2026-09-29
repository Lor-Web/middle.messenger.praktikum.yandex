import dotenv from 'dotenv';
import { defineConfig } from 'vitest/config';

// используйте его. До этой строчки process.env не будет содержать указанных в .env переменных. После — будет
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  root: './src',
  publicDir: '../public',
  resolve: {
    tsconfigPaths: true, // Включает автоматическое чтение путей из tsconfig.json
  },
  server: {
    open: true,
    port: Number(process.env.PORT) || 3000,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  test: {
    environment: 'happy-dom',
    include: ['**/*.test.ts'],
  },
});
