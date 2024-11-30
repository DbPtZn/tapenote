import 'reflect-metadata'
import { ObjectPlugin, createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
// import persist from 'pinia-plugin-persistedstate'
// 等宽字体
// import 'virtual:uno.css'
// import 'vfonts/FiraCode.css'
// import Vue3TouchEvents from 'vue3-touch-events'
import { createI18n } from 'vue-i18n'
import { VueReCaptcha } from 'vue-recaptcha-v3'
import { zh, en, ja } from './locales'

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
const isReCaptchaOpen = import.meta.env.VITE_GOOGLE_ACTION_CAPTCHA_OPEN === 'true' 
isReCaptchaOpen && app.use(VueReCaptcha, { 
  siteKey: import.meta.env.VITE_GOOGLE_CAPTCHA_SITE_KEY || '',
  loaderOptions: {
    useRecaptchaNet: true, // 在某些国家可能需要使用 recaptcha.net 代替
    autoHideBadge: true, // 自动隐藏 reCAPTCHA 徽章
  } 
})
// app.use(Vue3TouchEvents as ObjectPlugin)
app.mount('#app')

