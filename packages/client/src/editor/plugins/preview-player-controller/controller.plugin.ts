import { Subscription } from '@tanbo/stream'
import { Plugin, Injector } from '@textbus/core'
import _ from 'lodash'
import ControllerView from './ControllerView.vue'
import { App, createApp, h, VNode } from 'vue'
import { Player, UIConfig } from '../..'

/**
 * 编辑器工具条
 */
export class PreviewPlayerController implements Plugin {
  private subs: Subscription[] = []
  private components: VNode[] = []
  private app: App | null = null

  constructor(private host: HTMLElement | null) {}
  setup(injector: Injector): void {
    // 工具条主框架
    this.app = createApp(h(UIConfig, null, {
      default: () => h(ControllerView, { cmpts: this.components })
    }))
    this.app.provide('injector', injector) // 向 vue 工具条注入编辑器依赖
    this.app.mount(this.host!)
  }

  onDestroy() {
    this.components.length = 0
    this.components = []
    this.app?.unmount()
    this.subs.forEach((i) => i.unsubscribe())
    this.host = null
  }
}
