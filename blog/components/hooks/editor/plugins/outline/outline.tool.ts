import { OutlineService } from './outline.service'
import { Injector } from '@textbus/core'
import { OutlineButtonTool, OutlineButtonToolConfig } from './utils/outlineButton-tool'
import { SwitchButtonState, SwitchButtonTool, SwitchButtonToolConfig } from '../toolbar'
import { MaterialTypeEnum } from '../..'

export function outlineToolConfigFactory(injector: Injector, updateState: (state: SwitchButtonState) => void): SwitchButtonToolConfig {
  const outlineService = injector.get(OutlineService)
  return {
    iconClasses: [`${MaterialTypeEnum.FILLED}view_sidebar`],
    tooltip: '大纲视图',
    // label: '大纲视图',
    keymap: {
      ctrlKey: true,
      key: ';'
    },
    onClick() {
      outlineService.handleExpand()
      updateState({
        highlight: outlineService.isExpanded
      })
    }
  }
}
export function outlineTool() {
  return new SwitchButtonTool(outlineToolConfigFactory)
}


// class OutlineCollapseTool {
//   private app!: App | null
//   constructor() {
//     //
//   }
//   setup(injector: Injector, limitElement: HTMLElement): HTMLElement {
//     const rootComponent = injector.get(RootComponentRef)
//     const renderer = injector.get(Renderer)
//     const layout = injector.get(Layout)
//     const selection = injector.get(Selection)
//     const commander = injector.get(Commander)
//     const outlineService = injector.get(OutlineService)
//     const container = layout.container
//     const btn = createElement('div', {
//       classes: ['outline-expand-btn'],
//       children: [createTextNode('大纲视图')],
//       on: {
//         click: () => {
//           outlineService.handleExpand()
//         }
//       }
//     })
//     const warpper = createElement('div', {
//       styles: {
//         position: 'relative',
//         display: 'inline-block'
//       },
//       // children: [btn]
//     })
//     this.app = createApp(OutlineBtn, { handleClick: () => outlineService.handleExpand() })
//     this.app.mount(warpper)
//     return warpper
//   }
//   refreshState(): void {
//     // throw new Error('Method not implemented.')
//   }
//   disabled(is: boolean): void {
//     throw new Error('Method not implemented.')
//   }
//   onDestroy?(): void {
//     throw new Error('Method not implemented.')
//   }
// }

// export function outlineCollapseTool() {
//   return new OutlineCollapseTool()
// }