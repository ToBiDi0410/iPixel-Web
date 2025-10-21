import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);
app.config.globalProperties.window = window;
app.config.globalProperties.navigator = navigator;
app.mount("#app");