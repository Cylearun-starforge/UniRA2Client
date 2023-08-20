import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { registerShortcuts } from "@/util/register-shortcuts";
import '@cylearun/components/style.css'

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
