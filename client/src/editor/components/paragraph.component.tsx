import {
  Commander,
  ComponentInitData,
  ComponentInstance,
  ContentType,
  defineComponent,
  Injector,
  onPaste,
  Slot,
  SlotRender,
  useContext,
  useSlots,
  VElement
} from '@textbus/core'
import { ComponentLoader, SlotParser } from '@textbus/platform-browser'
import { useEnterBreaking } from './hooks/single-block-enter'
// import { useEnterBreaking } from './hooks/single-block-enter'

export const paragraphComponent = defineComponent({
  type: ContentType.BlockComponent,
  name: 'ParagraphComponent',
  setup(data?: ComponentInitData) {
    const injector = useContext()
    const slots = useSlots(data?.slots || [new Slot([
      ContentType.Text,
      ContentType.InlineComponent
    ])])

    // if (slots.length === 0) {
    //   slots.push(new Slot([
    //     ContentType.Text,
    //     ContentType.InlineComponent
    //   ]))
    // }

    useEnterBreaking(injector, slots)
    return {
      render(slotRender: SlotRender): VElement {
        return slotRender(slots.get(0)!, (children) => {
          return (<p>{children}</p>)
        })
      }
    }
  }
})

export const paragraphComponentLoader: ComponentLoader = {
  match(element: HTMLElement): boolean {
    return element.tagName === 'P'
  },
  read(element: HTMLElement, injector: Injector, slotParser: SlotParser): ComponentInstance {
    // console.log(element)
    const slot = slotParser(new Slot([
      ContentType.Text,
      ContentType.InlineComponent
    ]), element)
    return paragraphComponent.createInstance(injector, {
      slots: [slot]
    })
  }
}
