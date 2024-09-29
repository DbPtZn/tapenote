import { Injectable, Injector, Keyboard, Selection } from "@textbus/core"

@Injectable()
export class KeyboardManager {
  constructor() {
  }

  setup(injector: Injector) {
    const keyboard = injector.get(Keyboard)
    const selection = injector.get(Selection)
    // shift + tab
    // keyboard.addShortcut({
    //   keymap: {
    //     shiftKey: true,
    //     key: 'tab'
    //   },
    //   action(e) {
    //     // console.log('shift + tab', e)
    //     // ListComponent
    //     // console.log(selection.commonAncestorComponent)
    //     // console.log('selection.anchorSlot', selection.anchorSlot)
    //     const commonAncestorComponent = selection.commonAncestorComponent
    //     // const slot = selection.focusSlot
    //     if (commonAncestorComponent?.name === 'ListComponent') {
    //       // console.log(commonAncestorComponent.slots.indexOf(slot!))
    //       if(selection.isCollapsed) { // 选取闭合
    //         if(selection.startOffset === 0) { // 在插槽的最前面
    //           const OLTypeList = ['decimal', 'lower-alpha', 'upper-alpha', 'lower-roman', 'upper-roman']
    //           commonAncestorComponent.updateState(v => {
    //             const { type, ...data } = v
    //             const index = OLTypeList.indexOf(type)
    //             if(index === -1) return
    //             const newType = OLTypeList[index - 1]
    //             if(!newType) return
    //             return {
    //               type: newType,
    //               ...data
    //             }
    //           })
    //         }
    //       }
          
    //     }
    //   }
    // })
  }
}