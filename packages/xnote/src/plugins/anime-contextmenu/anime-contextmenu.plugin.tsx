import { Plugin, Subscription, fromEvent } from '@textbus/core'
import { DomAdapter, VIEW_DOCUMENT } from '@textbus/platform-browser'
import { Application, Injector } from '@viewfly/core'
import { useReadonly } from '../../textbus/hooks/use-readonly'
import { createApp } from '@viewfly/platform-browser'
import { AnimeService } from '../../services/anime.service'
import { AnimeContextmenu } from './anime-contextmenu'

export class AnimeContextmenuPlugin implements Plugin {
  private app: Application | null = null
  private host: HTMLElement | null = null
  private viewDocument: HTMLElement | null = null
  private adapter!: DomAdapter
  private animeService!: AnimeService
  private subs: Subscription[] = []

  
  setup(injector: Injector) {
    const App = function () {
      const readonly = useReadonly()
      return () => {
        console.log('readonly', readonly())
        return readonly() ? null : <AnimeContextmenu/>
      }
    }
    this.app = createApp(<App />, {
      context: injector
    })

    this.adapter = injector.get(DomAdapter)
    this.animeService = injector.get(AnimeService)
    this.viewDocument = injector.get(VIEW_DOCUMENT)
    
    this.subs.push(
      fromEvent(this.viewDocument!, 'contextmenu').subscribe(ev => {

        const nativeNode = ev.target as HTMLElement
        // console.log(nativeNode)
        if(nativeNode.tagName.toLocaleLowerCase() === 'anime' || nativeNode.className === 'anime-component-tab') {
          this.animeService.handleContextmenu(nativeNode)
          ev.preventDefault()
          ev.stopPropagation()
        }
      })
    )
    
    this.host = document.createElement('div')
    this.viewDocument?.appendChild(this.host)
    this.app.mount(this.host)
  }

  onDestroy(): void {
    this.app?.destroy()
    this.subs.forEach(sub => sub.unsubscribe())
    if (this.viewDocument && this.host) {
      this.viewDocument.removeChild(this.host)
    }
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
  }
  // 如果最后一个子节点不是文本节点，递归查找
  return getTextNodeEndPosition(lastChild)
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