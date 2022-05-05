<template>
  <div>{{ salutation }}</div>
  <button v-if="isAdmin" @click="onButtonClicked">Click Me</button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    firstName: { type: String, default: "Not" },
    lastName: { type: String, default: "Sure" },
    isAdmin: { type: Boolean, default: false },
  },
  emits: ["button-clicked"],
  computed: {
    salutation(): string {
      const prefix = this.isAdmin ? "Hello," : "Welcome,";
      return `${prefix} ${this.firstName} ${this.lastName}`;
    },
  },
  methods: {
    onButtonClicked() {
      this.$emit("button-clicked");
    },
  },
});
</script>
