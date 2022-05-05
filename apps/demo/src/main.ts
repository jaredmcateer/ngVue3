import { createApp } from "vue";
import App from "./App.vue";
import "highlight.js/styles/github.css";
import "highlight.js/lib/common";
import hljsVuePlugin from "@highlightjs/vue-plugin";

const app = createApp(App);
app.use(hljsVuePlugin);
app.mount("#app");
