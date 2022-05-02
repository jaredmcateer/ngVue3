/// <reference types="vitest" />
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import {resolve} from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  test: {
    resolveSnapshotPath: (testPath, snapExtension) => testPath + snapExtension,
  },
  build: {
    lib: {
      entry: resolve(__dirname, "lib/main.js"),
      name: "ngVue3",
      fileName: (format) => `ngvue3.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue", "angular"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
