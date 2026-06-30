import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base ("./") makes the built site work whether it's served from a
// custom domain (zenitglobal.co.za) or a GitHub Pages project sub-path
// (username.github.io/zenit-global/) without any extra config.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
