import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  publicDir: "Public",
  base: process.env.GITHUB_PAGES === "true" ? "/Precision-Engineering/" : "/",
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5142",
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
