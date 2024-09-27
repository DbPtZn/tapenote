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
  onBreak,
  onCompositionStart,
  onContentInsert,
  onViewChecked,
  Selection,
  History,
  onCompositionUpdate,
  onContentInserted,
  onSlotRemove,
  onSlotRemoved
} from '@textbus/core'
import { ComponentLoader, SlotParser } from '@textbus/platform-browser'
import {
  ANIME_COMPONENT,
  ANIME_COMPONENT_NAME,
} from '..'

export const animeComponent = defineComponent({
  type: ContentType.BlockComponent,
  name: ANIME_COMPONENT_NAME,
  setup(initData?: ComponentInitData<any, any>) {
    const injector = useContext()
    const commander = injector.get(Commander)
    const selection = injector.get(Selection)
    const history = injector.get(History)
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
    
    
    /** 数据 */
    let state = initData?.state || {
      dataId: '',
      dataEffect: '',
      dataSerial: '',
      dataTitle: '',
      dataState: 'inactive'
    }
    const animeController = useState(state)
    animeController.onChange.subscribe((newData) => {
      state = newData
    })

    // 组件可能需要点击事件
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
  resources: {
    styles: [``],
    editModeStyles: [
      `
    anime-component {
      position: relative;
      display: block;
      // pointer-events: none;
    }
    .anime-component-content {
      // pointer-events: auto;
    }
    .anime-component-evoke {
      display: block;
      outline: 1px dashed #aaaaaa30;
    }
    anime-component:after {
      position: absolute;
      right: -12px;
      top: -12px;
      // margin-left: -12px;
      // margin-top: -12px;
      content: attr(data-serial);
      vertical-align: super;
      color: white;
      background-color: #c8c9cc;
      border-radius: 24px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 23px;
      height: 23px;
      font-size: 15px;
      line-height: 0px;
      -webkit-border-radius: 24px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      // pointer-events: auto;
    }
    anime-component:hover:after {
      cursor: pointer;
      animation: .8s .5s tada infinite;
    }
    anime-component:hover {
      outline: 1px dashed #aaaaaa30;
      border-radius: 3px;
    }
    .anime-component-tab:after {
      z-index: 1;
      content: attr(data-serial);
      vertical-align: super;
      position: absolute;
      top: -10px;
      right: -11px;
      display:inline-block;
      width:23px;
      height:23px;
      font-size:15px;
      color:white;
      text-align:center;
      line-height:23px;
      border-radius:24px;
      background-color:#c8c9cc;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      pointer-events: auto;
    }
    .anime-component-tab:hover:after {
      cursor: pointer;
      animation: .8s .5s tada infinite;
    }
    .anime-component-tab:hover {
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      border-radius: 3px;
    }
    .anime-component-tab {
      position: relative;
      display: block;
    }
    [data-state="active"]:after { 
      background-color:pink 
    }
    `
    ]
    // 不能采用该方式，因为是查询的是所有后代元素,所以如果动画组件存在嵌套会产生冲突
    // [data-state="active"] .anime-component-tab:after { 
    //   background-color:pink 
    // }
    // [data-state="inactive"] .anime-component-tab:after { 
    //   background-color:#c8c9cc
    // }
    // .anime-component-content > p:empty::before {
    //   content: "在此输入内容";
    //   color: rgba(143, 143, 143, 0.64);
    // }
  },
  match(element: HTMLElement): boolean {
    return element.tagName.toLowerCase() === ANIME_COMPONENT
  },
  read(element: HTMLElement, injector: Injector, slotParser: SlotParser): ComponentInstance {
    const slot = slotParser(new Slot([ContentType.BlockComponent]), element)
    return animeComponent.createInstance(injector, {
      slots: [slot],
      state: {
        dataId: element.dataset.id || '',
        dataEffect: element.dataset.effect || '',
        dataSerial: element.dataset.serial || '',
        dataState: element.dataset.state || 'inactive',
        dataTitle: element.dataset.title || ''
      }
    })
  }
}
