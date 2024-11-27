import {
  ComponentInitData,
  ComponentInstance,
  ContentType,
  defineComponent,
  Injector,
  onSlotRemove,
  Slot,
  SlotRender,
  useSlots,
  VElement,
  onContentDelete,
  onSelectionFromEnd
} from '@textbus/core'
import { ComponentLoader, SlotParser } from '@textbus/platform-browser'

export const codeComponent = defineComponent({
  type: ContentType.InlineComponent,
  name: 'CodeComponent',
  setup(data?: ComponentInitData<any>) {
    const slots = useSlots(data?.slots || [new Slot([ContentType.Text])])
    
    // onSlotRemove(() => {
    //   console.log('remove')
    // })

    // onContentDelete(() => {
    //   console.log('delete')
    // })

    // onSelectionFromEnd(ev => {
    //   console.log('SelectionFromEnd')
    // })

    return {
      render(slotRender: SlotRender): VElement {
        return slotRender(slots.get(0)!, children => {
          return <code>{children}</code>
        })
      }
    }
  }
})

export const codeComponentLoader: ComponentLoader = {
  match(element: HTMLElement): boolean {
    return element.tagName === 'CODE'
  },
  read(element: HTMLElement, injector: Injector, slotParser: SlotParser): ComponentInstance {
    const slot = slotParser(new Slot([ContentType.Text]), element)
    return codeComponent.createInstance(injector, {
      slots: [slot]
    })
  }
}
