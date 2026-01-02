import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  assetsInclude: ["**/*.html"],
  server: {
    host: "0.0.0.0",
    port: 1420,
    strictPort: true,
    origin: "http://127.0.0.1:1420",
    watch: {
      usePolling: true,
    },
    hmr: {
      protocol: "ws",
      host: "127.0.0.1",
      port: 1420,
      clientPort: 1420,
    },
  },
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    target: process.env.TAURI_PLATFORM ? "chrome105" : "esnext",
    minify: process.env.TAURI_DEBUG ? false : "esbuild",
    sourcemap: !!process.env.TAURI_DEBUG,
  },
});
