import {
  Injector,
  makeError,
  NativeSelectionBridge,
  Renderer,
  Selection,
  Slot,
  Subscription,
  Plugin,
  Keyboard,
  Commander,
  Query
} from '@textbus/core'
import { Editor, Layout, codeFormatter } from '@textbus/editor'
import { auditTime, fromEvent } from '@tanbo/stream'

// 监听键盘事件，处理特殊格式的行为
export class SpecialBehaviorPlugin implements Plugin {
  
  constructor() {}
  
  setup(injector: Injector): void {
    const keyboard = injector.get(Keyboard)
    const renderer = injector.get(Renderer)
    const selection = injector.get(Selection)
    const commander = injector.get(Commander)
    const query = injector.get(Query)
    // const keyEvents = [
    //   keyboard.addShortcut({
    //     keymap: { key: 'ArrowRight' },
    //     action: function (): boolean {
    //       const result = query.queryFormat(codeFormatter)
    //       if(result.value) {
    //         if(selection.isCollapsed) {
    //           let endIndex = 0
    //           const isEnd = selection.anchorSlot?.getFormats().some(formatter => {
    //             if(formatter.formatter.name === 'code') {
    //               if(formatter.endIndex === selection.startOffset) {
    //                 endIndex = formatter.endIndex
    //                 return true
    //               }
    //             }
    //           })
    //           if(isEnd) {
    //             if (selection.anchorSlot?.length && selection.startOffset) {
    //               if(selection.anchorSlot?.length > selection.startOffset) {
    //                 return false
    //               }
    //             }
    //             commander.insert(' ')
    //             return true
    //           }
             
    //         }
    //       }
    //       return false
    //     }
    //   }),
    // ]
  }
  
  onDestroy(): void {
    
  }
}