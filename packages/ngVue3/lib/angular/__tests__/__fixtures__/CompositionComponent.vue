<template>
  <div>{{ salutation }}</div>
  <button v-if="isAdmin" @click="onButtonClicked">Click Me</button>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  props: {
    firstName: { type: String, default: "Not" },
    lastName: { type: String, default: "Sure" },
    isAdmin: { type: Boolean, default: false },
  },
  emits: ["button-clicked"],
  setup(props, context) {
    const salutation = computed(() => {
      const prefix = props.isAdmin ? "Hello," : "Welcome,";
      return `${prefix} ${props.firstName} ${props.lastName}`;
    });

    const onButtonClicked = () => context.emit("button-clicked");

    return { salutation, onButtonClicked };
  },
});
</script>
