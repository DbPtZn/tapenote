import { Subscription } from '@tanbo/stream'
import { makeError, Plugin, Injector } from '@textbus/core'
import _ from 'lodash'
import { Tool } from './types'
import ControllerView from './ControllerView.vue'
import { App, createApp, h, VNode } from 'vue'
import { Player, UIConfig } from '@/editor'

const toolbarErrorFn = makeError('Toolbar')

interface ToolFactory {
  (): Tool
}
/**
 * 编辑器工具条
 */
export class PreviewPlayerController implements Plugin {
  private subs: Subscription[] = []
  private tools: (Tool | Tool[])[]
  private components: VNode[] = []
  private app: App | null = null

  constructor(
    private toolFactories: Array<ToolFactory | ToolFactory[]> = [],
    private host: HTMLElement
  ) {
    this.tools = this.toolFactories.map((i) => {
      return Array.isArray(i) ? i.map((j) => j()) : i()
    })
  }
  setup(injector: Injector): void {
    const player = injector.get(Player)
    this.tools.forEach((tool) => {
      // 如果是工具组
      if (Array.isArray(tool)) {
        const groupWrapper: VNode[] = []
        tool.forEach((t) => {
          groupWrapper.push(t.setup(injector, this.host))
        })
        this.components.push(h('div', { class: 'group-wrapper' }, groupWrapper))
        return
      }
      this.components.push(tool.setup(injector, this.host))
    })
    // 工具条主框架
    this.app = createApp(h(UIConfig, null, {
      default: () => h(ControllerView, { cmpts: this.components })
    }))
    this.app.provide('injector', injector) // 向 vue 工具条注入编辑器依赖
    this.app.mount(this.host!)
    const tools = this.tools.flat()
    this.subs.push(
      player.onStateUpdate.subscribe(() => {
        tools.forEach(tool => {
          tool.refreshState()
        })
      })
    )
  }

  onDestroy() {
    this.tools.length = 0
    this.tools = []
    this.components.length = 0
    this.components = []
    this.app?.unmount()
    this.subs.forEach((i) => i.unsubscribe())
  }
}
