import { reactive } from "vue";

export interface InstanceState {
  props: Record<string, unknown>;
  attrs: Record<string, unknown>;
  special: Record<string, unknown>;
}

const store: Record<symbol, InstanceState> = {};

export function getInstanceState(id: symbol) {
  if (!store[id]) {
    store[id] = {
      props: reactive({}),
      attrs: reactive({}),
      special: reactive({}),
    };

    return store[id];
  }
}
