import {
  Injector,
  makeError,
  NativeSelectionBridge,
  Renderer,
  Selection,
  Slot,
  Subscription,
  Plugin
} from '@textbus/core'
import { Editor, Layout } from '@textbus/editor'
import { auditTime, fromEvent } from '@tanbo/stream'
import { createElement, SelectionBridge, VIEW_CONTAINER } from '@textbus/platform-browser'
import { App, VNode, createApp, h } from 'vue'
import ImgToolbarView from './ImgToolbarView.vue'
import { Tool } from '../toolbar/types'
import { UIConfig } from '../../common'


export class ImgToolbarPlugin implements Plugin {
  private app: App | null = null
  private host: HTMLElement | null = null
  private viewContainer: HTMLElement | null = null
  
  /** params 同源域名 */
  constructor(private isogenyDomainNames: string[]) {}
  
  setup(injector: Injector): void {
    this.app = createApp(h(UIConfig, null, { default: () => h(ImgToolbarView) })).provide('injector', injector).provide('isogenyDomainNames', this.isogenyDomainNames)
    this.viewContainer = injector.get(VIEW_CONTAINER)
    this.host = document.createElement('div')
    this.viewContainer.appendChild(this.host)
    this.app.mount(this.host)
  }
  
  onDestroy?(): void {
    this.app?.unmount()
    if (this.viewContainer && this.host) this.viewContainer.removeChild(this.host)
  }
}