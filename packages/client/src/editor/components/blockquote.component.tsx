import {
  ComponentInitData,
  ComponentInstance,
  ContentType,
  defineComponent,
  Injector,
  onDestroy,
  Slot,
  SlotRender,
  useSlots,
  useState,
  VElement
} from '@textbus/core'
import { ComponentLoader, SlotParser } from '@textbus/platform-browser'
interface State {
  dataAnime: boolean
  dataId: string
  dataEffect: string
  dataSerial: string
  dataActive: boolean
  dataTitle: string
  dataRange: boolean
}

export const blockquoteComponent = defineComponent({
  type: ContentType.BlockComponent,
  name: 'BlockquoteComponent',
  zenCoding: {
    key: ' ',
    match: /^>$/,
    generateInitData() {
      return {
        slots: [new Slot([ContentType.Text, ContentType.InlineComponent, ContentType.BlockComponent])],
        state: {
          dataAnime: false,
          dataId: '',
          dataEffect: '',
          dataSerial: '',
          dataActive: false,
          dataTitle: '',
          dataRange: false
        }
      }
    }
  },
  setup(data?: ComponentInitData<State>) {
    let state = data?.state || {
      dataAnime: false,
      dataId: '',
      dataEffect: '',
      dataSerial: '',
      dataActive: false,
      dataTitle: '',
      dataRange: false
    }
    const stateController = useState(state)
    const sub = stateController.onChange.subscribe(v => {
      state = v
    })
    onDestroy(() => {
      sub.unsubscribe()
    })

    const slots = useSlots(data?.slots || [new Slot([ContentType.Text, ContentType.InlineComponent, ContentType.BlockComponent])])
    if (!slots.length) {
      slots.push(new Slot([ContentType.Text, ContentType.InlineComponent, ContentType.BlockComponent]))
    }
    return {
      render(slotRender: SlotRender): VElement {
        const { dataAnime, dataId, dataEffect, dataSerial, dataActive, dataTitle, dataRange } = state

        return (
          <blockquote
            class="tb-blockquote"
            data-anime={`${dataAnime}` || 'false'}
            data-id={dataId || ''}
            data-effect={dataEffect || ''}
            data-serial={dataSerial || ''}
            data-active={`${dataActive}` || 'false'}
            data-title={dataTitle || ''}
            data-range={`${dataRange}` || 'false'}
          >
            {slotRender(slots.get(0)!, children => {
              return <div class="tb-blockquote-content">{children}</div>
            })}
            <span class="anime-component-tab" data-serial={dataSerial} title={dataTitle} />
          </blockquote>
        )
      }
    }
  }
})

export const blockquoteComponentLoader: ComponentLoader = {
  match(element: HTMLElement): boolean {
    return element.tagName === 'BLOCKQUOTE' || (element.tagName === 'DIV' && element.className === 'tb-blockquote')
  },
  read(element: HTMLElement, injector: Injector, slotParser: SlotParser): ComponentInstance {
    const slot = slotParser(new Slot([ContentType.Text, ContentType.BlockComponent, ContentType.InlineComponent]), element)
    return blockquoteComponent.createInstance(injector, {
      slots: [slot],
      state: {
        dataAnime: element.dataset.anime === 'true',
        dataId: element.dataset.id || '',
        dataEffect: element.dataset.effect || '',
        dataSerial: element.dataset.serial || '',
        dataActive: element.dataset.active === 'true',
        dataTitle: element.dataset.title || '',
        dataRange: element.dataset.range === 'true'
      }
    })
  }
}
