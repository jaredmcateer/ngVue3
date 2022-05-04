<template>
  <div>{{ salutation }}</div>
  <button v-if="isAdmin" @click="onButtonClicked">Click Me</button>
</template>

<script setup>
const props = defineProps({
  user: Object,
  isAdmin: Boolean,
});
const emit = defineEmits(["button-clicked"]);

const salutation = computed(() =>
  props.isAdmin ? "Hello," : "Welcome," + ` ${props.user.firstName} ${props.user.lastName}`
);

const onButtonClicked = () => emit("button-clicked");
</script>
