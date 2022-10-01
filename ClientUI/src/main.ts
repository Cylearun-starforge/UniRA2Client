import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { getPlatform } from '@uni-ra2/client-runtime';

import './assets/main.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app').$nextTick(async () => {
  console.log('platform mode:', await getPlatform());
});
