import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import vue from "@vitejs/plugin-vue";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = __dirname;

function htmlInputs() {
  const inputs = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.name === "node_modules" || entry.name === "dist") continue;
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(fullPath);
      else if (entry.isFile() && entry.name.endsWith(".html")) inputs.push(fullPath);
    }
  };
  inputs.push(path.join(rootDir, "index.html"));
  visit(path.join(rootDir, "en", "pdf-tools"));
  return inputs;
}

function copyStaticAssets() {
  return {
    name: "copy-static-assets",
    generateBundle() {
      const assetsRoot = path.join(rootDir, "images");
      const visit = (directory) => {
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
          const fullPath = path.join(directory, entry.name);
          if (entry.isDirectory()) visit(fullPath);
          else if (entry.isFile()) {
            this.emitFile({
              type: "asset",
              fileName: path.relative(rootDir, fullPath).replace(/\\/g, "/"),
              source: fs.readFileSync(fullPath),
            });
          }
        }
      };
      visit(assetsRoot);
    },
  };
}

export default defineConfig({
  root: ".",
  appType: "mpa",
  server: {
    port: 3000,
    open: false,
    watch: {
      ignored: ["**/node_modules/**", "**/.git/**", "**/dist/**"],
    },
  },
  plugins: [
    vue(),
    copyStaticAssets(),
    {
      name: "watch-vue-assets",
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
  build: {
    rollupOptions: {
      input: htmlInputs(),
    },
  },
});
