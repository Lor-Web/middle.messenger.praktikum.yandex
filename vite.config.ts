import { defineConfig } from "vite";

import dotenv from "dotenv";

// используйте его. До этой строчки process.env не будет содержать указанных в .env переменных. После — будет
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  root: "./src",
  server: {
    open: true,
    port: process.env.PORT || 8000,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Uses the faster, modern Sass compiler API
        api: "modern-compiler",
        // Automatically injects global files into all components (Vue/Svelte/etc.)
        additionalData: `@use "./_variables.scss" as *;`,
        // Allows you to use shorter absolute import paths inside SCSS files
        loadPaths: ["./styles"],
      },
    },
  },
});
