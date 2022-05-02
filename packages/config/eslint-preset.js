module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  settings: {
    next: {
      rootDir: ["apps/*/", "packages/*/"],
    },
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
};
