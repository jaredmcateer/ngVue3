import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import fs from "fs";

const resolvePath = (path: string) => resolve(__dirname, path);
const log = (msg: string) => console.log("\x1b[36m%s\x1b[0m", msg);

function copyFileTo(file: string, dir: string) {
  const from = resolvePath(dir);
  const to = resolvePath(`dist/${dir}`);
  return {
    name: "copy-node-module-files",
    generateBundle() {
      if (!fs.existsSync(to)) {
        log(`making directory: ${to}`);
        fs.mkdirSync(to, { recursive: true });
      }

      const src = `${from}/${file}`;
      const dst = `${to}/${file}`;

      log(`copy files: ${src} -> ${dst}`);
      fs.copyFileSync(src, dst);
    },
  };
}
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
      plugins: [
        copyFileTo("main.js", "node_modules/@jaredmcateer/ngvue3/dist/"),
        copyFileTo("angular.min.js", "node_modules/angular/"),
        copyFileTo("vue.global.js", "node_modules/vue/dist/"),
      ],
    },
  },
});
