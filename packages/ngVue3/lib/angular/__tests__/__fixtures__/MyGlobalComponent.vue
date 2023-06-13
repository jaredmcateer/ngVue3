<script setup lang="ts">
defineProps<{ name: string }>();
</script>

<template>
  <div class="my-global-component">Hello {{ name }}!</div>
</template>
