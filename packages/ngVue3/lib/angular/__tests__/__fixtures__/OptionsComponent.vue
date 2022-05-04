<template>
  <div>{{ salutation }}</div>
  <button v-if="isAdmin" @click="onButtonClicked">Click Me</button>
</template>

<script>
export default {
  props: {
    user: Object,
    isAdmin: Boolean,
  },
  emits: ["button-clicked"],
  computed: {
    salutation: () => {
      return this.isAdmin ? "Hello," : "Welcome," + ` ${this.user.firstName} ${this.user.lastName}`;
    },
  },
  methods: {
    onButtonClicked() {
      this.$emit("button-clicked");
    },
  },
};
</script>
