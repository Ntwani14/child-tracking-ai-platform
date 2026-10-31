import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  // Allow the deployed host (e.g. Railway) to serve the preview build
  preview: {
    port: Number(process.env.PORT) || 4173,
    host: true,
    allowedHosts: true,
  },
});