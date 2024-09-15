import 'reflect-metadata'
import { ObjectPlugin, createApp } from 'vue'
import './style.css'
// import './style.scss'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
// import persist from 'pinia-plugin-persistedstate'
// 通用字体
// import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'
import Vue3TouchEvents from 'vue3-touch-events'

/** Pinia */
const pinia = createPinia()
pinia.use(({ store }) => {
  store.$router = router
})
// pinia.use(persist)

const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(Vue3TouchEvents as ObjectPlugin)
app.mount('#app')

