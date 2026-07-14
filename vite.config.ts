import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev and preview both run on 5173 so the Playwright behaviour contract
// (playwright.config.js) points at one stable origin.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true },
  preview: { port: 5173, strictPort: true },
});
