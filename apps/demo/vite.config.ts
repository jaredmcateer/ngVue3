import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

const resolvePath = (path: string) => resolve(__dirname, path);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  root: "./",
  publicDir: "public",
  base: "/ngVue3/",
  build: {
    minify: false,
    rollupOptions: {
      input: {
        main: resolvePath("index.html"),
        compositionExample: resolvePath("examples/composition-api/index.html"),
        optionsExample: resolvePath("examples/options-api/index.html"),
        setupExample: resolvePath("examples/script-setup/index.html"),
        umdExample: resolvePath("examples/umd/index.html"),
      },
    },
  },
});
