import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";

const favaPath = process.env.FAVA_PATH ? resolve(process.env.FAVA_PATH) : null;

export default defineConfig({
  plugins: [svelte({ emitCss: false })],
  resolve: {
    alias: favaPath
      ? {
          "@fava": favaPath,
        }
      : {},
  },
  build: {
    outDir: resolve(__dirname, "../beancount_blue/importer/fava"),
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      formats: ["es"],
      fileName: () => "BankSync.js",
    },
    rollupOptions: {
      output: {
        entryFileNames: "BankSync.js",
      },
    },
  },
});
