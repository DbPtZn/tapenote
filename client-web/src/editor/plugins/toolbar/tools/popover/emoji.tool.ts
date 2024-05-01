// import { boldFormatter, colorFormatter } from '../../../../formatters/_api'
import { Commander, QueryState, FormatValue, Query, QueryStateType, Injector, Observable, Subject } from '@textbus/core'
import { ButtonTool, ButtonToolConfig, PopoverTool, PopoverToolConfig } from '../../toolkit'
// import { MaterialTypeEnum } from '../../../../enum'
// import { zh_CN } from '../../../../i18n/_api'
// import { I18n, imageComponent } from '@/editor'
import { h } from 'vue'
import EmojiForm from './_utils/EmojiForm.vue'
import { I18n } from '@textbus/editor'


// class Emoji {
//   elementRef = document.createElement('div')
//   onComplete: Observable<string> 
//   onCancel = new Observable<void>()

//   private checkEvent = new Subject<string>()

//   constructor() {
//     this.onComplete = this.checkEvent.asObservable()
//     this.elementRef.classList.add('textbus-toolbar-emoji-menu')
//     const emoji: string[] = []
//     for (let i = 0x1F600; i <= 0x1F64F; i++) {
//       emoji.push(i.toString(16).toUpperCase())
//     }
//     const fragment = document.createDocumentFragment()
//     const buttons = emoji.map(s => {
//       const button = document.createElement('button')
//       button.type = 'button'
//       button.classList.add('textbus-toolbar-emoji-menu-item')
//       button.innerHTML = `&#x${s};`
//       fragment.appendChild(button)
//       return button
//     })
//     this.elementRef.addEventListener('click', (ev: MouseEvent) => {
//       const target = ev.target
//       for (const btn of buttons) {
//         if (target === btn) {
//           this.checkEvent.next(btn.innerHTML)
//           break
//         }
//       }
//     })
//     this.elementRef.appendChild(fragment)
//   }

//   update(): void {
//     //
//   }

//   reset() {
//     //
//   }
// }

export function emojiToolConfigFactory(injector: Injector): PopoverToolConfig {
  const i18n = injector.get(I18n)
  const commander = injector.get(Commander)
  return {
    iconClasses: ['textbus-icon-emoji'],
    tooltip: i18n.get('plugins.toolbar.emojiTool.tooltip'),
    // viewController: new Emoji(),
    views: [
      h(EmojiForm, {
        onConfirm: (value: string) => {
          commander.insert(value)
        }
      })
    ],
    queryState(): QueryState<any> {
      return {
        state: QueryStateType.Normal,
        value: null
      }
    },
    useValue(value: string) {
      // commander.insert(value)
    }
  }
}

export function emojiTool() {
  return new PopoverTool(emojiToolConfigFactory)
}
