import "./assets/main.css";
import "remixicon/fonts/remixicon.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { notification } from "./plugins/notification";
import i18n from "./i18n";

const pinia = createPinia();

const app = createApp(App);

app.use(i18n);
app.use(notification);
app.use(pinia);
app.use(router);

app.mount("#app");
