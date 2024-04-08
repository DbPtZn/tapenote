import { auditTime, merge, Subscription } from '@tanbo/stream'
import { makeError, Selection, Plugin, Injector } from '@textbus/core'
import _ from 'lodash'
import { Tool } from './types'
import ToolbarView from './ToolbarView.vue'
import { createApp, h, VNode } from 'vue'
import { UIConfig } from '../../common'

const toolbarErrorFn = makeError('Toolbar')

interface ToolFactory {
  (): Tool
}
/**
 * 编辑器工具条
 */
export class Toolbar implements Plugin {
  private toolWrapper!: HTMLElement
  private subs: Subscription[] = []
  public tools: Array<Tool | Tool[]>

  constructor(
    private toolFactories: Array<ToolFactory | ToolFactory[]> = [],
    private host: HTMLElement
  ) {
    this.tools = toolFactories.map((i) => {
      return Array.isArray(i) ? i.map((j) => j()) : i()
    })
    this.toolWrapper = host
  }
  setup(injector: Injector): void {
    const selection = injector.get(Selection)
    const components: VNode[] = []
    this.tools.forEach((tool) => {
      // 如果是工具组
      if (Array.isArray(tool)) {
        const groupWrapper: VNode[] = []
        tool.forEach((t) => {
          groupWrapper.push(t.setup(injector, this.toolWrapper))
        })
        components.push(h('div', { class: 'group-wrapper' }, groupWrapper))
        return
      }
        components.push(tool.setup(injector, this.toolWrapper))
    })
    // 工具条主框架
    const toolbarView = createApp(h(UIConfig, null, {
      default: () => h(ToolbarView, { cmpts: components })
    }))
    toolbarView.provide('injector', injector) // 向 vue 工具条注入编辑器依赖
    toolbarView.mount(this.host!)

    const tools = this.tools.flat()
    this.subs.push(
      merge(
        selection.onChange,
        // refreshService.onRefresh,
      ).pipe(auditTime(100)).subscribe(() => {
        tools.forEach(tool => {
          tool.refreshState()
        })
      })
    )
  }

  onDestroy() {
    this.subs.forEach((i) => i.unsubscribe())
  }

}

// /** 统计片段时长 */
// calSum(array) {
//   let sum = 0
//   this.data.forEach((item) => {
//     sum += item.duration
//     // console.log(item.duration)
//   })
//   // console.log(sum)
//   return secTotime(sum)
// }
/**
 * (widthSequence.length - 1) * 8 是所有按钮组的左右外边距之和
 * 20 是 toolWrapper 的左右内边距
 * _.sum(widthSequence) 是所有按钮组的宽度之和
 */
// console.log((widthSequence.length - 1) * 8 + 20) // 148
// console.log(_.sum(widthSequence)) // 952
// console.log(this.toolWrapper.offsetWidth) // 1100
// boundarySequence.forEach((item, index, arr) => {
//   // console.log([toolbar.offsetWidth - 50, item])
//   // console.log(toolbar.offsetWidth - 50 < item)
//   if (toolbar.offsetWidth - 50 < item) {
//     console.log('bbb ')
//     if (toolWrapper.children[boundarySequence.length - index - 1]) {
//       collapseWrapper.insertBefore(
//         toolWrapper.children[boundarySequence.length - index - 1],
//         collapseWrapper.firstChild
//       )
//       // return
//     }
//   } else {
//     // console.log(boundarySequence.length - index - 1)
//     /** 反之，如果本来该有按钮位置没用按钮，就应该从折叠工具条中将按钮取回 */
//     // console.log(toolWrapper.children[boundarySequence.length - index - 1])
//     // console.log(!toolWrapper.children[boundarySequence.length - index - 1])
//     if (!toolWrapper.children[boundarySequence.length - index - 1]) {
//       // console.log(collapseWrapper.children[0])
//       if (collapseWrapper.children[0]) {
//         toolWrapper.appendChild(collapseWrapper.children[0])
//       }
//       index--
//       // if (collapseWrapper.firstChild) {
//       //   toolWrapper.appendChild(collapseWrapper.firstChild)
//       // }
//       // return
//     }
//   }
// })
