import { onBlur, onFocus, useSelf, VElement, VTextNode } from '@textbus/core'

export function useComponentToolbar() {
  let isShow = false
  const self = useSelf()
  onFocus(() => {
    isShow = true
    self.changeMarker.forceMarkDirtied()
  })
  onBlur(() => {
    isShow = false
    self.changeMarker.forceMarkDirtied()
  })
  // 不能标注返回 VElement 类型，与环境中的 jsx 不匹配会报错
  return function (props: {children?: Array<VElement|VTextNode>}) {
    return (
      <div class="tb-component-toolbar" style={{
        display: isShow ? 'block' : 'none'
      }} onMousedown={ev => {
        ev.preventDefault()
        return false
      }}>
        <div class="tb-component-toolbar-inner">
          {props.children}
        </div>
      </div>
    )
  }
}
