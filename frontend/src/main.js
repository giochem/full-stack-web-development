import "./assets/main.css";
import "remixicon/fonts/remixicon.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { notification } from "./plugins/notification";

const app = createApp(App);
const pinia = createPinia();

app.use(notification);
app.use(pinia);
app.use(router);

app.mount("#app");
