import {
  Commander,
  Injector,
  Plugin,
  Selection,
  Renderer,
  VElement,
  Subscription
} from '@textbus/core'
import { App, createApp } from 'vue';
import AddAnimeTool from './AddAnimeTool.vue';
import { VIEW_DOCUMENT } from '@textbus/platform-browser';

export class AnimeComponentSupport implements Plugin {
  // private commander!: Commander;
  // private selection!: Selection;
  // private renderer!: Renderer;
  private app: App | null = null
  private host: HTMLElement | null = null
  private viewDocument: HTMLElement | null = null
  constructor() {
    // console.log('anime component loaded');
  }
  setup(injector: Injector) {
    // this.commander = injector.get(Commander)
    // this.selection = injector.get(Selection)
    // this.renderer = injector.get(Renderer)
    this.app = createApp(AddAnimeTool).provide('injector', injector)
    this.viewDocument = injector.get(VIEW_DOCUMENT)
    this.host = document.createElement('div')
    this.viewDocument.appendChild(this.host)
    this.app.mount(this.host)
  }

  onDestroy(): void {
      this.app?.unmount()
      if (this.viewDocument && this.host) {
        this.viewDocument.removeChild(this.host)
      }
  }
}