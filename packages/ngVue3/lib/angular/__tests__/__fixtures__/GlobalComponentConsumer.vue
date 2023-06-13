<script setup lang="ts">
import { ref } from "vue";
const name = ref("Jane");
</script>

<template>
  <my-global-component :name="name"></my-global-component>
</template>
