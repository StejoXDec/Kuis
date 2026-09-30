import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { loadEnv } from "./api/env.js";

loadEnv();

// Mounts POST /api/generate on the dev server so `npm run dev` alone works.
// Set ANTHROPIC_API_KEY in your shell or in .env before starting.
const apiPlugin = () => ({
  name: "kuis-api",
  configureServer(server) {
    server.middlewares.use("/api/generate", async (req, res) => {
      const { handleGenerate } = await import("./api/generate.js");
      await handleGenerate(req, res);
    });
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), apiPlugin()],
});
