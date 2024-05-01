import { fromEvent, Subscription } from '@tanbo/stream'
import {
  Commander,
  ComponentInstance,
  ContentType,
  ContextMenuItem,
  // Renderer,
  Slot,
  Selection,
  ContextMenuConfig,
  ContextMenuGroup,
  RootComponentRef,
  triggerContextMenu,
  Plugin,
  Injector
} from '@textbus/core'
import { createElement, createTextNode, VIEW_CONTAINER, Parser, } from '@textbus/platform-browser'
// import { Adapter } from '@textbus/adapter-vue'
import { App, Component, createApp, h, inject } from 'vue'
// import { AdapterInjectToken } from '@/editor/tokens'
import { DropdownOption, NDropdown } from 'naive-ui'
import { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'
import * as UUID from 'uuid'
import { UIIcon } from '../toolbar/toolkit/_utils'
// import { I18n } from '../i18n'
// import { Message } from '../message'
// import { paragraphComponent } from '../components/paragraph.component'

export class ContextMenu implements Plugin {
  private eventFromSelf = false
  private subs: Subscription[] = []

  private menuSubscriptions: Subscription[] = []
  private submenuSubscriptions: Subscription[] = []

  private menu!: App<Element>
  private submenu!: HTMLElement

  setup(injector: Injector) {
    const container = injector.get(VIEW_CONTAINER)
    // const i18n = injector.get(I18n)
    const selection = injector.get(Selection)
    const commander = injector.get(Commander)
    const rootComponentRef = injector.get(RootComponentRef)
    // const adapter = injector.get(DomAdapter)
    // const message = injector.get(Message)
    const parser = injector.get(Parser)
    const host = createElement('div')
    container.appendChild(host)
    // const renderer = injector.get(Renderer)
    this.subs.push(
      // fromEvent(document, 'mousedown').subscribe(() => {
      //   this.hide()
      // }),
      fromEvent<MouseEvent>(container, 'contextmenu').subscribe(ev => {
        // console.log(ev)
        // console.log(selection.commonAncestorComponent)
        // console.log(selection.getBlocks())
        // triggerContextMenu(selection.getBlocks().filter(item))
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
        // const menus = ContextMenu.makeContextmenu(ev.target as HTMLElement, selection, adapter)
        // console.log(menus)
        const defaultMenus: ContextMenuConfig[] = [
          {
            iconClasses: ['textbus-icon-copy'],
            label: '复制',
            disabled: selection.isCollapsed,
            onClick: () => {
              console.log('复制')
              commander.copy()
            }
          },
          {
            iconClasses: ['textbus-icon-paste'],
            label: '粘贴',
            // disabled: true,
            onClick: () => {
              // console.log('粘贴')
              navigator.permissions.query({ name: 'clipboard-write' } as any).then(result => {
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
                  // message.danger(i18n.get('editor.input.canNotAccessClipboard'))
                  alert('无法访问剪切板！')
                }
              })
            }
          },
          {
            iconClasses: ['textbus-icon-cut'],
            label: '剪切',
            disabled: selection.isCollapsed,
            onClick: () => {
              commander.cut()
            }
          },
          {
            iconClasses: ['textbus-icon-select'],
            label: '全选',
            onClick: () => {
              selection.selectAll()
            }
          }
        ]
        /** 渲染Icon */
        const renderIcon = (icon: string[] | undefined) => {
          if(!icon) return
          return () => {
            return h(UIIcon, { icon: icon.join(' ') })
          }
        }
        function dropdownOptionMap(item: ContextMenuConfig): DropdownMixedOption {
          if ('submenu' in item) {
            const submenu = item.submenu as ContextMenuConfig[]
            return {
              key: UUID.v4(),
              icon: renderIcon(item.iconClasses),
              label: item.label,
              disabled: item.disabled,
              children: submenu.map(dropdownOptionMap)
            }
          }
          return {
            key: UUID.v4(),
            icon: renderIcon(item.iconClasses),
            label: item.label,
            disabled: item.disabled,
            props: {
              onClick: item.onClick
            }
          }
        }
        this.menu = this.show(
          [
            // ...menus.flat().map(dropdownOptionMap),
            ...defaultMenus.map(dropdownOptionMap)
          ],
          host,
          ev.clientX,
          ev.clientY,
          this.menuSubscriptions
        )
        ev.preventDefault()
      })
    )
  }

  destroy() {
    // this.hide()
    this.subs.forEach(i => i.unsubscribe())
    this.subs = []
  }

  // private static makeContextmenu(source: HTMLElement, selection: Selection, adapter: DomAdapter<any, any>) {
  //   const startSlot = selection.startSlot
  //   if (!startSlot) {
  //     return []
  //   }
  //   let component: ComponentInstance | null = null
  //   do {
  //     // const location = renderer.getLocationByNativeNode(source)
  //     const location = adapter.getLocationByNativeNode(source)
  //     if (location) {
  //       const current = location.slot.getContentAtIndex(location.startIndex)
  //       if (location.endIndex - location.startIndex === 1 && typeof current === 'object') {
  //         component = current
  //       } else {
  //         component = location.slot.parent
  //       }
  //       break
  //     } else {
  //       source = source.parentNode as HTMLElement
  //     }
  //   } while (source)
  //   if (!component) {
  //     component = selection.commonAncestorComponent!
  //   }
  //   if (!component) {
  //     return []
  //   }

  //   return triggerContextMenu(component)
  // }

  private show(menus: DropdownMixedOption[], host: HTMLElement, x: number, y: number, subs: Subscription[]) {
    const dropdown = h(NDropdown, {
      placement: 'bottom-start',
      trigger: 'manual',
      x: x,
      y: y,
      options: menus,
      show: true,
      onClickoutside: () => {
        contextmenu.unmount()
      },
      onSelect: () => {
        contextmenu.unmount()
      }
    })
    const contextmenu = createApp(dropdown)
    contextmenu.mount(host)
    return contextmenu
  }
  private hide() {
    this.menuSubscriptions.forEach(i => i.unsubscribe())
    this.menuSubscriptions = []
    // this.menu?.parentNode?.removeChild(this.menu)
    this.menu && this.menu.unmount()
    this.submenu?.parentNode?.removeChild(this.submenu)
  }
}