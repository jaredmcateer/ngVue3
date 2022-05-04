<template>
  <div>{{ salutation }}</div>
  <button v-if="isAdmin" @click="onButtonClicked">Click Me</button>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    user: Object,
    isAdmin: Boolean,
  },
  emits: ["button-clicked"],
  setup(props, context) {
    const salutation = computed(() =>
      props.isAdmin ? "Hello," : "Welcome," + ` ${props.firstName} ${props.lastName}`
    );

    const onButtonClicked = () => context.emit("button-clicked");

    return { salutation, onButtonClicked };
  },
});
</script>
