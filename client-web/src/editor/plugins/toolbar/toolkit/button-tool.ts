
import { QueryState, QueryStateType, Keymap, Keyboard, Controller, Injector } from '@textbus/core'
import { UIButton } from './_utils'
import { Tool } from '../types'
import { ExtractPropTypes, Ref, VNode, h, ref, VNodeProps, Component } from 'vue'
// type UIButtonProps = ExtractPropTypes<InstanceType<typeof UIButton>['$props']>
// type VNodePropKeys = 'class' | 'style' | 'key' | 'ref' | 'ref_for' | 'ref_key' | 'onVnodeBeforeMount'| 'onVnodeMounted' | 'onVnodeBeforeUpdate' | 'onVnodeUpdated' | 'onVnodeBeforeUnmount' | 'onVnodeUnmounted'
// type UIButtonDefineProps = Omit<UIButtonProps, keyof VNodeProps | 'class' | 'style'>
// type Writable<T> = {
//   -readonly [K in keyof T]: T[K];
// }
// type UIButtonDefineProps = Writable<Omit<ExtractPropTypes<InstanceType<typeof UIButton>['$props']>, keyof VNodeProps | 'class' | 'style'>>
export interface ButtonToolConfig<T = any> {
  /** 设置按扭显示的文字 */
  label?: string;
  /** 给按扭控件添加一组 css class 类 */
  classes?: string[];
  /** 给按扭控件添加一组 icon css class 类 */
  iconClasses?: (string | Component)[];
  /** icon size 默认是 16 */
  size?: number
  /** 当鼠标放在控件上的提示文字 */
  tooltip?: string;
  /** 当前按扭控件的快捷键配置 */
  keymap?: Keymap;

  onClick(): void

  queryState?(): QueryState<T>

  onDestroy?(): void
}

export class ButtonTool implements Tool {
  private config!: ButtonToolConfig<any>
  private controller!: Controller
  private isHighlight: Ref<boolean>
  private isDisabled: Ref<boolean>
  // params: Writable<UIButtonDefineProps> = {}

  constructor(private factory: (injector: Injector) => ButtonToolConfig<any>) {
    this.isHighlight = ref(false)
    this.isDisabled = ref(false)
  }

  setup(injector: Injector): VNode {
    this.config = this.factory(injector)
    this.controller = injector.get(Controller)
    const keyboard = injector.get(Keyboard)
    const viewer = h(UIButton, { 
      ...this.config, 
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
    this.controller.onReadonlyStateChange.subscribe(v => {
      this.isDisabled.value = v
    })
    return viewer
  }

  refreshState() {
    // console.log('refresh')
    if (!this.config.queryState) {
      return
    }
    if (this.controller.readonly) {
      this.isDisabled.value = true
      this.isHighlight.value = false
      return
    }
    const state = this.config.queryState()
    // console.log(state)
    switch (state.state) {
      case QueryStateType.Disabled:
        this.isDisabled.value = true
        this.isHighlight.value = false
        break
      case QueryStateType.Enabled:
        this.isDisabled.value = false
        this.isHighlight.value = true
        break
      case QueryStateType.Normal:
        this.isDisabled.value = false
        this.isHighlight.value = false
    }
  }

  disabled(is: boolean) {
    // console.log('disable')
    if (is) {
      this.isDisabled.value = true
      this.isHighlight.value = false
    }
  }

  onDestroy() {
    this.config.onDestroy?.()
  }
}
