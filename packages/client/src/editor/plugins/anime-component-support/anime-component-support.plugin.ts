import { Commander, Injector, Plugin, Selection, Renderer, VElement, Subscription } from '@textbus/core'
import { App, createApp } from 'vue'
import AddAnimeTool from './AddAnimeTool.vue'
import { VIEW_CONTAINER } from '@textbus/platform-browser'

export class AnimeComponentSupport implements Plugin {
  // private commander!: Commander;
  // private selection!: Selection;
  // private renderer!: Renderer;
  private app: App | null = null
  private host: HTMLElement | null = null
  private viewContainer: HTMLElement | null = null
  constructor() {
    // console.log('anime component loaded');
  }
  setup(injector: Injector) {
    this.app = createApp(AddAnimeTool).provide('injector', injector)
    this.viewContainer = injector.get(VIEW_CONTAINER)
    this.host = document.createElement('div')
    this.viewContainer.appendChild(this.host)
    this.app.mount(this.host)
  }

  onDestroy(): void {
    this.app?.unmount()
    if (this.viewContainer && this.host) this.viewContainer.removeChild(this.host)
  }
}
