import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { createPinia } from 'pinia'
import router from './router'
import { Vue3Mq } from "vue3-mq";

loadFonts()

createApp(App).use(createPinia())
  .use(vuetify)
  .use(router)
  .use(Vue3Mq, { preset: 'vuetify'})
  .mount('#app')
