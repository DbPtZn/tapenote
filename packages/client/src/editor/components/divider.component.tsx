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
import { useEnterBreaking } from './_hooks/single-block-enter'

export interface DividerComponentState {
  placement: 'left' | 'right' | 'center'
  // Anime
  dataAnime?: boolean
  dataId?: string
  dataEffect?: string
  dataSerial?: string
  dataActive?: boolean
  dataTitle?: string
  dataRange?: boolean
}

export const dividerComponent = defineComponent({
  type: ContentType.BlockComponent,
  name: 'DividerComponent',
  setup(data?: ComponentInitData<DividerComponentState>) {
    const injector = useContext()
    const state = data?.state || {
      placement: 'center',
      // Anime props
      dataAnime: false,
      dataId: '',
      dataEffect: '',
      dataSerial: '',
      dataActive: false,
      dataTitle: '',
      dataRange: false
    }
    const slots = useSlots(data?.slots || [new Slot([ContentType.Text, ContentType.InlineComponent])])
    useEnterBreaking(injector, slots)
    return {
      render(slotRender: SlotRender): VElement {
        const { dataAnime, dataId, dataEffect, dataSerial, dataActive, dataTitle, dataRange } = state
          return (
            <div 
              class={['separator', `separator-${state.placement}`].join(' ')}
              data-anime={`${dataAnime}` || 'false'}
              data-id={dataId || ''}
              data-effect={dataEffect || ''}
              data-serial={dataSerial || ''}
              data-active={`${dataActive}` || 'false'}
              data-title={dataTitle || ''}
              data-range={`${dataRange}` || 'false'}
            >
              <span class='anime-component-tab' data-serial={state.dataSerial} title={state.dataTitle} />
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
      placement: element.classList.contains('separator-left') ? 'left' : element.classList.contains('separator-right') ? 'right' : 'center' as 'left' | 'right' | 'center',
      dataAnime: element.dataset.anime === 'true',
      dataId: element.dataset.id || '',
      dataEffect: element.dataset.effect || '',
      dataSerial: element.dataset.serial || '',
      dataActive: element.dataset.active === 'true',
      dataTitle: element.dataset.title || '',
      dataRange: element.dataset.range === 'true'
    }
    return dividerComponent.createInstance(injector, {
      slots: [slot],
      state: state
    })
  }
}
