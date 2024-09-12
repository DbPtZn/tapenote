import { fromEvent, Subscription } from '@tanbo/stream'
import {
  ContentType,
  defineComponent,
  onContentInsert,
  onSlotRemove,
  Slot,
  SlotRender,
  Selection,
  useContext,
  useSlots,
  VElement,
  onDestroy,
  useRef,
  onBreak,
  ComponentInstance,
  ComponentInitData,
  useSelf,
  onViewInit,
  onCompositionStart,
  Injector,
  Renderer,
  Commander
} from '@textbus/core'
import { ComponentLoader, VIEW_DOCUMENT, EDITOR_OPTIONS, SlotParser } from '@textbus/platform-browser'
import { EditorOptions, paragraphComponent } from '@textbus/editor'
import { imageB2UComponent } from '.'

// import { paragraphComponent } from './components/paragraph.component'
// import { EditorOptions } from './types'

export const rootComponent = defineComponent({
  type: ContentType.BlockComponent,
  name: 'RootComponent',
  setup(data?: ComponentInitData<any>) {
    const injector = useContext()
    const selection = injector.get(Selection)
    const commander = injector.get(Commander)
    const renderer = injector.get(Renderer)
    const options = injector.get(EDITOR_OPTIONS) as EditorOptions
    const docContainer = injector.get(VIEW_DOCUMENT)

    const self = useSelf()

    const slots = useSlots(data?.slots || [new Slot([ContentType.Text, ContentType.BlockComponent, ContentType.InlineComponent])])

    onContentInsert(ev => {
      if (typeof ev.data.content === 'string' || ev.data.content.type !== ContentType.BlockComponent) {
        const p = paragraphComponent.createInstance(injector)
        const slot = p.slots.get(0)!
        slot.insert(ev.data.content)
        ev.target.insert(p)
        selection.setPosition(slot, slot.index)
        ev.preventDefault()
      }
    })

    // 一般换行不在根组件触发
    onBreak(ev => {
      const p = paragraphComponent.createInstance(injector)
      const slot = slots.get(0)!
      slot.insert(p)
      selection.setPosition(p.slots.get(0)!, 0)
      ev.preventDefault()
    })

    onSlotRemove(ev => {
      ev.preventDefault()
    })

    const rootNode = useRef<HTMLElement>()
    const subscription = new Subscription()
    onViewInit(() => {
      subscription.add(
        fromEvent<MouseEvent>(docContainer, 'click').subscribe(ev => {
          const rect = rootNode.current!.getBoundingClientRect()
          const firstSlot = slots.first!
          if (ev.clientY > rect.top + rect.height - 30) {
            const lastContent = firstSlot.getContentAtIndex(firstSlot.length - 1)
            if (!firstSlot.isEmpty && typeof lastContent !== 'string' && lastContent.name !== paragraphComponent.name) {
              const index = firstSlot.index
              firstSlot.retain(firstSlot.length)
              const p = paragraphComponent.createInstance(injector)
              firstSlot.insert(p)
              firstSlot.retain(index)
              selection.setPosition(p.slots.get(0)!, 0)
            }
          } else if (ev.target === rootNode.current) {
            let parentComponent = selection.focusSlot?.parent
            while (parentComponent && parentComponent.parentComponent !== self) {
              parentComponent = parentComponent.parentComponent
            }
            if (!parentComponent) {
              return
            }
            const index = firstSlot.indexOf(parentComponent)
            if (index > -1) {
              if (ev.clientX - rect.left < 4) {
                selection.setPosition(firstSlot, index)
                selection.restore()
              } else if (rect.left + rect.width - ev.clientX < 4) {
                selection.setPosition(firstSlot, index + 1)
                selection.restore()
              }
            }
          }
        }),
        fromEvent(rootNode.current!, 'dragenter').subscribe(ev => {
          ev.preventDefault()
          ev.stopPropagation()
        }),
        fromEvent(rootNode.current!, 'dragover').subscribe(ev => {
          ev.preventDefault()
          ev.stopPropagation()

          const target = ev.target as HTMLElement
          const self = renderer.getComponentByNativeNode(target)
          // 当拖拽移动的时候，根据经过的元素找到组件，然后将光标设置到对应组件尾部
          if (self && self.name !== 'RootComponent') {
            selection.selectLastPosition(self)
          }
        }),
        fromEvent(rootNode.current!, 'dragleave').subscribe(ev => {
          ev.preventDefault()
          ev.stopPropagation()
        }),
        fromEvent<DragEvent>(rootNode.current!, 'drop').subscribe(ev => {
          ev.preventDefault()
          ev.stopPropagation()
          // console.log(ev)
          const files = ev.dataTransfer?.files
          // console.log(files)
          if (!files || !files.length) {
            return
          }
          for (const file of files) {
            if (file.type.indexOf('image') === -1) {
              continue
            }
            const reader = new FileReader()
            reader.onload = e => {
              // console.log(e.target?.result as string)
              // 获取 base64 数据
              const base64 = e.target?.result as string
              try {
                const target = ev.target as HTMLElement

                // 构建图片组件（组件内实现会自动将 base64 上传到服务器转 url）
                const imgComponent = imageB2UComponent.createInstance(injector, {
                  state: {
                    src: base64
                  }
                })
                // console.log(imgComponent)
                const p = paragraphComponent.createInstance(injector)
                p.slots.get(0)!.insert(imgComponent)

                const self = renderer.getComponentByNativeNode(target)
                // console.log(self)
                // 如果根据元素找不到组件，则根据当前光标位置插入（也可以递归向上找组件，但似乎必要性不大）
                if (!self) {
                  commander.insert(p)
                  return
                }
                // 如果是根组件，则根据当前光标位置插入
                if (self.name === 'RootComponent') {
                  commander.insert(p)
                  return
                }

                // 找到父组件插槽
                const parentSlot = self.parent
                if (!parentSlot) return
                // 找到自己在父组件插槽中的位置
                const index = parentSlot.indexOf(self)
                // 前进一格
                parentSlot.retain(index + 1)
                // 获取当前插槽
                const currentSlot = slots.get(0)!
                currentSlot.insert(p)
                selection.selectLastPosition(p) // 将光标设置到尾部
              } catch (error) {
                console.log(error)
              }
            }
            reader.readAsDataURL(file)
          }
        })
      )
    })

    onDestroy(() => {
      subscription.unsubscribe()
    })

    onCompositionStart(() => {
      rootNode.current?.setAttribute('data-placeholder', '')
    })

    return {
      render(slotRender: SlotRender): VElement {
        return slotRender(slots.get(0)!, children => {
          return new VElement(
            'div',
            {
              style: 'min-height: 100vh;',
              'textbus-document': 'true',
              ref: rootNode,
              'data-placeholder': slots.get(0)?.isEmpty ? options.placeholder || '' : ''
            },
            children
          )
        })
      }
    }
  }
})

export const rootComponentLoader: ComponentLoader = {
  match(): boolean {
    return true
  },
  read(element: HTMLElement, context: Injector, slotParser: SlotParser): ComponentInstance {
    const slot = new Slot([ContentType.Text, ContentType.BlockComponent, ContentType.InlineComponent])
    slotParser(slot, element)
    return rootComponent.createInstance(context, {
      state: null,
      slots: [slot]
    })
  }
}
