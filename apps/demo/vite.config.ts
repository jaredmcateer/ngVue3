import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  root: "./",
  publicDir: "public",
  base: "",
  build: {
    minify: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        compositionExample: resolve(__dirname, "examples/composition-api/index.html"),
        optionsExample: resolve(__dirname, "examples/options-api/index.html"),
        setupExample: resolve(__dirname, "examples/script-setup/index.html"),
      },
    },
  },
});
