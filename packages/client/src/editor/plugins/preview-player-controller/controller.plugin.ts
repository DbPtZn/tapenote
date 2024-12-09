import { Plugin, Injector } from '@textbus/core'
import ControllerView from './ControllerView.vue'
import { App, createApp, h } from 'vue'
import { UIConfig } from '../..'

/**
 * 编辑器工具条
 */
export class PreviewPlayerController implements Plugin {
  private app: App | null = null

  constructor(private host: HTMLElement | null) {}
  setup(injector: Injector): void {
    // 工具条主框架
    this.app = createApp(h(UIConfig, null, {
      default: () => h(ControllerView)
    }))
    this.app.provide('injector', injector) // 向 vue 工具条注入编辑器依赖
    this.app.mount(this.host!)
  }

  onDestroy() {
    this.app?.unmount()
    this.host = null
  }
}
