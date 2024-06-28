import {
  Commander,
  ComponentInitData,
  ComponentInstance,
  ContentType,
  defineComponent,
  Slot,
  SlotRender,
  useContext,
  useSelf,
  useSlots,
  useState,
  VElement,
  onDestroy,
  onContentDeleted,
  Injector
} from '@textbus/core'
import { ComponentLoader, SlotParser } from '@textbus/platform-browser'
import {
  ANIME_COMPONENT,
  ANIME_COMPONENT_NAME,
} from '..'

export const animePlayerComponent = defineComponent({
  type: ContentType.BlockComponent,
  name: ANIME_COMPONENT_NAME,
  setup(initData?: ComponentInitData<any, any>) {
    const injector = useContext()
    const commander = injector.get(Commander)
    const componentInstance = useSelf()
    /** 插槽 */
    const slots = useSlots(initData!.slots!)
    const slot = slots.get(0)
    onContentDeleted((ev) => {
      /** 插槽中的组件删除后如果插槽为空，则移除动画组件 */
      if (slot?.sliceContent()[0] === '\n') {
        commander.removeComponent(componentInstance)
      }
    })
    /** 数据 */
    let state = initData?.state || {
      dataId: '',
      dataEffect: '',
      dataSerial: '',
      dataTitle: '',
      dataState: ''
    }
    const animeController = useState(state)
    animeController.onChange.subscribe((newData) => {
      state = newData
    })
    return {
      render(slotRender: SlotRender): VElement {
        return (
          <anime-component
            data-id={state.dataId}
            data-effect={state.dataEffect}
            data-serial={state.dataSerial}
            data-title={state.dataTitle}
            data-state={state.dataState}
          >
            <span
              class={'anime-component-tab'}
              title={state.dataTitle}
              data-serial={state.dataSerial}
            />
            {slotRender(slot!, (children) => {
              return <div class={'anime-component-content'}>{children}</div>
            })}
          </anime-component>
        )
      }
    }
  }
})

export const animePlayerComponentLoader: ComponentLoader = {
  match(element: HTMLElement): boolean {
    return element.tagName.toLowerCase() === ANIME_COMPONENT
  },
  read(element: HTMLElement, injector: Injector, slotParser: SlotParser): ComponentInstance {
    const slot = slotParser(new Slot([ContentType.BlockComponent]), element)
    return animePlayerComponent.createInstance(injector, {
      slots: [slot],
      state: {
        dataId: element.dataset.id || '',
        dataEffect: element.dataset.effect || '',
        dataSerial: element.dataset.serial || '',
        dataState: element.dataset.state || '',
        dataTitle: element.dataset.title || ''
      }
    })
  }
}
