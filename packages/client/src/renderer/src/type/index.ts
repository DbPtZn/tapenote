import { Component, VNode } from 'vue'
export interface FractalContainerConfig {
  id: string // 最好使用UUID生成，id 属性会设置成容器对应的元素的 data-id
  key?: string // 组件的 key 值，通过更新 key 值可以刷新组件（可选，如果不设置，默认使用 id 值作为组件 key 值）
  type?: ContainerType
  name?: string // 为容器添加一个名称
  cmpt?: Component | VNode | null // 渲染组件
  // vnode?: VNode, // 未实现
  isRow: boolean // 是否水平分布
  isSplitterRender?: boolean // 是否渲染分隔条(默认不渲染)
  ratio?: number | string // 宽度/高度百分比（0—100），  (最好是正整数), 不设置的情况下系统会根据剩余空间平均分配
  min?: number | string // 指定宽或高的最小值 (最好是正整数，且不超过 ratio)
  useControl?: boolean // 使用拖拽控件
  // useCustomControl?: CustomControl | undefined
  renderControl?: VNode,
  allowDrag?: boolean // 判断节点能否被拖拽
  allowDrop?: boolean // 拖拽时判定目标节点能否成为拖动目标位置
  element?: Element
  parent?: FractalContainerConfig
  children: FractalContainerConfig[]
  // 辅助功能：主要用作辅助我们早期布局的时候看效果
  useBorder?: Border
  usePadding?: Padding
  useMargin?: Margin
  useBgcolor?: string | undefined // 使用背景色，渲染背景色。值是设置背景色的颜色，值存在时就会渲染。
  useShadow?: string | undefined // 使用阴影。传入阴影样式配置，值存在时就会渲染
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit' | 'initial' | 'unset' // 默认是 hidden
}

/** 拖拽插入容器的位置 */
export enum InsertType {
  LEFT = 'left',
  RIGHT = 'right',
  TOP = 'top',
  BOTTOM = 'bottom',
  MIDDLE = 'middle',
  UNSET = 'unset'
}

/** 容器的类型: 目前约定 7 种类型 */
// export type ContainerType = 'root' | 'wrapper' | 'layout' | 'simple'  | 'iframe' | 'component' | 'empty'

// interface CustomControl {
//   label?: string
//   icon?: string // 目前只支持通过类名设置 icon
//   iconStyle?: string[]
//   wrapperStyle?: string[]
//   onClick?: () => void
// }

interface Border {
  top?: string | undefined
  bottom?: string | undefined
  right?: string | undefined
  left?: string | undefined
}

interface Padding {
  top?: string | undefined
  bottom?: string | undefined
  right?: string | undefined
  left?: string | undefined
}

interface Margin {
  top?: string | undefined
  bottom?: string | undefined
  right?: string | undefined
  left?: string | undefined
}

export type ContainerType =
  /** 根容器 */ 
  'root' |
  /** 封装容器 : 标记封装容器，可以拥有独立的内部逻辑，不会被当作纯容器移除掉 */
  'wrapper' |
  /** 布局容器 */
  'layout' |
  /** 纯容器 */
  'simple' |
  /** iframe */
  'iframe' |
  /** 组件 */
  'component' |
  /** 临时空容器 */
  'empty' |
  /** 无渲染容器: 会将容器设置成 display: none 使其消失并脱离文档流 */
  'unrender'