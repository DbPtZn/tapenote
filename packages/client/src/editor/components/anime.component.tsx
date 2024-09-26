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
  Selection
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
    
    // onCompositionStart((ev) => {
    //   console.log('onCompositionStart', ev.target)
    // })
    
    // onContentInsert(ev => {
    //   console.log('anime component Insert', ev.target)
    // })

    // onBreak(ev => {
    //   console.log('onBreak', ev.target)
    // })

    onViewChecked(() => {
      if (slot.sliceContent().length > 1) {
        console.log('anime component slot has more than one content, delete the last one')
        slot.retain(1)
        slot.delete(1)
        // TODO 向上方插入段落会导致该组件中内容消失且无法撤回（每次撤回都会触发这个勾子把 slot 第二条内容删除）
        if(componentInstance.parent) {
          const index = componentInstance.parent.indexOf(componentInstance)
          const nextComponent = componentInstance.parent.getContentAtIndex(index + 1)
          if(typeof nextComponent !== 'string') {
            selection.setPosition(nextComponent.slots.get(0)!, 0)
            return
          }
          selection.setPosition(componentInstance.parent, index + 1)
        }
      }
    })
    
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
