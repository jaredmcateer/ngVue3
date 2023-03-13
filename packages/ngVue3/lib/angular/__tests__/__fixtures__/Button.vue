<script setup lang="ts">
import { inject, computed } from "vue";
import { CustomNgVuePluginName } from "./NgVuePlugin";
import { MyServiceKey } from "./MyService";
const emit = defineEmits<(event: "button-clicked", val: number) => void>();
const foo = inject<number>("foo");
const addOne = inject(MyServiceKey);
if (!foo || !addOne) {
  throw new Error("Missing dependencies");
}
const plugin = inject<{ make: string; quantity: number; colour: string }>(CustomNgVuePluginName);
const helloFromVue = () => {
  console.warn("clicked");
  emit("button-clicked", addOne(foo));
};
const bar = computed(() =>
  plugin ? `${plugin.colour} ${plugin.make}: ${plugin.quantity}` : "No good"
);
</script>

<template>
  <button @click="helloFromVue()">{{ bar }}</button>
</template>
