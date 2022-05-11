<script setup lang="ts">
import { inject, computed } from "vue";
import { CustomNgVuePluginName } from "./NgVuePlugin";
const emit = defineEmits<(event: "button-clicked", val: number | undefined) => void>();
const foo = inject<number>("foo");
const plugin = inject<{ make: string; quantity: number; colour: string }>(CustomNgVuePluginName);
const helloFromVue = () => {
  console.warn("clicked");
  emit("button-clicked", foo);
};
const bar = computed(() =>
  plugin ? `${plugin.colour} ${plugin.make}: ${plugin.quantity}` : "No good"
);
</script>

<template>
  <button @click="helloFromVue()">{{ bar }}</button>
</template>
