import { Controller, Keyboard, QueryState, QueryStateType, Injector } from '@textbus/core'
import { Tool } from '../types'
import { Ref, VNode, h, ref } from 'vue'
import { UISelect } from './_utils'
import type { SelectOptionConfig } from './_utils/UISelect.vue'

/**
 * 下拉选择工具配置项
 */
export interface SelectToolConfig<T = any> {
  /** Select 的可选项配置 */
  options: SelectOptionConfig[]
  // options: UISelectDefineProps['options'][]
  /** 给 Select 控件添加一组 css class */
  classes?: string[]
  /** 给 select 控件添加一组 icon css class 类 */
  iconClasses?: string[]
  /** 设置当前 Select 是否根据内容扩展宽度 */
  mini?: boolean
  /** 当鼠标放在控件上的提示文字 */
  tooltip?: string

  onChecked(value: T): void

  queryState?(): QueryState<T>

  onDestroy?(): void
}

export class SelectTool implements Tool {
  private config!: SelectToolConfig
  private controller!: Controller
  private isHighlight: Ref<boolean>
  private isDisabled: Ref<boolean>
  private currentVal: Ref<string | number | null> // 当前值
  
  constructor(private factory: (injector: Injector) => SelectToolConfig) {
    this.isHighlight = ref(false)
    this.isDisabled = ref(false)
    this.currentVal = ref(null)
  }

  setup(injector: Injector, limitElement: HTMLElement): VNode {
    const config = this.factory(injector)
    this.controller = injector.get(Controller)
    this.config = config
    this.currentVal.value = this.config.options[this.config.options.findIndex((item) => item.default)].value as string | number
    const keyboard = injector.get(Keyboard)
    const select = h(UISelect, {
      currentValue: this.currentVal,
      ...config,
      onSelected: (value: any) => {
        config.onChecked(value)
      },
      highlight: () => this.isHighlight.value,
      disabled: () => this.isDisabled.value
    })
    /** 配置快捷键 */
    config.options.filter(i => i.keymap).forEach(i => {
      keyboard.addShortcut({
        keymap: i.keymap!,
        action: () => {
          if (!this.isDisabled.value) {
            this.config.onChecked(i.value)
          }
        }
      })
    })
    this.controller.onReadonlyStateChange.subscribe(v => {
      this.isDisabled.value = v
    })
    return select
  }

  refreshState() {
    // 是否进行查询配置
    if (!this.config.queryState) {
      return
    }
    // 是否只读状态
    if (this.controller.readonly) {
      this.isDisabled.value = true
      this.isHighlight.value = false
      return
    }
    // 获取查询结果
    const state = this.config.queryState()
    // console.log(state)
    if (state.value) {
      const option = this.config.options.find(i => {
        return i.value === state.value
      })
      if (option) {
        // 
        this.currentVal.value = option.value
        this.isDisabled.value = false
        this.isHighlight.value = true
        return
      }
    }

    this.isHighlight.value = false
    this.isDisabled.value = state.state === QueryStateType.Disabled
    this.currentVal.value = this.config.options[this.config.options.findIndex((item) => item.default)].value as string | number
    // let defaultOption!: SelectOptionConfig
    // for (const op of this.config.options) {
    //   if (op.default) {
    //     defaultOption = op
    //     break
    //   }
    // }
    // if (defaultOption) {
    //   this.setLabel(defaultOption.label)
    // }
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
