import {
  Injector,
  makeError,
  NativeSelectionBridge,
  Renderer,
  Selection,
  Slot,
  Subscription,
  Plugin
} from '@textbus/core'
import { Editor, Layout } from '@textbus/editor'
import { auditTime, fromEvent } from '@tanbo/stream'
import { createElement, SelectionBridge, VIEW_CONTAINER } from '@textbus/platform-browser'
import { App, VNode, createApp, h } from 'vue'
import InlineToolbarView from './InlineToolbarView.vue'
import { Tool } from '../toolbar/types'
import { UIConfig } from '../../common'

const toolbarErrorFn = makeError('Toolbar')

interface ToolFactory {
  (): Tool
}

export class InlineToolbarPlugin implements Plugin {
  private toolbarRef!: HTMLElement
  private toolWrapper!: HTMLElement
  private subsA: Subscription[] = []
  private subsB: Subscription[] = []
  private tools: Array<any>
  private toolbarWidth: number
  private toolbarHeight: number
  private components: VNode[] = []
  private toolbarView: App | null = null

  constructor(private toolFactories: Array<ToolFactory | ToolFactory[]> = [], private scroller: HTMLElement) {
    this.tools = toolFactories.map((i) => {
      return Array.isArray(i) ? i.map((j) => j()) : i()
    })
    this.scroller = scroller
    // 初始值作用于行内工具条首次挂载时，在行内工具条首次挂载后会自动更新为工具条实际宽度
    this.toolbarWidth = 300
    // 工具条高度，用于计算行内工具条显示时的位置（无法在渲染前获取工具条高度，只能手动设置）
    this.toolbarHeight = 50
  }

  setup(injector: Injector) {
    const selection = injector.get(Selection)
    const layout = injector.get(Layout)
    const renderer = injector.get(Renderer)
    const editor = injector.get(Editor)
    const nativeSelectionBridge = injector.get(SelectionBridge) // 本地选区桥梁 ？
    // const container = injector.get(VIEW_CONTAINER)
    const container = layout.container // 必须是外层的容器，这样鼠标事件才能在这个容器上触发
    // console.log(nativeSelectionBridge)
    // const container = layout.container

    this.toolbarRef = createElement('div', {
      classes: ['textbus-fast-toolbar'],
      children: [
        (this.toolWrapper = createElement('div', {
          classes: ['textbus-fast-toolbar-wrapper']
        }))
      ]
    })
    this.tools.forEach((tool) => {
      if (Array.isArray(tool)) {
        const groupWrapper: VNode[] = []
        tool.forEach((t) => {
          groupWrapper.push(t.setup(injector, this.toolWrapper))
        })
        this.components.push(h('div', { class: 'group-wrapper' }, groupWrapper))
        return
      }
      this.components.push(tool.setup(injector, this.toolWrapper))
    })
    // 工具条主框架
    this.toolbarView = createApp(h(UIConfig, null, {
      default: () => h(InlineToolbarView, { cmpts: this.components })
    }))
    this.toolbarView.provide('injector', injector)
    this.toolbarView.mount(this.toolWrapper)
    this.subsA.push(
      selection.onChange.pipe(auditTime(300)).subscribe(() => {
        // 阻止创建多个事件监听器
        if (this.subsB.length === 0) {
          this.subsB.push(
            // 浏览器窗口缩放的时候更新（必要性不高）
            // fromEvent(window, 'resize').subscribe(() => {
            //   this.onSelectionChange(
            //     document,
            //     selection,
            //     nativeSelectionBridge,
            //     container
            //   )
            // }),
            fromEvent(container, 'mouseup').pipe(auditTime(5)).subscribe(() => {
              this.onSelectionChange(
                document,
                selection,
                nativeSelectionBridge,
                container
              )
            }),
            /** 输入新内容时更新/关闭工具条 */
            editor.onChange.subscribe(() => {
              this.onSelectionChange(
                document,
                selection,
                nativeSelectionBridge,
                container
              )
            })
          )
        }
      }),
    )
  }

  onDestroy() {
    // console.log('销毁行内工具条')
    this.subsA.forEach((i: any) => i.unsubscribe())
    this.subsB.forEach((i: any) => i.unsubscribe())

    this.components.length = 0
    this.components = []
    
    this.toolbarView?.unmount()

    this.tools.length = 0
    this.tools = []
  }

  private onSelectionChange(
    document: Document,
    selection: Selection,
    bridge: SelectionBridge,
    container: HTMLElement,
  ) {
    // 选区对象
    const nativeSelection = <globalThis.Selection>document.getSelection()
    // 选区范围
    const firstNativeRange = nativeSelection.rangeCount ? nativeSelection.getRangeAt(0) : null
    // 选区闭合状态 （选中内容时为 false）
    if (!nativeSelection.isCollapsed) {
      if (firstNativeRange) {
        // 简单理解是选区所有节点中，最外层节点的父级（不完全准确）
        const focusNode = firstNativeRange.commonAncestorContainer
        // console.log(firstNativeRange.commonAncestorContainer)
        if (focusNode) {
          // 简单理解就是： 如果 focusNode 是 text 纯文本，那么就获取其所在的标签块，即 parentNode
          const node = focusNode.nodeType === Node.TEXT_NODE ? focusNode.parentNode : focusNode
          if (node) {
            // 获取原生选区的坐标位置
            const rect = bridge.getRect({
              slot: selection.startSlot!,
              offset: selection.startOffset!
            })!
            // 获取元素的矩形坐标信息
            /** container */
            const containerRect = container.getBoundingClientRect()
            const containerLeft = containerRect.left
            const containerTop = containerRect.top // 容器上边界
            const containerRight = containerRect.right
            const scrollerRect = this.scroller.getBoundingClientRect() // 滚动区的坐标信息
            /** toolbar */
            let toolbarTop = rect.top - this.toolbarHeight
            // 如果工具条溢出滚动区上边界，则改为在元素下方显示
            if(toolbarTop - scrollerRect.top < 0) toolbarTop = rect.top + rect.height
            let toolbarLeft = rect.left // 工具条左侧坐标
            // const toolbarWidth = 520    // 工具条宽度
            const toolbarRight = toolbarLeft + this.toolbarWidth   // 工具条右侧坐标
            // this.toolbarRef.style.width = `${toolbarWidth}px` // 设置工具条宽度
            const coe = 23 // 工具条X轴位置修正系数
            // 当工具条右侧坐标 > 编辑区右侧坐标
            // console.log([toolbarRight, containerRight])
            if (toolbarRight > containerRight) {
              // 计算工具条溢出多少
              const offsetValue = toolbarRight  - containerRight
              // 修正工具栏左侧坐标
              toolbarLeft = toolbarLeft - offsetValue + coe
            }
            // rect 的坐标是相对于 body，而 toolbarRef 的坐标是相对于 container，所以实际设置坐标时应减去 container 的偏移 
            Object.assign(this.toolbarRef.style, {
              left: toolbarLeft - containerLeft  - coe + 'px',
              top: toolbarTop - containerTop + 'px',
            })
            if (!this.toolbarRef.parentNode) {
              container.appendChild(this.toolbarRef)
              // 记录工具条的实际长度
              this.toolbarWidth = this.toolWrapper.offsetWidth
            }
            return
          }
        }
      }
    } else {
      this.toolbarRef.parentNode?.removeChild(this.toolbarRef)
    }
  }
}