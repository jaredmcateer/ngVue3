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

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    firstName: String,
    lastName: String,
    description: String,
  },
  emits: ["update-description"],
  methods: {
    onButtonClick() {
      this.$emit("update-description", this.description.toUpperCase());
    },
  },
});
</script>
