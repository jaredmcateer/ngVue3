import { reactive } from "vue";

export interface InstanceState {
  props: Record<string, unknown>;
  events: Record<string, unknown>;
  attrs: Record<string, unknown>;
}

const store: Record<symbol, InstanceState> = {};

export function getInstanceState(id: symbol) {
  if (!store[id]) {
    store[id] = {
      props: reactive({}),
      events: reactive({}),
      attrs: reactive({}),
    };

    return store[id];
  }
}
