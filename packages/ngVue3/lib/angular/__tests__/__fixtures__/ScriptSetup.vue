<template>
  <div>{{ salutation }}</div>
  <button v-if="isAdmin" @click="onButtonClicked">Click Me</button>
</template>

<script setup lang="ts">
import { computed, PropType } from "vue";

const props = defineProps({
  firstName: { type: String, default: "Not" },
  lastName: { type: String, default: "Sure" },
  isAdmin: { type: Boolean, default: false },
});
const emit = defineEmits(["button-clicked"]);

const salutation = computed(() => {
  const prefix = props.isAdmin ? "Hello," : "Welcome,";
  return `${prefix} ${props.firstName} ${props.lastName}`;
});

const onButtonClicked = () => emit("button-clicked");
</script>
