/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest/presets/js-with-ts-esm",
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
    "!**/__fixtures__/**",
  ],
  testPathIgnorePatterns: ["dist"],
  setupFilesAfterEnv: ["<rootDir>/test.setup.ts"],
  moduleFileExtensions: ["js", "json", "ts", "vue"],
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest",
    "^.+\\.[jt]sx?$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.test.json" }],
  },
};
