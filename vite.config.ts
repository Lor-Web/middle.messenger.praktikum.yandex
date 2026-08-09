import { defineConfig } from "vite";

import dotenv from "dotenv";

// используйте его. До этой строчки process.env не будет содержать указанных в .env переменных. После — будет
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: true,
    port: process.env.PORT || 8000,
  },
});
