import {
  Commander,
  Injector,
  Plugin,
  Selection,
  Renderer,
  Subscription,
  fromEvent,
} from '@textbus/core'
import { Structurer } from '../..'
import { VIEW_DOCUMENT } from '@textbus/platform-browser'
import { Layout } from '@textbus/editor'
export class AnimeClickPlugin implements Plugin {
  private commander!: Commander
  private selection!: Selection
  private renderer!: Renderer
  private subs: Subscription[] = []
  private injector!: Injector
  private document: HTMLElement | null = null

  
  setup(injector: Injector) {
    this.injector = injector
    this.commander = injector.get(Commander)
    this.selection = injector.get(Selection)
    this.renderer = injector.get(Renderer)
    const layout = injector.get(Layout)
    const structurer = this.injector.get(Structurer)
    this.document = this.injector.get(VIEW_DOCUMENT)
    // console.log(this.document)
    // console.log(layout.workbench)
    // console.log(layout.container)
    // this.scrollerRef = structurer.scrollerRef
    this.subs.push(
      fromEvent<PointerEvent>(this.document, 'click').subscribe(ev => {
        // console.log(ev)
        const target = ev.target as HTMLElement
        if (target.tagName.toLocaleLowerCase() === 'anime') {
            ev.preventDefault() // 阻止默认事件
            ev.stopPropagation() // 阻止事件冒泡
            // console.log('anime')
            
        }
        if (target.classList.contains('anime-component-tab')) {
          // console.log('anime-component')
          const node = target.parentElement
          if(node?.tagName.toLocaleLowerCase() === 'anime-component') {
            ev.preventDefault() // 阻止默认事件
            ev.stopPropagation() // 阻止事件冒泡
            // console.log(node)
            const component = this.renderer.getComponentByNativeNode(node)
            if(component) {
             
            }
          }
        }
      })
    )
  }


  // 可选，编辑器销毁时调用
  onDestroy() {
    this.subs.forEach(sub => sub.unsubscribe())
  }
}