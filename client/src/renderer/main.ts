import { FractalContainer, FractalContainerConfig, InsertType, ContainerType } from './fractal-container'
import { withInstall } from '@/utils/withInstall'
const coms = [FractalContainer] // 将来如果有其它组件,都可以写到这个数组里

// 批量组件注册
const install = withInstall(FractalContainer)
export type { FractalContainerConfig, InsertType, ContainerType }
export default install // 这个方法以后再使用的时候可以被 use 调用
