import {
  Injector,
  Plugin
} from '@textbus/core'
import { VIEW_CONTAINER } from '@textbus/platform-browser'
import { App, createApp, h } from 'vue'
import { UIConfig } from '../../common'
import ShotcutMenu from './ShotcutMenu.vue'


export class ShotcutPlugin implements Plugin {
  private app: App | null = null
  private host: HTMLElement | null = null
  private viewContainer: HTMLElement | null = null
  
  constructor() {}
  
  setup(injector: Injector): void {
    this.app = createApp(h(UIConfig, null, { default: () => h(ShotcutMenu) })).provide('injector', injector)
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