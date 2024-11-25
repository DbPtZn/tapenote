import { auditTime, filter, fromEvent, Subscription } from '@tanbo/stream'
import {
  Commander,
  ComponentInstance,
  ContentType,
  ContextMenuItem,
  Renderer,
  Slot,
  Selection,
  ContextMenuConfig,
  ContextMenuGroup,
  RootComponentRef,
  triggerContextMenu,
  Plugin,
  Injector
} from '@textbus/core'
import { I18n, Layout, Message, paragraphComponent } from '@textbus/editor'
import { createElement, createTextNode, VIEW_CONTAINER, Parser } from '@textbus/platform-browser'
import { AnimeService } from '../../services/anime.service'
import { MaterialTypeEnum } from '../toolbar/toolkit/_utils/MaterialTypeEnum'
import { MemoService, MessageService, StudioService } from '../../services'
import { Structurer } from '../../providers/structurer.provider'
// import { I18n } from '../../i18n'
// import { Message } from '../message'
// import { paragraphComponent } from '../components/paragraph.component'

export class ContextMenu implements Plugin {
  private eventFromSelf = false
  private subs: Subscription[] = []

  private menuSubscriptions: Subscription[] = []
  private submenuSubscriptions: Subscription[] = []

  private menu: HTMLElement | null = null
  private submenu: HTMLElement | null = null

  setup(injector: Injector) {
    const container = injector.get(VIEW_CONTAINER)
    const i18n = injector.get(I18n)
    const selection = injector.get(Selection)
    const commander = injector.get(Commander)
    const rootComponentRef = injector.get(RootComponentRef)
    const message = injector.get(Message)
    const messageService = injector.get(MessageService)
    const parser = injector.get(Parser)
    const renderer = injector.get(Renderer)
    const memoService = injector.get(MemoService)
    const structurer = injector.get(Structurer)
    const layout = injector.get(Layout)
    const scroller = structurer.scrollerRef
    let animeService: AnimeService | null = null
    let studioService: StudioService | null = null
    try {
      animeService = injector.get(AnimeService)
      studioService = injector.get(StudioService)
    } catch (error) {
      // 非动画模式
    }
    let isAnimeContextmenu = false
    animeService &&
      this.subs.push(
        animeService.onAnimeContextmenu.subscribe(() => {
          isAnimeContextmenu = true
        })
      )
    this.subs.push(
      fromEvent(document, 'mousedown').subscribe(() => {
        this.hide()
      }),
      fromEvent<MouseEvent>(container, 'contextmenu')
        .pipe(animeService ? auditTime(0) : filter(() => true))
        .subscribe(ev => {
          if (isAnimeContextmenu) return (isAnimeContextmenu = false)
          const nativeSelection = document.getSelection()!
          const focusNode = nativeSelection.focusNode
          const offset = nativeSelection.focusOffset
          const isCollapsed = nativeSelection.isCollapsed
          setTimeout(() => {
            if (isCollapsed) {
              if (!nativeSelection.isCollapsed) {
                nativeSelection.collapse(focusNode, offset)
              }
            }
          })
          const menus = ContextMenu.makeContextmenu(ev.target as HTMLElement, selection, renderer)
          const defaultMenus: ContextMenuConfig[] = [
            {
              iconClasses: [`material-icons-outlined-sticky_note_2`],
              label: i18n.get('editor.memo'),
              onClick: () => {
                const target = ev.target as HTMLElement
                const targetRect = target.getBoundingClientRect()
                const middleRect = layout.middle.getBoundingClientRect()
                const scrollerRect = scroller!.getBoundingClientRect()
                //  + containeRect.left - scrollerRect.left
                memoService.createMeno((ev.offsetX / middleRect.width) * 100, ev.offsetY + targetRect.top - scrollerRect.top)
              }
            },
            {
              iconClasses: ['textbus-icon-copy'],
              label: i18n.get('editor.copy'),
              disabled: selection.isCollapsed,
              onClick: () => {
                commander.copy()
              }
            },
            {
              iconClasses: ['textbus-icon-paste'],
              label: i18n.get('editor.paste'),
              // disabled: true,
              onClick: () => {
                navigator.permissions.query({ name: 'clipboard-write' } as any).then(result => {
                  // console.log(result)
                  if (result.state === 'granted') {
                    ;(navigator.clipboard as any).read().then((items: any[]) => {
                      const item = items[0]
                      item.types
                        .filter((i: string) => i === 'text/html')
                        .forEach((type: string) => {
                          ;(item.getType(type) as Promise<Blob>)
                            .then(blob => {
                              return blob.text()
                            })
                            .then(text => {
                              const div = document.createElement('div')
                              div.innerHTML = text
                              commander.paste(
                                parser.parse(text, new Slot([ContentType.BlockComponent, ContentType.Text, ContentType.InlineComponent])),
                                div.innerText
                              )
                            })
                        })
                    })
                  } else {
                    message.danger(i18n.get('editor.input.canNotAccessClipboard'))
                  }
                })
              }
            },
            {
              iconClasses: ['textbus-icon-cut'],
              label: i18n.get('editor.cut'),
              disabled: selection.isCollapsed,
              onClick: () => {
                commander.cut()
              }
            },
            {
              iconClasses: ['textbus-icon-select'],
              label: i18n.get('editor.selectAll'),
              onClick: () => {
                selection.selectAll()
              }
            }
          ]

          studioService &&
            defaultMenus.unshift({
              iconClasses: [`material-icons-outlined-textsms`],
              label: i18n.get('editor.tts'),
              disabled: selection.isCollapsed || selection.getSelectedScopes().length !== 1,
              onClick: () => {
                const slotRanges = selection.getSelectedScopes()
                if (slotRanges.length > 1) return messageService.warning('暂不支持对多段文本进行语音转写')
                const txtArr: string[] = []
                slotRanges.forEach(slotRange => {
                  slotRange.slot.sliceContent().forEach(content => {
                    if (typeof content === 'string') {
                      txtArr.push(content.substring(slotRange.startIndex, slotRange.endIndex))
                    }
                  })
                })
                if (txtArr.length === 0) return messageService.warning('没有可语音转写的文本')
                // console.log(txtArr.join(''))
                studioService?.textToSpeech(txtArr.join(''))
              }
            })

          this.menu = this.show(
            [
              ...menus,
              defaultMenus,
              [
                {
                  label: i18n.get('editor.insertParagraphBefore'),
                  iconClasses: ['textbus-icon-insert-paragraph-before'],
                  disabled: selection.commonAncestorComponent === rootComponentRef.component,
                  onClick: () => {
                    const component = paragraphComponent.createInstance(injector)
                    const ref = selection.commonAncestorComponent
                    if (ref) {
                      commander.insertBefore(component, ref)
                      selection.selectFirstPosition(component)
                    }
                  }
                },
                {
                  label: i18n.get('editor.insertParagraphAfter'),
                  iconClasses: ['textbus-icon-insert-paragraph-after'],
                  disabled: selection.commonAncestorComponent === rootComponentRef.component,
                  onClick: () => {
                    const component = paragraphComponent.createInstance(injector)
                    const ref = selection.commonAncestorComponent
                    if (ref) {
                      commander.insertAfter(component, ref)
                      selection.selectFirstPosition(component)
                    }
                  }
                }
              ]
            ],
            ev.clientX,
            ev.clientY,
            this.menuSubscriptions
          )
          // 允许按 ctrl 时查看 DevTools
          !ev.ctrlKey && ev.preventDefault()
        })
    )
  }

  onDestroy() {
    this.hide()
    this.subs.forEach(i => i.unsubscribe())
    this.submenuSubscriptions.forEach(i => i.unsubscribe())
    this.subs = []
    this.submenuSubscriptions = []
  }

  private static makeContextmenu(source: HTMLElement, selection: Selection, renderer: Renderer) {
    const startSlot = selection.startSlot
    if (!startSlot) {
      return []
    }
    let component: ComponentInstance | null = null
    do {
      const location = renderer.getLocationByNativeNode(source)
      if (location) {
        const current = location.slot.getContentAtIndex(location.startIndex)
        if (location.endIndex - location.startIndex === 1 && typeof current === 'object') {
          component = current
        } else {
          component = location.slot.parent
        }
        break
      } else {
        source = source.parentNode as HTMLElement
      }
    } while (source)
    if (!component) {
      component = selection.commonAncestorComponent!
    }
    if (!component) {
      return []
    }

    return triggerContextMenu(component)
  }

  private hide() {
    this.menuSubscriptions.forEach(i => i.unsubscribe())
    this.menuSubscriptions = []
    this.menu?.parentNode?.removeChild(this.menu)
    this.submenu?.parentNode?.removeChild(this.submenu)
  }

  private show(menus: ContextMenuConfig[][], x: number, y: number, subs: Subscription[]) {
    let groups: HTMLElement
    const container = createElement('div', {
      classes: ['textbus-contextmenu'],
      children: [
        createElement('div', {
          classes: ['textbus-contextmenu-container'],
          children: [
            (groups = createElement('div', {
              classes: ['textbus-contextmenu-groups']
            }))
          ]
        })
      ]
    })
    subs.push(
      fromEvent(container, 'contextmenu').subscribe(ev => {
        ev.preventDefault()
      }),
      fromEvent(document, 'mousedown').subscribe(() => {
        if (!this.eventFromSelf) {
          this.hide()
        }
      }),
      fromEvent(window, 'resize').subscribe(() => {
        setPosition()
      })
    )

    const setPosition = () => {
      const clientWidth = document.documentElement.clientWidth
      const clientHeight = document.documentElement.clientHeight
      if (x + menuWidth >= clientWidth) {
        x -= menuWidth
      }
      if (y + menuHeight >= clientHeight - 20) {
        y = clientHeight - menuHeight - 20
      }

      if (y < 20) {
        y = 20
      }
      Object.assign(container.style, {
        left: (x + 3) + 'px',
        top: y + 'px'
      })
      container.style.maxHeight = clientHeight - y - 20 + 'px'
    }

    let itemCount = 0

    const wrappers: HTMLElement[] = []

    menus.forEach(actions => {
      itemCount += actions.length
      if (actions.length === 0) {
        return
      }
      groups.appendChild(
        createElement('div', {
          classes: ['textbus-contextmenu-group'],
          children: actions
            .map(item => {
              if (Array.isArray((item as ContextMenuGroup).submenu)) {
                return {
                  ...ContextMenu.createMenuView(item, true),
                  item
                }
              }
              return {
                ...ContextMenu.createMenuView(item),
                item
              }
            })
            .map(i => {
              const { wrapper, btn, item } = i
              wrappers.push(wrapper)
              subs.push(
                fromEvent(btn, 'mouseenter').subscribe(() => {
                  if (item.disabled) {
                    return
                  }
                  if (subs === this.menuSubscriptions) {
                    if (this.submenu) {
                      this.submenu.parentNode?.removeChild(this.submenu)
                      this.submenuSubscriptions.forEach(i => i.unsubscribe())
                      this.submenuSubscriptions = []
                    }
                    wrappers.forEach(i => i.classList.remove('textbus-contextmenu-item-active'))
                    if (Array.isArray((item as ContextMenuGroup).submenu)) {
                      const rect = wrapper.getBoundingClientRect()
                      const submenu = this.show(
                        [(item as ContextMenuGroup).submenu as any],
                        rect.left + rect.width,
                        rect.top,
                        this.submenuSubscriptions
                      )
                      wrapper.classList.add('textbus-contextmenu-item-active')
                      this.submenu = submenu
                    }
                  }
                })
              )

              if (!item.disabled && typeof (item as ContextMenuItem).onClick === 'function') {
                btn.addEventListener('mousedown', ev => {
                  this.eventFromSelf = true
                  ev.stopPropagation()
                })
                btn.addEventListener('click', () => {
                  this.hide()
                  ;(item as ContextMenuItem).onClick()
                  this.eventFromSelf = false
                })
              }

              return i.wrapper
            })
        })
      )
    })

    const menuWidth = 180 + 10
    const menuHeight = itemCount * 26 + menus.length * 10 + menus.length + 10

    setPosition()

    document.body.appendChild(container)
    return container
  }

  private static createMenuView(item: ContextMenuConfig, isHostNode = false) {
    const btn = createElement('button', {
      attrs: {
        type: 'button'
      },
      classes: ['textbus-contextmenu-item-btn'],
      props: {
        disabled: item.disabled
      },
      children: [
        createElement('span', {
          classes: ['textbus-contextmenu-item-icon'],
          children: [
            createElement('span', {
              classes: item.iconClasses || []
            })
          ]
        }),
        createElement('span', {
          classes: ['textbus-contextmenu-item-label'],
          children: [createTextNode(item.label)]
        }),
        isHostNode
          ? createElement('span', {
              classes: ['textbus-contextmenu-item-arrow']
            })
          : null
      ]
    })

    const wrapper = createElement('div', {
      classes: item.disabled ? ['textbus-contextmenu-item', 'textbus-contextmenu-item-disabled'] : ['textbus-contextmenu-item'],
      children: [btn]
    })
    return {
      wrapper,
      btn
    }
  }
}
