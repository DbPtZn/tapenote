import {
  Commander,
  ComponentInitData,
  ComponentInstance,
  ContentType,
  defineComponent,
  Injector,
  onContentInsert,
  onPaste,
  Slot,
  SlotRender,
  useContext,
  useSlots,
  VElement,
  VTextNode
} from '@textbus/core'
import { ComponentLoader, SlotParser } from '@textbus/platform-browser'
import { useEnterBreaking } from './anime/_hooks/single-block-enter'

export interface DividerComponentState {
  placement: 'left' | 'right' | 'center'
}

export const dividerComponent = defineComponent({
  type: ContentType.BlockComponent,
  name: 'DividerComponent',
  setup(data?: ComponentInitData<DividerComponentState>) {
    const injector = useContext()
    const state = data?.state || {
      placement: 'center'
    }
    const slots = useSlots(data?.slots || [new Slot([ContentType.Text, ContentType.InlineComponent])])
    useEnterBreaking(injector, slots)
    return {
      render(slotRender: SlotRender): VElement {
          return (
            <div class={['separator', `separator-${state.placement}`].join(' ')}>
              <div class="tb-divider tb-divider-left" />
                {
                  slotRender(slots.get(0)!, children => {
                    const isFill = children[0] instanceof VTextNode || children[0].tagName !== 'br'
                    return <span class={['tb-divider-title', isFill ? 'tb-divider-title-fill' : ''].join(' ')}>{children}</span>
                  })
                }
              <div class="tb-divider tb-divider-right" />
            </div>
          )
      }
    }
  }
})

export const dividerComponentLoader: ComponentLoader = {
  match(element: HTMLElement): boolean {
    return element.classList.contains('separator')
  },
  read(element: HTMLElement, injector: Injector, slotParser: SlotParser): ComponentInstance {
    // console.log(element)
    const slot = slotParser(new Slot([ContentType.Text]), element.children[1] as HTMLElement || document.createElement('span'))
    const state = {
      placement: element.classList.contains('separator-left') ? 'left' : element.classList.contains('separator-right') ? 'right' : 'center' as 'left' | 'right' | 'center'
    }
    return dividerComponent.createInstance(injector, {
      slots: [slot],
      state: state 
    })
  }
}
