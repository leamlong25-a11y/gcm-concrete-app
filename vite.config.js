import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command }) => {
  return {
    plugins: [react(), tailwindcss()],
    // បើ Run Local (serve) គឺប្រើ '/' តែបើ Build គឺប្រើ '/gcm-concrete-app/'
    base: command === "serve" ? "/" : "/gcm-concrete-app/",
  };
});
