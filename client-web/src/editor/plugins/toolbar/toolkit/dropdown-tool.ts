import { Controller, Injector, Keyboard, Keymap } from '@textbus/core'
import { Tool } from '../types'
import { ButtonToolConfig } from './button-tool'
import { SelectToolConfig } from './select-tool'
import { PopoverToolConfig } from './popover-tool'
import { Ref, h, ref } from 'vue'
import { UIDropdown } from './_utils'
import { DialogToolConfig } from './dialog-tool'
import { DialogProvider } from '@/editor'
export enum ToolType {
  Button = 'button',
  Select = 'select',
  Render = 'render',
  Dialog = 'dialog'
}

export interface ButtonToolMenu extends ButtonToolConfig {
  type: ToolType.Button
}

export interface SelectToolMenu extends SelectToolConfig {
  type: ToolType.Select
  label: string
}

export interface PopoverMenu extends PopoverToolConfig {
  type: ToolType.Render
}

export interface DialogMenu extends DialogToolConfig {
  type: ToolType.Dialog
}

export interface DropdownToolConfig {
  /** 设置按扭显示的文字 */
  label?: string;
  /** 给按扭控件添加一组 css class 类 */
  classes?: string[];
  /** 给按扭控件添加一组 icon css class 类 */
  iconClasses?: string[];
  /** 当鼠标放在控件上的提示文字 */
  tooltip?: string;
  // items: Array<ButtonToolMenu | SelectToolMenu | DropdownMenu | DialogMenu>
  options: Array<ButtonToolMenu | SelectToolMenu | PopoverMenu | DialogMenu>
}

interface GroupItemConfig {
  label: string
  keymap?: Keymap
  /** 给按扭控件添加一组 css class 类 */
  classes?: string[];
  /** 给按扭控件添加一组 icon css class 类 */
  iconClasses?: string[];
  isDropdown: boolean
}

interface ToolItem {
  elementRef: HTMLElement,

  refreshState(): void

  disabled(is: boolean): void
}

export class DropdownTool implements Tool {
  private menus: ToolItem[] = []
  private isHighlight: Ref<boolean>
  private isDisabled: Ref<boolean>
  private controller!: Controller

  constructor(private factory: (injector: Injector) => any) {
    this.isHighlight = ref(false)
    this.isDisabled = ref(false)
  }

  setup(injector: Injector, limitElement: HTMLElement) {
    const config = this.factory(injector)
    const keyboard = injector.get(Keyboard)
    const dialog = injector.get(DialogProvider)
    this.controller = injector.get(Controller)
    // console.log(config)
    // this.config = config
    // eslint-disable-next-line array-callback-return
    const menus = config.options.map(option => {
      switch (option.type) {
        case ToolType.Button:
          return option
        case ToolType.Select:
          return this.createSelect(option, keyboard)
        case ToolType.Render:
          return this.createPopover(option, keyboard)
        case ToolType.Dialog:
          return this.createDialog(option, dialog, injector, keyboard)
      }
    })
    // this.menus = menus
    // const dropdown = createElement('div', {
    //   classes: ['textbus-toolbar-group-menu'],
    //   children: menus.map(i => i!.elementRef)
    // })
    // console.log(menus)
    const dropdown = h(UIDropdown, {
      class: config.class,
      iconClasses: config.iconClasses,
      tooltip: config.tooltip,
      label: config.label,
      options: menus,
      highlight: () => this.isHighlight.value,
      disabled: () => this.isDisabled.value,
    })
    this.controller.onReadonlyStateChange.subscribe(v => {
      this.isDisabled.value = v
    })
    // const dropdown = createDropdown({
    //   ...config,
    //   menuView: groupItemGroup,
    //   stickyElement: limitElement
    // })
    // this.controller.onReadonlyStateChange.subscribe(v => {
    //   // dropdown.disabled = v
    //   menus.forEach(i => {
    //     i.disabled(v)
    //   })
    // })
    // this.uiDropdown = dropdown
    // this.controller.onReadonlyStateChange.subscribe(() => {
    //   this.isDisabled.value = this.controller.readonly
    // })
    return dropdown
  }

  refreshState() {
    this.menus.forEach(i => i.refreshState())
  }

  disabled() {
    //
  }
  private createDialog(config: DialogMenu, dialog: DialogProvider, injector: Injector, keyboard: Keyboard) {
    
    return {
      label: config.label,
      iconClasses: config.classes?.join(' '),
      classes: config.classes?.join(' '),
      type: config.type,
      onClick: () => {
        dialog.create({
          content: config.view
        }, injector)
      }
    }
  }

  private createPopover(config: PopoverMenu, keyboard: Keyboard) {
    return {
      label: config.label,
      classes: config.classes?.join(' '),
      type: config.type,
      render: config.views[0]
    }
  }
  private createSelect(config: SelectToolMenu, keyboard: Keyboard) {
    const options = config.options.map(option => {
      return {
        label: option.label,
        classes: option.classes?.join(' '),
        props: {
          onClick: () => {
            config.onChecked(option.value)
          }
        }
      }
    })
    return {
      label: config.label,
      type: config.type,
      children: [
        ...options
      ]
    }
  }

  // private createDialog(config: DialogToolConfig, keyboard: Keyboard, dialog: Dialog) {
  //   const item = this._createItem({
  //     ...config,
  //     label: config.label || '',
  //     isDropdown: false
  //   })

  //   fromEvent(item.elementRef, 'click').subscribe(() => {
  //     dialog.show(config.viewController.elementRef)
  //     this.uiDropdown.hide()
  //   })

  //   const defaultValue: any = {}
  //   let prevValue = defaultValue

  //   config.viewController.onComplete.subscribe(value => {
  //     prevValue = value
  //     config.useValue(value)
  //     dialog.hide()
  //   })
  //   config.viewController.onCancel.subscribe(() => {
  //     dialog.hide()
  //   })
  //   if (config.keymap) {
  //     keyboard.addShortcut({
  //       keymap: config.keymap,
  //       action() {
  //         if (!item.disabled && prevValue !== defaultValue) {
  //           config.useValue(prevValue)
  //         }
  //       }
  //     })
  //   }
  //   const controller = this.controller
  //   return {
  //     elementRef: item.elementRef,
  //     disabled(is: boolean) {
  //       item.disabled = is
  //     },
  //     refreshState() {
  //       if (!config.queryState) {
  //         return
  //       }
  //       const viewer = item
  //       if (controller.readonly) {
  //         viewer.disabled = true
  //         viewer.highlight = false
  //         return
  //       }
  //       const state = config.queryState()
  //       switch (state.state) {
  //         case QueryStateType.Disabled:
  //           viewer.disabled = true
  //           viewer.highlight = false
  //           config.viewController.reset()
  //           break
  //         case QueryStateType.Enabled:
  //           viewer.disabled = false
  //           viewer.highlight = true
  //           config.viewController.update(state.value)
  //           break
  //         case QueryStateType.Normal:
  //           viewer.disabled = false
  //           viewer.highlight = false
  //           config.viewController.reset()
  //       }
  //     }
  //   }
  // }

  // private createDropdown(config: DropdownToolConfig, keyboard: Keyboard) {
  //   const item = this._createItem({
  //     ...config,
  //     label: config.label || '',
  //     isDropdown: true
  //   })

  //   const menu = createElement('div', {
  //     classes: ['textbus-toolbar-submenu'],
  //     children: [
  //       config.viewController.elementRef
  //     ]
  //   })

  //   const defaultValue: any = {}

  //   let prevValue = defaultValue

  //   config.viewController.onComplete.subscribe(v => {
  //     prevValue = v
  //     config.useValue(v)
  //     this.uiDropdown.hide()
  //   })

  //   if (config.keymap) {
  //     keyboard.addShortcut({
  //       keymap: config.keymap,
  //       action() {
  //         if (!item.disabled && prevValue !== defaultValue) {
  //           config.useValue(prevValue)
  //         }
  //       }
  //     })
  //   }

  //   item.elementRef.appendChild(menu)

  //   const controller = this.controller
  //   return {
  //     elementRef: item.elementRef,
  //     disabled(is: boolean) {
  //       item.disabled = is
  //     },
  //     refreshState() {
  //       if (!config.queryState) {
  //         return
  //       }
  //       const viewer = item
  //       if (controller.readonly) {
  //         viewer.disabled = true
  //         viewer.highlight = false
  //         return
  //       }
  //       const state = config.queryState()
  //       switch (state.state) {
  //         case QueryStateType.Disabled:
  //           viewer.disabled = true
  //           viewer.highlight = false
  //           config.viewController.reset()
  //           break
  //         case QueryStateType.Enabled:
  //           viewer.disabled = false
  //           viewer.highlight = true
  //           config.viewController.update(state.value)
  //           break
  //         case QueryStateType.Normal:
  //           viewer.disabled = false
  //           viewer.highlight = false
  //           config.viewController.reset()
  //       }
  //     }
  //   }
  // }

  // private createSelect(config: SelectToolMenu, keyboard: Keyboard): ToolItem {
  //   const item = this._createItem({
  //     ...config,
  //     isDropdown: true
  //   })

  //   const map = new Map<SelectOptionConfig, Element>()

  //   const menu = createElement('div', {
  //     classes: ['textbus-toolbar-submenu'],
  //     children: [
  //       createElement('div', {
  //         classes: ['textbus-toolbar-select-options'],
  //         children: config.options.map(option => {
  //           const el = createOption({
  //             ...option,
  //             onClick: () => {
  //               config.onChecked(option.value)
  //               this.uiDropdown.hide()
  //             }
  //           })
  //           map.set(option, el)
  //           if (option.keymap) {
  //             keyboard.addShortcut({
  //               keymap: option.keymap,
  //               action() {
  //                 if (!item.disabled) {
  //                   config.onChecked(option.value)
  //                 }
  //               }
  //             })
  //           }
  //           return el
  //         })
  //       })
  //     ]
  //   })
  //   item.elementRef.appendChild(menu)

  //   const controller = this.controller
  //   return {
  //     elementRef: item.elementRef,
  //     disabled(is: boolean) {
  //       item.disabled = is
  //     },
  //     refreshState() {
  //       if (!config.queryState) {
  //         return
  //       }
  //       const viewer = item
  //       if (controller.readonly) {
  //         viewer.disabled = true
  //         viewer.highlight = false
  //         return
  //       }
  //       const state = config.queryState()
  //       switch (state.state) {
  //         case QueryStateType.Disabled:
  //           viewer.disabled = true
  //           viewer.highlight = false
  //           break
  //         case QueryStateType.Enabled:
  //           viewer.disabled = false
  //           viewer.highlight = true
  //           map.forEach((el, config) => {
  //             if (config.value === state.value) {
  //               el.classList.add('textbus-toolbar-option-active')
  //             } else {
  //               el.classList.remove('textbus-toolbar-option-active')
  //             }
  //           })
  //           break
  //         case QueryStateType.Normal:
  //           viewer.disabled = false
  //           viewer.highlight = false
  //           map.forEach((el) => {
  //             el.classList.remove('textbus-toolbar-option-active')
  //           })
  //       }
  //     }
  //   }
  // }

  // private createButton(config: ButtonToolMenu, keyboard: Keyboard): ToolItem {
  //   const item = this._createItem({
  //     ...config,
  //     label: config.label || '',
  //     isDropdown: false
  //   })

  //   fromEvent(item.elementRef, 'click').subscribe(() => {
  //     config.onClick()
  //     this.uiDropdown.hide()
  //   })

  //   if (config.keymap) {
  //     keyboard.addShortcut({
  //       keymap: config.keymap,
  //       action() {
  //         if (!item.disabled) {
  //           config.onClick()
  //         }
  //       }
  //     })
  //   }

  //   const controller = this.controller
  //   return {
  //     elementRef: item.elementRef,
  //     disabled(is: boolean) {
  //       item.disabled = is
  //     },
  //     refreshState() {
  //       if (!config.queryState) {
  //         return
  //       }
  //       const viewer = item
  //       if (controller.readonly) {
  //         viewer.disabled = true
  //         viewer.highlight = false
  //         return
  //       }
  //       const state = config.queryState()
  //       switch (state.state) {
  //         case QueryStateType.Disabled:
  //           viewer.disabled = true
  //           viewer.highlight = false
  //           break
  //         case QueryStateType.Enabled:
  //           viewer.disabled = false
  //           viewer.highlight = true
  //           break
  //         case QueryStateType.Normal:
  //           viewer.disabled = false
  //           viewer.highlight = false
  //       }
  //     }
  //   }
  // }

  // private _createItem(config: GroupItemConfig) {
  //   const button = createElement('button', {
  //     attrs: {
  //       type: 'button'
  //     },
  //     classes: ['textbus-toolbar-group-button'],
  //     children: [
  //       config.iconClasses ? createElement('span', {
  //         classes: [...config.iconClasses, 'textbus-toolbar-group-button-icon']
  //       }) : null,
  //       createElement('span', {
  //         classes: ['textbus-toolbar-group-button-label'],
  //         children: [
  //           createTextNode(config.label)
  //         ]
  //       }),
  //       config.keymap ? createElement('span', {
  //         classes: ['textbus-toolbar-group-button-keymap'],
  //         children: createKeymap(config.keymap)
  //       }) : null,
  //       config.isDropdown ? createElement('span', {
  //         classes: ['textbus-toolbar-group-button-caret']
  //       }) : null
  //     ]
  //   }) as HTMLButtonElement
  //   const wrapper = createElement('div', {
  //     classes: ['textbus-toolbar-group-item'],
  //     children: [
  //       button
  //     ]
  //   })

  //   let highlight = false
  //   let disabled = false

  //   return {
  //     elementRef: wrapper,
  //     get highlight() {
  //       return highlight
  //     },
  //     set highlight(v: boolean) {
  //       highlight = v
  //       if (v) {
  //         button.classList.add('textbus-toolbar-group-button-active')
  //       } else {
  //         button.classList.remove('textbus-toolbar-group-button-active')
  //       }
  //     },
  //     get disabled() {
  //       return disabled
  //     },
  //     set disabled(v: boolean) {
  //       disabled = v
  //       button.disabled = v
  //     }
  //   }
  // }
}
