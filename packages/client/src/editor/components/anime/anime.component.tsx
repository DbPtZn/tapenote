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
  Injector,
  Selection,
  History
} from '@textbus/core'
import { ComponentLoader, SlotParser } from '@textbus/platform-browser'

export const animeComponent = defineComponent({
  type: ContentType.BlockComponent,
  name: 'AnimeComponent',
  setup(initData?: ComponentInitData<any, any>) {
    const injector = useContext()
    const commander = injector.get(Commander)
    const componentInstance = useSelf()
    /** 插槽 */
    const slots = useSlots(initData!.slots!)
    const slot = slots.get(0)!

    onContentDeleted((ev) => {
      // console.log(ev)
      /** 插槽中的组件删除后如果插槽为空，则移除动画组件 */
      if (slot?.sliceContent()[0] === '\n') {
        // console.log('slot is empty, delete anime component')
        commander.removeComponent(componentInstance)
      }
    })

    /** 数据 */
    let state = initData?.state || {
      dataId: '',
      dataEffect: '',
      dataSerial: '',
      dataTitle: '',
      dataActive: false,
      dataRange: false
    }
    const animeController = useState(state)
    animeController.onChange.subscribe((newData) => {
      state = newData
    })

    return {
      render(slotRender: SlotRender): VElement {
        return (
          <anime-component
            data-id={state.dataId || ''}
            data-effect={state.dataEffect || ''}
            data-serial={state.dataSerial || ''}
            data-title={state.dataTitle || ''}
            data-active={`${state.dataActive}` || ''}
            data-range={`${state.dataRange}` || ''}
          >
            {slotRender(slot!, (children) => {
              return <div class={'anime-component-content'}>{children}</div>
            })}
          </anime-component>
        )
      }
    }
  }
})

export const animeComponentLoader: ComponentLoader = {
  match(element: HTMLElement): boolean {
    return element.tagName.toLowerCase() === 'anime-component'
  },
  read(element: HTMLElement, injector: Injector, slotParser: SlotParser): ComponentInstance {
    const slot = slotParser(new Slot([ContentType.BlockComponent]), element)
    return animeComponent.createInstance(injector, {
      slots: [slot],
      state: {
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

// slot.onContentChange.subscribe(action => {
//   console.log('onContentChange', action)
//   if(action[1].type === 'insert') {
//     if(typeof action[1].content !== 'string' && action[1].content.name === 'ParagraphComponent') {
//       const slotIndex = componentInstance.parent?.indexOf(componentInstance)!
//       componentInstance.parent?.retain(slotIndex + 1)
//       componentInstance.parent?.insert(action[1].ref)
//     }
//   }
//   if(action[1].type === 'delete') {
    
//   }
// })

// onCompositionUpdate(() => {
//   console.log('onCompositionUpdate')
// })

// onContentInserted(() => {
//   console.log('onContentInsert')
// })

// onSlotRemoved(() => {
//   console.log('onSlotRemove')
// })

// let currentContent = slot.sliceContent()[0]
// // 历史回退后 currentContent 可能是 null，所以需要更新赋值
// history.onBack.subscribe(() => {
//   currentContent = slot.sliceContent()[0]
// })
// // ps：使用该方式实现动画组件插槽内有且只有一个组件，会导致 撤回操作 阻塞，因为每次撤回时插槽内出现两个组件会立即触发
// onViewChecked(() => {
  // if (slot.sliceContent().length > 1) {
  //   if(currentContent && typeof currentContent !== 'string') {
  //     const index = slot.indexOf(currentContent)
  //     const content = slot.getContentAtIndex(index === 0 ? 1 : 0)
  //     if(componentInstance.parent) {
  //       const slotIndex = componentInstance.parent.indexOf(componentInstance)
  //       componentInstance.parent.retain(slotIndex + (index === 0 ? 1 : 0))
  //       componentInstance.parent.insert(content)
  //       typeof content !== 'string'
  //       ? selection.setPosition(content.slots.get(0)!, 0)
  //       : selection.setPosition(componentInstance.parent, slotIndex)
  //     }
  //   } else {
  //     // 新添加的组件 currentContent === '/n'
  //     const first = slot.getContentAtIndex(0)
  //     if(typeof first !== 'string' && first.name === 'ParagraphComponent') {
  //       if(first.slots.get(0)?.sliceContent()[0] === '\n') {
  //         if(componentInstance.parent) {
  //           const slotIndex = componentInstance.parent.indexOf(componentInstance)
  //           componentInstance.parent.retain(slotIndex)
  //           componentInstance.parent.insert(first)
  //         }
  //       }
  //     } else {
  //       const content = slot.getContentAtIndex(1)
  //       if(componentInstance.parent && typeof content !== 'string') {
  //         const slotIndex = componentInstance.parent.indexOf(componentInstance)
  //         componentInstance.parent.retain(slotIndex + 1)
  //         componentInstance.parent.insert(content)
  //       }
  //     }
  //   }
  // }
// })