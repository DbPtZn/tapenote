import {
  Commander,
  Injector,
  Plugin,
  Selection,
  Renderer,
  VElement,
  Subscription,
  ComponentInstance,
  fromEvent,
} from '@textbus/core'
import { AnimeProvider, Structurer, animeFormatter } from '@/editor'
import { App, Ref, createApp, h, ref } from 'vue'
import { NDropdown } from 'naive-ui'
import { VIEW_CONTAINER, createElement } from '@textbus/platform-browser'
import { DropdownOption } from 'naive-ui'
import { UIConfig } from '@/editor'
import AnimeEffectOptions from './AnimeEffectOptions.vue'
import { Editor } from '@textbus/editor'
import Dropdown from './Dropdown.vue'
export class AnimeContextmenuPlugin implements Plugin {
  private commander!: Commander
  private selection!: Selection
  private renderer!: Renderer
  private subs: Subscription[] = []
  private contextmenu: App<Element> | null = null
  private anime!: AnimeProvider
  private animeOptions: ReturnType<typeof this.anime.getOptions> = []
  private scrollSubscription: Subscription | null = null
  private injector!: Injector
  private container: HTMLElement | null = null
  private scrollerRef: HTMLElement | null = null
  private showRef: Ref<boolean> = ref(false)
  private xRef: Ref<number> = ref(0)
  private yRef: Ref<number> = ref(0)
  private Options: Ref<DropdownOption[]> = ref([])
  private host: HTMLElement | null = null

  
  setup(injector: Injector) {
    this.injector = injector
    this.commander = injector.get(Commander)
    this.selection = injector.get(Selection)
    this.renderer = injector.get(Renderer)
    this.anime = injector.get(AnimeProvider)
    this.animeOptions = this.anime.getOptions()
    // const editor = injector.get(Editor)
    const structurer = this.injector.get(Structurer)
    this.container = this.injector.get(VIEW_CONTAINER)
    this.scrollerRef = structurer.scrollerRef

    this.host = createElement('div')
    this.contextmenu = createApp(Dropdown, {
      show: () => this.showRef.value,
      x: () => this.xRef.value,
      y: () => this.yRef.value,
      options: () => this.Options.value,
      to: this.scrollerRef!,
      onSelect: () => {
        // console.log('select')
        this.hide()
      },
      onClickoutside: () => {
        // console.log('clickoutside')
        this.hide()
      }
    })
    this.contextmenu.provide('injector', injector)
    this.contextmenu.mount(this.host)

    this.subs.push(
      fromEvent<PointerEvent>(this.container, 'contextmenu').subscribe(ev => {
        // console.log(ev)
        const target = ev.target as HTMLElement
        if (target.tagName.toLocaleLowerCase() === 'anime') {
            ev.preventDefault() // 阻止默认事件
            ev.stopPropagation() // 阻止事件冒泡
            // console.log('anime')
            const { x, y, options } = this.createFormatMenu(target)
            this.xRef.value = x
            this.yRef.value = y
            this.Options.value = options
            this.show()
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
              const { x, y, options } = this.createComponentMenu(target, component)
              this.xRef.value = x
              this.yRef.value = y
              this.Options.value = options
              this.show()
            }
          }
        }
      }),
      // 滚动时隐藏菜单
      fromEvent(this.scrollerRef!, 'scroll').subscribe(() => {
        this.hide()
      })
    )
  }

  show() {
    this.showRef.value = true
    this.host && this.container?.appendChild(this.host)
  }

  hide() {
    this.showRef.value = false
    this.host?.parentNode?.removeChild(this.host)
  }
  

  createFormatMenu(target: HTMLElement) {
    const { x, y } = getTextNodeEndPosition(target)
    const position = {
      x: x + 10,
      y
    }
    const menus = [
      {
        key: 'remove',
        // icon: () => h(UIIcon, { icon: 'material-icons-filled-' }),
        label: '移除',
        props: {
          onClick: () => {
            this.removeAnimeFormatter(target)
          }
        }
      },
      {
        key: 'update',
        // icon: () => h(UIIcon, { icon: 'material-icons-filled-' }),
        label: '修改',
        children: [
          {
            key: 'options',
            type: 'render',
            render: () => h(AnimeEffectOptions, {
              options: this.animeOptions,
              onSelect: (name, value) => {
                this.updataAnimeFormatter(target, { name, value })
                this.hide()
              }
            })
          }
        ]
      },
      {
        key: 'test',
        label: '动画效果预览',
        props: {
          onClick: () => {
            const dataEffect = target.dataset.effect as string
            this.playAnime(target, dataEffect)
          }
        }
      }
    ]
    return { x: position.x, y: position.y, options: menus }
  }

  createComponentMenu(target: HTMLElement, component: ComponentInstance) {
    const rect = target.getBoundingClientRect()
    const position = {
      x: rect.x + rect.width,
      y: rect.y
    }
    const menus = [
      {
        key: 'remove',
        // icon: () => h(UIIcon, { icon: 'material-icons-filled-' }),
        label: '移除',
        props: {
          onClick: () => {
            this.removeAnimeComponent(component)
            // component.slots.toArray().forEach((slot) => {
            //   slot.sliceContent().forEach((content) => {
            //     if (typeof content !== 'string') {
            //       console.log('移除动画组件')
            //       this.commander.replaceComponent(component, content)
            //     }
            //   })
            // })
          }
        }
      },
      {
        key: 'update',
        // icon: () => h(UIIcon, { icon: 'material-icons-filled-' }),
        label: '修改',
        children: [
          {
            key: 'options',
            type: 'render',
            render: () => h(AnimeEffectOptions, {
              options: this.animeOptions,
              onSelect: (name, value) => {
                this.updataAnimeComponent(component, { name, value })
                this.hide()
              }
            })
          }
        ]
      },
      {
        key: 'test',
        label: '动画效果预览',
        props: {
          onClick: () => {
            const dataEffect = component.state.dataEffect
            const vnode = this.renderer.getVNodeByComponent(component)
            const nativeNode = this.renderer.getNativeNodeByVNode(vnode)
            this.playAnime(nativeNode, dataEffect)
          }
        }
      }
    ]
    return { x: position.x, y: position.y, options: menus }
  }

  /** 更新动画特效 */
  updataAnimeFormatter(dom: HTMLElement, option: { name: string, value: string }) {
    /** 根据虚拟dom获取对应文档中的位置 */
    const location = this.renderer.getLocationByNativeNode(dom)
    if (location) {
      /** 设置选区锚点位置 */
      this.selection.setAnchor(location.slot, location.startIndex)
      /** 设置选区焦点位置 */
      this.selection.setFocus(location.slot, location.endIndex)
      const dataId = dom.dataset.id as string
      const dataSerial = dom.dataset.serial as string
      const dataState = dom.dataset.state as string
      // console.log([dataId, dataSerial, dataState])
      // console.log(option)
      this.commander.applyFormat(animeFormatter, {
        dataId,
        dataSerial,
        dataState,
        dataEffect: option.value,
        dataTitle: option.name,
      })
    }
  }
  updataAnimeComponent(component: ComponentInstance, option: { name: string, value: string }) {
    component.updateState((draft) => {
      draft.dataEffect = option.value
      draft.dataTitle = option.name
    })
  }
  /** 移除动画标记 */
  removeAnimeFormatter(dom: HTMLElement) {
    /** 根据虚拟dom获取对应文档中的位置 */
    const location = this.renderer.getLocationByNativeNode(dom)
    if (location) {
      /** 设置选区锚点位置 */
      this.selection.setAnchor(location.slot, location.startIndex)
      /** 设置选区焦点位置 */
      this.selection.setFocus(location.slot, location.endIndex)
      /** 清除指定格式 */
      this.commander.unApplyFormat(animeFormatter)
    }
  }

  removeAnimeComponent(component: ComponentInstance) {
    component.slots.toArray().forEach((slot) => {
      slot.sliceContent().forEach((content) => {
        if (typeof content !== 'string') {
          this.commander.replaceComponent(component, content)
        }
      })
    })
  }

  /** 测试动画效果 */
  playAnime(target: HTMLElement, effect: string) {
    const display = target.style.display
    target.style.display = 'block' // 设置成 block 才能正常播放动画
    const anime = this.anime.getAnime(effect)
    if(anime) {
      anime.applyEffect(target).finished.then(() => {
        target.style.display = display
      })
    } else {
      target.style.display = display
    }
  }
  // 可选，编辑器销毁时调用
  onDestroy() {
    console.log('anime contextmenu 销毁')
    this.subs.forEach(sub => sub.unsubscribe())
    this.contextmenu?.unmount()
    this.animeOptions = []
    this.hide()
    this.host = null
  }
}

/** 递归查询最后一个文本节点的坐标 */
function getTextNodeEndPosition(element: HTMLElement | ChildNode) {
  const lastChild = element.lastChild
  if (!lastChild) {
    const rect = (element as HTMLElement).getBoundingClientRect()
    return {
      x: rect.x + rect.width,
      y: rect.y
    }
  }
  if (lastChild.nodeType === Node.TEXT_NODE) {
    // 如果最后一个子节点是文本节点
    const range = document.createRange()
    range.setStart(lastChild, (lastChild as any).length)
    range.setEnd(lastChild, (lastChild as any).length)

    const rect = range.getBoundingClientRect()
    return {
      x: rect.x + rect.width,
      y: rect.y,
    }
  } else {
    // 如果最后一个子节点不是文本节点，递归查找
    return getTextNodeEndPosition(lastChild)
  }
}

// createMenu(args: {
//   x: number
//   y: number
//   menus: DropdownOption[]
// }) {
//   const { x, y, menus } = args
//   const host = createElement('div')
//   this.container?.appendChild(host)
//   const dropdown = h(NDropdown, {
//     placement: 'bottom-start',
//     trigger: 'manual',
//     to: this.scrollerRef!, // 确保不会被遮挡
//     x: x,
//     y: y,
//     options: menus,
//     show: true,
//     onClickoutside: () => {
//       destory()
//     },
//     onSelect: () => {
//       console.log('select')
//       destory()
//     }
//   })
//   this.contextmenu = createApp(h(UIConfig, null, {
//     default: () => h(dropdown, { flip: true })
//   }))
//   this.contextmenu.provide('injector', this.injector)
//   this.contextmenu.mount(host)
//   // 滚动时销毁菜单
//   this.scrollSubscription = fromEvent(this.scrollerRef!, 'scroll').subscribe(() => {
//     destory()
//   })

//   const destory = () => {
//     this.contextmenu?.unmount()
//     this.scrollSubscription?.unsubscribe()
//   }

//   return destory
// }

// 改用事件委托的方式处理动画按钮上的点击行为
// this.animeService.onAnimeContextmenu.subscribe(info => {
//   // console.log('onAnimeContextmenu')
//   // if (editor.readonly) return
//   const { event, component } = info
//   const target = event.target as HTMLElement
//   if (component) {
//     const { x, y, options } = this.createComponentMenu(target, component)
//     this.xRef.value = x
//     this.yRef.value = y
//     this.Options.value = options
//     this.show()
//   }
// })