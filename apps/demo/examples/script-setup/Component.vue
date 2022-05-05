<template>
  <div>
    <span> Hi, {{ firstName }} {{ lastName }} </span>
    <p>{{ description }}</p>
  </div>
  <div v-bind="$attrs">
    <p><a href="https://vuejs.org/guide/overview.html">Vue.js</a></p>
    <button @click="onButtonClick()">Update description from Vue</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  firstName: string;
  lastName: string;
  description: string;
}>();

const emit = defineEmits<{ (event: "update-description", description: string): void }>();

const onButtonClick = () => {
  emit("update-description", props.description.toUpperCase());
};
</script>
