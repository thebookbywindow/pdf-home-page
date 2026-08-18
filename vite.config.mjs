import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: ".",
  server: {
    port: 3000,
    open: false,
    watch: {
      ignored: ["**/node_modules/**", "**/.git/**", "**/dist/**"],
    },
  },
  plugins: [
    {
      name: "watch-tool-templates",
      handleHotUpdate({ file, server }) {
        if (file.endsWith(".html") || file.endsWith(".css") || file.endsWith(".js")) {
          server.ws.send({
            type: "full-reload",
            path: "*",
          });
        }
      },
    },
  ],
});
