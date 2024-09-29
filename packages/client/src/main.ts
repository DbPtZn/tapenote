import 'reflect-metadata'
import { ObjectPlugin, createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
// import persist from 'pinia-plugin-persistedstate'
// 等宽字体
// import 'virtual:uno.css'
import 'vfonts/FiraCode.css'
import Vue3TouchEvents from 'vue3-touch-events'
import { createI18n } from 'vue-i18n'

import zh from './assets/locales/zh.ts'
import en from './assets/locales/en.ts'
import ja from './assets/locales/ja.ts'

/** Pinia */
const pinia = createPinia()
pinia.use(({ store }) => {
  store.$router = router
})
// pinia.use(persist)

const app = createApp(App)

/** i18n */
const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'zh',
  messages: {
    zh,
    en,
    ja
  }
})

app.use(router)
app.use(pinia)
app.use(i18n)
app.use(Vue3TouchEvents as ObjectPlugin)
app.mount('#app')

