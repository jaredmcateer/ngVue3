import { reactive } from "vue";

/**
 * Object in InstanceState that has been proxied by Vue's reactive function
 */
export type InstanceStateObj = Record<string, unknown>;

export interface InstanceState {
  props: InstanceStateObj;
  attrs: InstanceStateObj;
  special: InstanceStateObj;
}

const store: Record<symbol, InstanceState> = {};

export function getInstanceState(id: symbol) {
  if (!store[id]) {
    store[id] = {
      props: reactive({}),
      attrs: reactive({}),
      special: reactive({}),
    };
  }

  return store[id];
}

export function clearInstanceState(id: symbol) {
  delete store[id];
}
