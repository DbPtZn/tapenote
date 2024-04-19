export enum ContainerTypeEnum {
  /** 根容器 */ 
  ROOT = 'root',
  /** 封装容器 : 标记封装容器，可以拥有独立的内部逻辑，不会被当作纯粹容器移除掉 */
  WRAPPER = 'wrapper',
  /** 布局容器 */
  LAYOUT = 'layout',
  /** 纯粹容器 */
  SIMPLE = 'simple',
  /** iframe */
  IFRAME = 'iframe',
  /** 组件 */
  CMPT = 'component',
  /** 临时空容器 */
  EMPTY = 'empty',
  /** 无渲染容器: 会将容器设置成 display: none 使其消失并脱离文档流 */
  UNRENDER = 'unrender'
}
//  = {
//   ROOT = 'root',
//   WRAPPER = 'wrapper',
//   LAYOUT = 'layout',
//   SIMPLE = 'simple',
//   IFRAME = 'iframe',
//   CMPT = 'component',
//   EMPTY = 'empty'
// }
