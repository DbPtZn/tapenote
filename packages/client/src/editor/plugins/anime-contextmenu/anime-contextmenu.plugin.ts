import {
  Commander,
  Injector,
  Plugin,
  Selection,
  Renderer,
  Subscription,
  ComponentInstance,
  fromEvent,
} from '@textbus/core'
import { AnimeProvider, AnimeService, Structurer, animeFormatter } from '../..'
import { App, Ref, createApp, h, ref } from 'vue'
import { VIEW_CONTAINER, createElement } from '@textbus/platform-browser'
import { DropdownOption } from 'naive-ui'
import AnimeEffectOptions from './AnimeEffectOptions.vue'
import Dropdown from './Dropdown.vue'
export class AnimeContextmenuPlugin implements Plugin {
  private commander!: Commander
  private selection!: Selection
  private renderer!: Renderer
  private subs: Subscription[] = []
  private contextmenu: App<Element> | null = null
  private animeProvider!: AnimeProvider
  private animeOptions: ReturnType<typeof this.animeProvider.getOptions> = []
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
    this.animeProvider = injector.get(AnimeProvider)
    this.animeOptions = this.animeProvider.getOptions()
    const structurer = this.injector.get(Structurer)
    this.container = this.injector.get(VIEW_CONTAINER)
    this.scrollerRef = structurer.rootRef!.parentElement
    const animeService = injector.get(AnimeService)

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
        ev.preventDefault() // 阻止默认事件
        ev.stopPropagation() // 阻止事件冒泡
        const target = ev.target as HTMLElement
        const element = AnimeProvider.toAnimeElement(target)
        // console.log(element)
        if(!element) return
        if (element.tagName.toLocaleLowerCase() === 'anime') {
          // ev.preventDefault() // 阻止默认事件
          // ev.stopPropagation() // 阻止事件冒泡
          animeService.handleAnimeContextmenu()
          // console.log('anime')
          const { x, y, options } = this.createFormatMenu(target)
          this.xRef.value = x
          this.yRef.value = y
          this.Options.value = options
          this.show()
          return
        }
        if (element.tagName.toLocaleLowerCase() === 'anime-component') {
          // ev.preventDefault() // 阻止默认事件
          // ev.stopPropagation() // 阻止事件冒泡
          animeService.handleAnimeContextmenu()
          // console.log(node)
          const component = this.renderer.getComponentByNativeNode(target)
          if(component) {
            const { x, y, options } = this.createComponentMenu(target, component)
            this.xRef.value = x
            this.yRef.value = y
            this.Options.value = options
            this.show()
          }
          return
        }
        if (element.dataset.anime) {
          // ev.preventDefault() // 阻止默认事件
          // ev.stopPropagation() // 阻止事件冒泡
          animeService.handleAnimeContextmenu()
          const component = this.renderer.getComponentByNativeNode(element)
          if(component) {
            const { x, y, options } = this.createComponentMenu(element, component)
            this.xRef.value = x
            this.yRef.value = y
            this.Options.value = options
            this.show()
            // console.log('show')
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
    let x = 0
    let y = 0
    let display
    if(target.getElementsByTagName('img').length > 0) {
      display = target.style.display
      target.style.display = 'inline-block'
      const rect = target.getBoundingClientRect()
      x = rect.x + rect.width + 10
      y = rect.y
      target.style.display = display
    } else {
      const position = getTextNodeEndPosition(target)
      x = position.x + 10
      y = position.y
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
                // this.updataAnimeFormatter(target, { name, value })
                const animeId = target.dataset.id
                if(!animeId) return
                this.animeProvider.updateAnimeState(animeId, { effect: value, title: name })
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
            this.playAnime(target, dataEffect, true)
          }
        }
      }
    ]
    return { x: x, y: y, options: menus }
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
            this.animeProvider.removeAnime(component)
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
                const animeId = component.state.dataId
                this.animeProvider.updateAnimeState(animeId, { effect: value, title: name })
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

  /** 测试动画效果 */
  playAnime(target: HTMLElement, effect: string, isInline = false) {
    target.classList.add('anime-badge-hide')
    const display = target.style.display
    isInline && (target.style.display = 'inline-block') // 设置成 block 才能正常播放动画
    const anime = this.animeProvider.getAnime(effect)
    if(anime) {
      anime.play(target).finished.then(() => {
        isInline && (target.style.display = display)
        target.classList.remove('anime-badge-hide')
      })
    } else {
      isInline && (target.style.display = display)
      target.classList.remove('anime-badge-hide')
    }
  }
  // 可选，编辑器销毁时调用
  onDestroy() {
    // console.log('anime contextmenu 销毁')
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