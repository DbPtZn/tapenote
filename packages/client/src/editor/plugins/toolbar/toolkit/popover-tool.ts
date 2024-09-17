import { Controller, Keyboard, Keymap, QueryState, QueryStateType, Subscription, Injector } from '@textbus/core'
import { Tool } from '../types'
import { UIPopover } from './_utils'
import { Component, Ref, VNode, h, ref } from 'vue'

export interface PopoverToolConfig {
  /** 快捷键配置 */
  keymap?: Keymap;
  /** 给当前控件添加一组 css class */
  classes?: string[];
  /** 给当前控件添加一组 icon css class */
  iconClasses?: string[];
  /** 当鼠标放在控件上的提示文字 */
  tooltip?: string;
  /** 设置控件显示的文字 */
  label?: string;

  view: Component,

  queryState(): QueryState<any>

  useValue(value: any): void

  onDestroy?(): void
}

export class PopoverTool implements Tool {
  private config!: PopoverToolConfig
  // private viewer!: UIPopover
  private controller!: Controller
  private subs: Subscription[] = []
  private isHighlight: Ref<boolean>
  private isDisabled: Ref<boolean>

  constructor(private factory: (textbus: Injector) => PopoverToolConfig) {
    this.isHighlight = ref(false)
    this.isDisabled = ref(false)
  }

  setup(textbus: Injector) {
    const config = this.factory(textbus)
    this.config = config
    this.controller = textbus.get(Controller)
    // const keyboard = textbus.get(Keyboard)
    // const initValue: any = {}
    // let prevValue: any = initValue

    const viewer = h(UIPopover, { 
      ...this.config,
      options: [],
      highlight: () => this.isHighlight.value,
      disabled: () => this.isDisabled.value,
    })
    this.controller.onReadonlyStateChange.subscribe(v => {
      this.isDisabled.value = v
    })
    
    return viewer
    // this.subs.push(config.viewController.onComplete.subscribe(value => {
    //   prevValue = value
    //   form.hide()
    //   config.useValue(prevValue)
    // }))
    // const form = createPopover({
    //   ...config,
    //   stickyElement: limitElement,
    //   menuView: config.viewController.elementRef
    // })
    // if (config.keymap) {
    //   keyboard.addShortcut({
    //     keymap: config.keymap,
    //     action() {
    //       if (!form.disabled && prevValue !== initValue) {
    //         config.useValue(prevValue)
    //       }
    //     }
    //   })
    // }
    // this.viewer = form
  }

  refreshState() {
    // const viewer = this.viewer

    if (this.controller.readonly) {
      this.isDisabled.value = true
      this.isHighlight.value = false
      return
    }
    const state = this.config.queryState()
    // if (state.value) {
    //   this.config.viewController.update(state.value)
    // } else {
    //   this.config.viewController.reset()
    // }
    switch (state.state) {
      case QueryStateType.Enabled:
        this.isDisabled.value = false
        this.isHighlight.value = true
        break
      case QueryStateType.Normal:
        this.isDisabled.value = false
        this.isHighlight.value = false
        break
      case QueryStateType.Disabled:
        this.isDisabled.value = true
        this.isHighlight.value = false
        break
    }
  }

  disabled(is: boolean) {
    if (is) {
      this.isDisabled.value = true
      this.isHighlight.value = false
    }
  }

  onDestroy() {
    this.subs.forEach(i => i.unsubscribe())
    this.config.onDestroy?.()
  }
}
