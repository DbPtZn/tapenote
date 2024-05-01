import type { App, Component, Plugin } from 'vue' // 只导入类型 而不是导入值
// 类型必须导出 否则生成不了.d.ts
type SFCWithInstall<T> = T & Plugin
export const withInstall = <T>(comp: Component) => {
  ;(comp as SFCWithInstall<T>).install = function (app: App) {
    app.component((comp as any).__name, comp)
  }
  return comp as SFCWithInstall<T>
}
