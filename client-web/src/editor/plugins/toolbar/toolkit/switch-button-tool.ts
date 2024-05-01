
import { QueryState, Keymap, Keyboard, Controller, Injector } from '@textbus/core'
import { UISwitchButton } from './_utils'
import { Tool } from '../types'
import { Ref, VNode, h, ref } from 'vue'
// type UIButtonProps = ExtractPropTypes<InstanceType<typeof UIButton>['$props']>
// type VNodePropKeys = 'class' | 'style' | 'key' | 'ref' | 'ref_for' | 'ref_key' | 'onVnodeBeforeMount'| 'onVnodeMounted' | 'onVnodeBeforeUpdate' | 'onVnodeUpdated' | 'onVnodeBeforeUnmount' | 'onVnodeUnmounted'
// type UIButtonDefineProps = Omit<UIButtonProps, keyof VNodeProps | 'class' | 'style'>
// type Writable<T> = {
//   -readonly [K in keyof T]: T[K];
// }
// type UIButtonDefineProps = Writable<Omit<ExtractPropTypes<InstanceType<typeof UIButton>['$props']>, keyof VNodeProps | 'class' | 'style'>>
export interface SwitchButtonToolConfig<T = any> {
  /** 设置按扭显示的文字 */
  label?: string;
  /** 给按扭控件添加一组 css class 类 */
  classes?: string[];
  /** 给按扭控件添加一组 icon css class 类 */
  iconClasses?: string[];
  /** 当鼠标放在控件上的提示文字 */
  tooltip?: string;
  /** 当前按扭控件的快捷键配置 */
  keymap?: Keymap;

  onClick(): void

  queryState?(): QueryState<T>

  onDestroy?(): void
}

export interface SwitchButtonState {
  iconIndex?: number
  highlight?: boolean
  disabled?: boolean
}

export class SwitchButtonTool implements Tool {
  private config!: SwitchButtonToolConfig<any>
  private controller!: Controller
  private isHighlight: Ref<boolean>
  private isDisabled: Ref<boolean>
  private iconIndex: Ref<number>;
  // params: Writable<UIButtonDefineProps> = {}

  constructor(private factory: (injector: Injector, updateState: (state: SwitchButtonState) => void) => SwitchButtonToolConfig<any>) {
    this.isHighlight = ref(false)
    this.isDisabled = ref(false)
    this.iconIndex = ref(0)
  }

  setup(injector: Injector): VNode {
    const updateState = (state: SwitchButtonState) => {
      if(state.highlight !== undefined) this.isHighlight.value = state.highlight
      if(state.disabled!== undefined) this.isDisabled.value = state.disabled
      if(state.iconIndex!== undefined) this.iconIndex.value = state.iconIndex 
    }
    this.config = this.factory(injector, updateState)
    this.controller = injector.get(Controller)
    const keyboard = injector.get(Keyboard)
    const viewer = h(UISwitchButton, { 
      ...this.config, 
      highlight: () => this.isHighlight.value,
      disabled: () => this.isDisabled.value,
      iconIndex: () => this.iconIndex.value,
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
    if (this.controller.readonly) {
      this.isDisabled.value = true
      this.isHighlight.value = false
      return
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
