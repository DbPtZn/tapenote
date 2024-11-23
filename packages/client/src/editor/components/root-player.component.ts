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
  useSelf, onViewInit, onCompositionStart, Renderer, RootComponentRef, History, Injector
} from '@textbus/core'
import { ComponentLoader, VIEW_DOCUMENT, EDITOR_OPTIONS, SlotParser } from '@textbus/platform-browser'
import { EditorOptions } from '@textbus/editor'
import { RootEventService } from '../services'
import { paragraphComponent } from './paragraph.component'

export const rootPlayerComponent = defineComponent({
  type: ContentType.BlockComponent,
  name: 'RootComponent',
  setup(data?: ComponentInitData<any>) {
    const injector = useContext()
    const selection = injector.get(Selection)
    // const renderer = injector.get(Renderer)
    // const root = injector.get(RootComponentRef)
    const options = injector.get(EDITOR_OPTIONS) as EditorOptions
    // const docContainer = injector.get(VIEW_DOCUMENT)
    // const history = injector.get(History)
    const self = useSelf()
    const subs: Subscription[] = []
    subs.push(self.onStateChange.subscribe(ev => {
      console.log(ev)
    }))

    const slots = useSlots(data?.slots || [new Slot([
      ContentType.Text,
      ContentType.BlockComponent,
      ContentType.InlineComponent
    ])])

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

    onBreak((ev) => {
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
    onViewInit(() => {
      const rootEventService = injector.get(RootEventService)
      /** 监听在组件上的右击菜单事件 */
      subs.push(
        fromEvent(rootNode.current!, 'contextmenu').subscribe(ev  => {
          rootEventService.handleContextmenu(ev as MouseEvent)
        })
      )
    })

    onDestroy(() => {
      subs.forEach(sub => sub.unsubscribe())
    })

    onCompositionStart(() => {
      rootNode.current?.setAttribute('data-placeholder', '')
    })

    return {
      render(slotRender: SlotRender): VElement {
        return slotRender(slots.get(0)!, (children) => {
          return new VElement('div', {
            'textbus-document': 'true',
            'ref': rootNode,
            'class': 'tb-root',
            'data-placeholder': slots.get(0)?.isEmpty ? options.placeholder || '' : ''
          }, children)
        })
      }
    }
  }
})

export const rootPlayerComponentLoader: ComponentLoader = {
  match(): boolean {
    return true
  },
  read(element: HTMLElement, context: Injector, slotParser: SlotParser): ComponentInstance {
    const slot = new Slot([
      ContentType.Text,
      ContentType.BlockComponent,
      ContentType.InlineComponent
    ])
    slotParser(slot, element)
    return rootPlayerComponent.createInstance(context, {
      state: null,
      slots: [slot]
    })
  }
}