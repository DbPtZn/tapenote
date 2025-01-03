import { Subscription } from '@tanbo/stream'
import { Plugin, Injector, Injectable } from '@textbus/core'
import _ from 'lodash'
import { Layout } from '@textbus/editor'
import { App, createApp } from 'vue'
import MemoWrapper from './MemoWrapper.vue'

export interface Memo {
  id: string
  content: string
  updateAt: string
  createAt: string
  isExpanded: boolean
  bgColor: 'yellow' | 'green' | 'pink' | 'purple' | 'blue' | 'white' | 'gray'
  height: number
  width: number
  x: number
  y: number
}

@Injectable()
export class MemoProvider {
  private subs: Subscription[] = []
  private app: App | null = null
  private host: HTMLElement | null = null
  setup(injector: Injector, memos: Memo[]) {
    const layout = injector.get(Layout)
    const workbench = layout.workbench
    this.host = document.createElement('div')
    workbench.appendChild(this.host)
    this.app = createApp(MemoWrapper, { memos: memos }).provide('injector', injector)
    this.app.mount(this.host)
  }

  destroy() {
    this.subs.forEach(i => i.unsubscribe())
    this.app?.unmount()
    if (this.host) {
      this.host.parentElement?.removeChild(this.host)
    }
  }
}
