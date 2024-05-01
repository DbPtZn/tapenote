
import { QueryState, QueryStateType, Keymap, Keyboard, Controller, Injector, Subscription } from '@textbus/core'
import { ExtractPropTypes, Ref, VNode, h, ref, VNodeProps } from 'vue'
import UIOutlineButton from './UIOutlineButton.vue'
import { OutlineService } from '../outline.service';
export interface OutlineButtonToolConfig<T = any> {
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
  onDestroy?(): void
}

export class OutlineButtonTool {
  private config!: OutlineButtonToolConfig<any>
  private controller!: Controller
  private isHighlight: Ref<boolean>
  private isDisabled: Ref<boolean>
  private subs: Subscription[] = []
  private outlineService!: OutlineService;
  // params: Writable<UIButtonDefineProps> = {}

  constructor(private factory: (injector: Injector) => OutlineButtonToolConfig<any>) {
    this.isHighlight = ref(false)
    this.isDisabled = ref(false)
  }

  setup(injector: Injector): VNode {
    this.config = this.factory(injector)
    this.controller = injector.get(Controller)
    this.outlineService = injector.get(OutlineService)
    const keyboard = injector.get(Keyboard)
    const viewer = h(UIOutlineButton, { 
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
    this.subs.push(
      this.outlineService.onExpand.subscribe((state) => {
        this.isHighlight.value = state
      })
    )
    return viewer
  }
  refreshState(){}

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
