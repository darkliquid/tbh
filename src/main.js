import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { createPinia } from 'pinia'
import router from './router'

loadFonts()

createApp(App).use(createPinia())
  .use(vuetify)
  .use(router)
  .mount('#app')
