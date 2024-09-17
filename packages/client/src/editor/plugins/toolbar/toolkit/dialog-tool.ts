import { Controller, Keyboard, Keymap, QueryState, Subscription, Injector } from '@textbus/core'
import { Tool } from '../types'
import { UIButton } from './_utils'
import { VNode, h } from 'vue'
import { DialogProvider } from '../../../providers'

export interface DialogToolConfig {
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

  // viewController: ViewController<any>
  view: VNode

  queryState(): QueryState<any>

  useValue(value: any): void

  onDestroy?(): void
}

export class DialogTool implements Tool {
  private config!: DialogToolConfig
  // private viewer!: UIButton
  private controller!: Controller

  private subs: Subscription[] = []

  constructor(private factory: (injector: Injector) => DialogToolConfig) {
  }

  setup(injector: Injector): VNode {
    const config = this.factory(injector)
    this.controller = injector.get(Controller)
    this.config = config
    const keyboard = injector.get(Keyboard)
    const dialog = injector.get(DialogProvider)
    const initValue: any = {}
    const dialogBtn = h(UIButton, {
      ...config,
      onClick: () => {
        dialog.create({
          content: config.view
        }, injector)
      }
    })
    // let prevValue: any = initValue

    // const button = createButton({
    //   ...this.config,
    //   onClick: () => {
    //     dialog.show(config.viewController.elementRef)
    //   }
    // })

    // this.subs.push(
    //   config.viewController.onComplete.subscribe(value => {
    //     prevValue = value
    //     dialog.hide()
    //     config.useValue(prevValue)
    //   }),
    //   config.viewController.onCancel.subscribe(() => {
    //     dialog.hide()
    //   })
    // )
    // if (config.keymap) {
    //   keyboard.addShortcut({
    //     keymap: config.keymap,
    //     action() {
    //       if (!button.disabled && prevValue !== initValue) {
    //         config.useValue(prevValue)
    //       }
    //     }
    //   })
    // }
    // this.viewer = button
    return dialogBtn
  }

  refreshState() {
    // const viewer = this.viewer
    // if (this.controller.readonly) {
    //   viewer.disabled = true
    //   viewer.highlight = false
    //   return
    // }
    // const state = this.config.queryState()
    // if (state.value) {
    //   this.config.viewController.update(state.value)
    // } else {
    //   this.config.viewController.reset()
    // }
    // switch (state.state) {
    //   case QueryStateType.Enabled:
    //     viewer.disabled = false
    //     viewer.highlight = true
    //     break
    //   case QueryStateType.Normal:
    //     viewer.disabled = false
    //     viewer.highlight = false
    //     break
    //   case QueryStateType.Disabled:
    //     viewer.disabled = true
    //     viewer.highlight = false
    //     break
    // }
  }

  disabled(is: boolean) {
    // if (is) {
    //   this.viewer.disabled = true
    //   this.viewer.highlight = false
    // }
  }

  onDestroy() {
    this.subs.forEach(i => i.unsubscribe())
    this.config.onDestroy?.()
  }
}
