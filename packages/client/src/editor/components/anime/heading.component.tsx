import {
  ComponentInitData,
  ComponentInstance,
  ContentType,
  defineComponent,
  Injector,
  onDestroy,
  Slot,
  SlotRender,
  useContext,
  useSlots,
  useState,
  VElement
} from '@textbus/core'
import { ComponentLoader, SlotParser } from '@textbus/platform-browser'
import { useEnterBreaking } from './_hooks/single-block-enter'

interface HeadingComponentState {
  tag: string

  dataAnime: boolean
  dataId: string
  dataEffect: string
  dataSerial: string
  dataActive: boolean
  dataTitle: string
  dataRange: boolean
}

export const headingComponent = defineComponent({
  type: ContentType.BlockComponent,
  name: 'HeadingComponent',
  zenCoding: {
    key: ' ',
    match(content: string) {
      return /^#{1,6}$/.test(content)
    },
    generateInitData(content) {
      return {
        state: {
          tag: 'h' + content.length,
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
  setup(data?: ComponentInitData<HeadingComponentState>) {
    const injector = useContext()
    let state = data?.state || {
      tag: 'h1',
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
      console.log(v)
      state = v
    })
    const slots = useSlots(data?.slots || [new Slot([
      ContentType.Text,
      ContentType.InlineComponent
    ])])
    onDestroy(() => {
      sub.unsubscribe()
    })

    if (!slots.length) {
      slots.push(new Slot([
        ContentType.Text,
        ContentType.InlineComponent
      ]))
    }
    useEnterBreaking(injector, slots)

    return {
      type: state.tag || 'h1',
      render(slotRender: SlotRender): VElement {
        const Tag = state.tag || 'h1'
         const { dataAnime, dataId, dataEffect, dataSerial, dataActive, dataTitle, dataRange } = state
        return (
          <Tag
            data-anime={`${dataAnime}` || 'false'}
            data-id={dataId || ''}
            data-effect={dataEffect || ''}
            data-serial={dataSerial || ''}
            data-active={`${dataActive}` || 'false'}
            data-title={dataTitle || ''}
            data-range={`${dataRange}` || 'false'}
          >
            <span class='anime-component-tab' data-serial={state.dataSerial} title={state.dataTitle} />
            {
              slotRender(slots.get(0)!, children => {
                return <span>{children}</span>
              })
            }
          </Tag>
        )
        
      }
    }
  }
})

export const headingComponentLoader: ComponentLoader = {
  match(element: HTMLElement): boolean {
    return /^h[1-6]$/i.test(element.tagName)
  },
  read(element: HTMLElement, injector: Injector, slotParser: SlotParser): ComponentInstance {
    const slot = slotParser(new Slot([
      ContentType.Text,
      ContentType.InlineComponent,
    ]), element)
    return headingComponent.createInstance(injector, {
      slots: [slot],
      state: { 
        tag: element.tagName.toLowerCase(),
        dataAnime: element.dataset.anime === 'true',
        dataId: element.dataset.id || '',
        dataEffect: element.dataset.effect || '',
        dataSerial: element.dataset.serial || '',
        dataActive: element.dataset.active === 'true',
        dataTitle: element.dataset.title || '',
        dataRange: element.dataset.range === 'true'
      }
    })
  },
}
