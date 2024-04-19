import { FractalContainer } from './src'
// import { ShellModule } from './shell'
// import { useShell } from './useShell'
// import { useRendererStore } from './renderer'
// import { useRenderer } from './useRenderer'
import { withInstall } from './utils/withInstall'
// export * from './index'
// import 'vite/modulepreload-polyfill'
// const coms = [FractalContainer] // 将来如果有其它组件,都可以写到这个数组里

// 批量组件注册
const install = withInstall(FractalContainer)
// export type { FractalContainerConfig, InsertType, ContainerType, ShellModule }
// export { install, useRenderer, useShell }
export default install
