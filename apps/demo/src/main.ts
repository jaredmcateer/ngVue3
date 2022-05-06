import { createApp } from "vue";
import VueHighlightJs from "vue3-highlightjs";
import "highlight.js/styles/foundation.css";
import App from "./App.vue";

const app = createApp(App);
app.use(VueHighlightJs);
app.mount("#app");
