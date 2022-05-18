import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import typescriptPlugin from "@rollup/plugin-typescript";
import { resolve } from "path";

const resolvePath = (str: string) => resolve(__dirname, str);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolvePath("lib/main.ts"),
      name: "ngVue3",
      formats: ["es", "umd", "cjs"],
      fileName: (format) => {
        switch (format) {
          case "umd":
            return `main.js`;
          case "es":
            return `main.mjs`;
          case "cjs":
            return `main.cjs`;
        }
      },
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue", "angular"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          ngVue3: "ngVue3",
          vue: "Vue",
          angular: "angular",
        },
        sourcemap: true,
      },
      plugins: [
        typescriptPlugin({
          tsconfig: resolvePath("tsconfig.json"),
          declaration: true,
          declarationDir: resolvePath("dist"),
          exclude: resolvePath("node_modules/**"),
          allowSyntheticDefaultImports: true,
          sourceMap: true,
        }),
      ],
    },
  },
});
