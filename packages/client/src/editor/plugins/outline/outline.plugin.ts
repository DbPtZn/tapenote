import { fromEvent, Renderer, sampleTime, Subscription, Plugin, Injector, RootComponentRef, ComponentInstance, debounceTime } from '@textbus/core'
import { Layout } from '@textbus/editor'
import { createElement } from '@textbus/platform-browser'
import { OutlineService } from './outline.service'
import { App, createApp, h, Ref, ref } from 'vue'
import OutlineView from './OutlineView.vue'
import { UIConfig } from '../../common'
import { Structurer } from '../..'
interface OutlineItem {
  tagName: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  text: string
  offsetTop: number
}
export class OutlinePlugin implements Plugin {
  private app: App | null = null
  private workbench: HTMLElement | null = null
  private host: HTMLElement | null = null
  private subs: Subscription[] = []
  private renderer!: Renderer
  private rootComponentRef!: RootComponentRef
  private outlineService!: OutlineService
  private scrollerRef: HTMLElement | null = null
  private outlineData: Ref<OutlineItem[]> = ref([])
  private activeIndex: Ref<number> = ref(0)
  private scrollTop: Ref<number> = ref(0)
  private injector!: Injector
  constructor(private target?: HTMLElement, private openDelayAnimate = true) {}
  setup(injector: Injector): void {
    const layout = injector.get(Layout)
    // const configProvider = injector.get(ConfigProvider)
    const structurer = injector.get(Structurer)
    this.injector = injector
    // console.log(this.target)
    this.workbench = layout.workbench // 设置大纲视图要挂在的目标
    // console.log(this.workbench)
    this.rootComponentRef = injector.get(RootComponentRef) // 获取根组件
    this.renderer = injector.get(Renderer)
    this.outlineService = injector.get(OutlineService)
    this.scrollerRef = structurer.scrollerEl
    this.outlineData = ref<OutlineItem[]>([]) // 大纲视图数据
    this.activeIndex = ref<number>(0)
    this.scrollTop = ref<number>(0)
    /** 创建挂载大纲视图的节点 */
    this.host = createElement('div', { classes: ['outline-container'] }) // 挂载大纲视图的节点
    this.target ? this.target.appendChild(this.host) : this.workbench.appendChild(this.host) // 将挂载节点插入 workbench 中
    const delay = this.openDelayAnimate ? 20 : 0
    this.outlineService.isExpanded && this.expand()
    this.subs.push(
      // TODO 设置条件：1.当且仅当大纲视图展开时才同步更新。
      this.renderer.onViewUpdated.pipe(sampleTime(1000)).subscribe(() => {
        // 获取标题组件
        const headingComponents = this.getHeadingComponents(this.rootComponentRef.component)
        if (headingComponents.length === 0) return
        // 获取标题组件的 VNode
        const headingVNodes = headingComponents.map(component => {
          return this.renderer.getVNodeByComponent(component)!
        })
        // 获取标题组件的原生dom节点
        const headingNativeNodes = headingVNodes.map(vnode => {
          return this.renderer.getNativeNodeByVNode(vnode) as HTMLElement
        })
        // 更新视图时，同步更新大纲视图数据
        this.outlineData.value = headingNativeNodes.map(el => {
          return {
            tagName: el.tagName as any,
            text: el.innerText,
            offsetTop: el.offsetTop
          }
        })
      }),
      this.outlineService.onExpand.subscribe(() => {
        this.outlineService.isExpanded ? this.expand() : this.collapse()
      })
    )
    if (this.scrollerRef === document.documentElement) {
      this.subs.push(
        fromEvent(window, 'scroll').pipe(debounceTime(delay)).subscribe(() => {
          this.activeIndex.value = this.outlineData.value.findIndex(item => item.offsetTop >= this.scrollerRef!.scrollTop)
          this.openDelayAnimate && (this.scrollTop.value = this.scrollerRef!.scrollTop)
        })
      )
    } else {
      this.subs.push(
        fromEvent(this.scrollerRef!, 'scroll').pipe(debounceTime(delay)).subscribe(() => {
          this.activeIndex.value = this.outlineData.value.findIndex(item => item.offsetTop >= this.scrollerRef!.scrollTop)
          this.openDelayAnimate && (this.scrollTop.value = this.scrollerRef!.scrollTop)
        })
      )
    }
    // 2. 跟随页面滚动
  }
  // 展开视图
  private expand() {
    /** 处理 workbench 的结构，让大纲视图可以在编辑器的右侧显示 */
    this.workbench!.style.display = 'flex'
    this.workbench!.style.flexDirection = 'row'
    this.host!.style.width = '200px'
    this.host!.style.opacity = '1'
    this.host!.style.zIndex = '1'
    this.app = createApp(h(UIConfig, null, {
      default: () => h(OutlineView, { 
        data: () => this.outlineData.value,
        openDelayAnimate: this.openDelayAnimate,
        activeIndex: () => this.activeIndex.value,
        scrollTop: () => this.scrollTop.value,
        scrollerTo: (offsetTop) => this.scrollerToCallback(offsetTop),
      })
    })).provide('injector', this.injector)
    this.app.mount(this.host)
  }
  // 折叠视图
  private collapse() {
    this.workbench!.style.display = 'unset'
    this.workbench!.style.flexDirection = 'unset'
    this.host!.style.width = '0px'
    this.host!.style.opacity = '0'
    this.host!.style.zIndex = '-1'
    this.app?.unmount()
  }
  private scrollerToCallback(offsetTop: number) { // 点击条目时回调函数，控制滚动条滚动
    this.scrollerRef?.scrollTo({ top: offsetTop, behavior: 'smooth' })
  }
  private getHeadingComponents(rootComponent: ComponentInstance) {
    const components: ComponentInstance[] = []
    function traverse(component: ComponentInstance, result: ComponentInstance[]) {
      component.slots.toArray().forEach(slot => {
        slot.sliceContent().forEach(content => {
          if (typeof content !== 'string') {
            if (content.name === 'HeadingComponent') {
              result.push(content)
            } else {
              traverse(content, result)
            }
          } else {
            return
          }
        })
      })
    }
    traverse(rootComponent, components)
    return components
  }
  onDestroy?(): void {
    this.subs.forEach(i => i.unsubscribe())
    this.outlineData.value = []
    this.app?.unmount()
    this.host = null
    this.workbench = null
    this.scrollerRef = null
  }
}

