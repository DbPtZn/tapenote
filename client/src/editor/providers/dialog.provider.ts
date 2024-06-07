import { Observable, Subject, Subscription, Injector, useContext, Injectable } from '@textbus/core'
import { VIEW_CONTAINER } from '@textbus/platform-browser'
import { App, VNode, createApp } from 'vue'
import { TempDialog } from './_utils'
interface DialogConfig {
  /** 临时对话框要挂载的节点（默认会挂载在body下的临时节点上） */
  host?: Element | string
  /** 是否显示 border */
  // bordered?: boolean
  /** 类名(对话框) */
  class?: string
  /** 是否显示 close 图标 */
  // closable?: boolean
  /** 是否在摁下 Esc 键的时候关闭对话框 */
  closeOnEsc?: boolean
  /** 内容 */
  content?: VNode
  /** 是否可以通过点击 mask 关闭对话框 */
  maskClosable?: boolean
  /** 对话框打开时执行回调 */
  // onOpen?: () => void
  /** 对话框关闭时执行回调 */
  // onClose?: () => void
}

@Injectable()
export class DialogProvider {
  private container!: HTMLElement
  private wrapper!: HTMLElement
  private dialog: App | null = null
  constructor() {}

  create(config: DialogConfig, injector: Injector) {
    this.container = injector.get(VIEW_CONTAINER)
    this.wrapper = this.container.parentNode as HTMLElement
    const hanger = document.createElement('div')
    this.wrapper.appendChild(hanger)
    return new Promise((resolve, reject) => {
      this.dialog = createApp(TempDialog, {
        ...config
      })
      this.dialog.provide('destory', () => {
        this.dialog?.unmount()
        // 销毁时移除 body 下的挂载节点
        if (this.wrapper && this.wrapper.contains(hanger)) {
          this.wrapper.removeChild(hanger)
        }
        resolve('')
      })
      this.dialog.provide('injector', injector)
      this.dialog.mount(hanger)
    })
  }

  destory() {
    this.dialog?.unmount()
  }
}
