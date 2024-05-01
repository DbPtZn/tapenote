import {
  Commander,
  Injector,
  Plugin,
  Selection,
  Renderer,
  VElement,
  Subscription,
  ComponentInstance,
  fromEvent
} from '@textbus/core'
import { AnimeProvider, AnimeService, Structurer, animeFormatter } from '@/editor'
import { App, createApp, h } from 'vue'
import { NDropdown } from 'naive-ui'
import { VIEW_CONTAINER, createElement } from '@textbus/platform-browser'
import { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'
import { UIConfig } from '@/editor'
import AnimeEffectOptions from './AnimeEffectOptions.vue'
import { Editor } from '@textbus/editor'
export class AnimeContextmenuPlugin implements Plugin {
  private commander!: Commander
  private selection!: Selection
  private renderer!: Renderer
  private animeService!: AnimeService
  private subs!: Subscription[]
  private contextmenu!: App<Element>
  private anime!: AnimeProvider
  private animeOptions: ReturnType<typeof this.anime.getOptions> = []
  constructor() {
    this.subs = []
  }
  setup(injector: Injector) {
    this.commander = injector.get(Commander)
    this.selection = injector.get(Selection)
    this.renderer = injector.get(Renderer)
    this.animeService = injector.get(AnimeService)
    this.anime = injector.get(AnimeProvider)
    this.animeOptions = this.anime.getOptions()
    const editor = injector.get(Editor)
    const structurer = injector.get(Structurer)
    const scrollerRef = structurer.scrollerRef
    const container = injector.get(VIEW_CONTAINER)
    const host = createElement('div')
    container.appendChild(host)
    this.subs.push(
      this.animeService.onAnimeContextmenu.subscribe((info) => {
        if (editor.readonly) return
        const { event, vdom, component } = info
        const target = event.target as HTMLElement
        let menus: DropdownMixedOption[] = []
        let position = {
          x: 0,
          y: 0
        }
        if (vdom) {
          const { x, y } = getTextNodeEndPosition(target)
          position = {
            x: x + 10,
            y
          }
          menus = [
            {
              key: 'remove',
              // icon: () => h(UIIcon, { icon: 'material-icons-filled-' }),
              label: '移除',
              props: {
                onClick: () => {
                  this.removeAnimeFormatter(vdom)
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
                      this.updataAnimeFormatter(vdom, { name, value })
                      this.contextmenu.unmount()
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
                  const dataEffect = vdom.attrs.get('data-effect')
                  const nativeNode = this.renderer.getNativeNodeByVNode(vdom)
                  this.playAnime(nativeNode, dataEffect)
                }
              }
            }
          ]
        }
        if (component) {
          const rect = target.getBoundingClientRect()
          position = {
            x: rect.x + rect.width,
            y: rect.y
          }
          // console.log('component')
          menus = [
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
                      this.contextmenu.unmount()
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
        }
        const dropdown = h(NDropdown, {
          placement: 'bottom-start',
          trigger: 'manual',
          to: scrollerRef!, // 确保不会被遮挡
          x: position.x,
          y: position.y,
          options: menus,
          show: true,
          onClickoutside: () => {
            this.contextmenu.unmount()
          },
          onSelect: () => {
            this.contextmenu.unmount()
          }
        })
        this.contextmenu = createApp(h(UIConfig, null, {
          default: () => h(dropdown, { flip: true })
        }))
        this.contextmenu.provide('injector', injector)
        this.contextmenu.mount(host)
        // 滚动时销毁菜单
        const Subscription = fromEvent(scrollerRef!, 'scroll').subscribe(() => {
          this.contextmenu?.unmount()
          Subscription.unsubscribe()
        })
      })
    )
  }
  /** 更新动画特效 */
  updataAnimeFormatter(vdom: VElement, option: { name: string, value: string }) {
    /** 根据虚拟dom获取对应文档中的位置 */
    const location = this.renderer.getLocationByVNode(vdom)
    if (location) {
      /** 设置选区锚点位置 */
      this.selection.setAnchor(location.slot, location.startIndex)
      /** 设置选区焦点位置 */
      this.selection.setFocus(location.slot, location.endIndex)
      const dataId = vdom.attrs.get('data-id')
      const dataSerial = vdom.attrs.get('data-serial')
      const dataState = vdom.attrs.get('data-state')
      this.commander.applyFormat(animeFormatter, {
        dataId,
        dataSerial,
        dataState,
        dataEffect: option.value,
        title: option.name,
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
  removeAnimeFormatter(vdom: VElement) {
    /** 根据虚拟dom获取对应文档中的位置 */
    const location = this.renderer.getLocationByVNode(vdom)
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
    this.subs.forEach((sub) => sub.unsubscribe())
    this.contextmenu?.unmount()
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