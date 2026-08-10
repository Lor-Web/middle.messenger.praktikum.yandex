import { defineConfig } from "vite";

import dotenv from "dotenv";

// используйте его. До этой строчки process.env не будет содержать указанных в .env переменных. После — будет
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  root: "./src",
  publicDir: "../public",
  server: {
    open: true,
    port: process.env.PORT || 3000,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Uses the faster, modern Sass compiler API
        api: "modern-compiler",
      },
    },
  },
  build: {
    outDir: "../dist",
  },
});
