import { App, Component, Plugin } from 'vue'
import { FractalContainer } from './src'
import { withInstall } from './utils/withInstall'

const comps = [FractalContainer] // 将来如果有其它组件,都可以写到这个数组里
// 批量组件注册
// const install = withInstall(FractalContainer)
// type SFCWithInstall<T> = T & Plugin
const install = (Vue: App) =>{
  comps.map((component: Component)=>{
    Vue.component(component.name as string, component)
  })
}

const windowObj = window as any
/* 支持使用标签的方式引入 */
if (typeof windowObj !== 'undefined' && windowObj.Vue) {
    const vm = windowObj.Vue.createApp({})
    install(vm)
}

export default install
