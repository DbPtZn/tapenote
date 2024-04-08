
import { QueryState, QueryStateType, Keymap, Keyboard, Controller, Injector } from '@textbus/core'
import { UIButton } from './_utils/_index'
import { Tool } from '../types'
import { ExtractPropTypes, Ref, VNode, h, ref, VNodeProps } from 'vue'
// type Range<N extends number, Result extends number[] = []> = Result['length'] extends N ? Result[number] : Range<N, [...Result, Result['length']]>
// type Length<T extends ReadonlyArray<any>> = T extends { length: infer L } ? L : never
type State = {
  iconIndex?: number
  disabled?: boolean
}
export interface ButtonToolConfig {
  /** 给按扭控件添加一组 icon css class 类 */
  iconClasses: string[]
  /** 设置按钮的图标大小 */
  iconSize?: number
  /** 当鼠标放在控件上的提示文字 */
  tooltip?: string;
  /** 给按扭控件添加一组 css class 类 */
  classes?: string[]
  /** 当前按扭控件的快捷键配置 */
  keymap?: Keymap;
  /** 初始化时的禁用状态 */
  disabled?: boolean

  onClick(): void

  queryState?(): State | undefined // 更新按钮状态

  onDestroy?(): void
}

export class ButtonTool implements Tool {
  private config!: ButtonToolConfig
  private controller!: Controller
  private isHighlight: Ref<boolean>
  private isDisabled: Ref<boolean>
  private iconIndex: Ref<number>
  // params: Writable<UIButtonDefineProps> = {}

  constructor(private factory: (injector: Injector) => ButtonToolConfig) {
    this.isHighlight = ref(false)
    this.isDisabled = ref(false)
    this.iconIndex = ref(0)
  }

  setup(injector: Injector): VNode {
    this.config = this.factory(injector)
    this.controller = injector.get(Controller)
    this.isDisabled.value = this.config.disabled || false
    const keyboard = injector.get(Keyboard)
    const viewer = h(UIButton, {
      ...this.config,
      iconIndex: () => this.iconIndex.value,
      highlight: () => this.isHighlight.value,
      disabled: () => this.isDisabled.value
    })
    if (this.config.keymap) {
      keyboard.addShortcut({
        keymap: this.config.keymap,
        action: () => {
          this.config.onClick()
        }
      })
    }
    return viewer
  }

  refreshState() {
    if (this.config.queryState) {
      const state = this.config.queryState()
      if (!state) return
      // console.log(state)
      this.iconIndex.value = state.iconIndex === undefined ? 0 : state.iconIndex
      this.isDisabled.value = state.disabled === undefined ? false : state.disabled
    }
  }

  disabled(is: boolean) {
    if (is) {
      this.isDisabled.value = true
      this.isHighlight.value = false
    }
  }

  onDestroy() {
    this.config.onDestroy?.()
  }
}
