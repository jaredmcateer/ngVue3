import { Plugin, reactive } from "vue";

interface GlobalStore {
  globalProperties: Record<string, unknown>;
  plugins: Plugin[];
}
export const globalStore: GlobalStore = {
  globalProperties: {},
  plugins: [],
};
