export default defineNuxtPlugin((nuxtApp) => {

  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    // 处理错误，例如上报到一个服务
    console.log(error, instance, info)
  }

  // 也可以这样
  nuxtApp.hook('vue:error', (error, instance, info) => {
    // 处理错误，例如上报到一个服务
    console.log(error, instance, info)
  })
})
