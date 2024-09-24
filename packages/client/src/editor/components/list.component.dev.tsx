import {
  ComponentInstance,
  ComponentExtends,
  ContentType,
  defineComponent,
  onBreak,
  onContentInsert,
  onContentInserted,
  onCompositionStart,
  onCompositionEnd,
  Slot,
  SlotRender,
  Selection,
  useContext,
  useSlots,
  VElement,
  ComponentInitData, useState, onDestroy, Injector, Keyboard, useSelf, Renderer,
} from '@textbus/core'
import { ComponentLoader, SlotParser } from '@textbus/platform-browser'

import { paragraphComponent } from './paragraph.component'

export interface SegmentedSlots<T extends Slot = Slot> {
  before: T[]
  middle: T[]
  after: T[]
}

export interface ListDevComponentExtends extends ComponentExtends {
  tag: 'ul' | 'ol',

  split?(startIndex: number, endIndex: number): SegmentedSlots
}

interface ListState {
  tag: 'ul' | 'ol',
  type: ULType | OLType 
  start: number
}
// type ListState<T = 'ul' | 'ol'> = {
//   mode: T
//   type: T extends 'ul' ? ULType : OLType
//   start: number
// }

// type OLType = '1' | 'a' | 'A' | 'i' | 'I'
type OLType = 'decimal' | 'lower-alpha' | 'upper-alpha' | 'lower-roman' | 'upper-roman'
type ULType = 'disc' | 'circle' | 'square'
// const OLTypeList = ['1', 'a', 'A', 'i', 'I']
const OLTypeList = ['decimal', 'lower-alpha', 'upper-alpha', 'lower-roman', 'upper-roman']
const ULTypeList = ['disc', 'circle', 'square']

export const listDevComponent = defineComponent({
  type: ContentType.BlockComponent,
  name: 'ListDevComponent',
  // separable: true,
  // zenCoding: {
  //   key: ' ',
  //   match: /^([1-9]\d*\.|[+*])$/,
  //   generateInitData(content: string) {
  //     // console.log('generateInitData', content)
  //     return {
  //       state: {
  //         tag: /[-+*]/.test(content) ? 'ul' : 'ol',
  //         type: 'decimal',
  //         start: Number(content)
  //       }
  //     }
  //   }
  // },
  setup(data?: ComponentInitData<ListState>): ListDevComponentExtends {
    // console.log('setup', data)
    const injector = useContext()
    const self = useSelf()
    const renderer = injector.get(Renderer)
    const selection = injector.get(Selection)
    let state = data?.state || { tag: 'ul', type: 'disc', start: 1 }
    // console.log('state', state)
    const stateController = useState(state)
    const sub = stateController.onChange.subscribe(v => {
      console.log('stateController.onChange', v)
      state = v
    })

    

    onDestroy(() => {
      sub.unsubscribe()
    })

    const slots = useSlots(data?.slots || [new Slot([
      ContentType.Text,
      ContentType.InlineComponent,
      ContentType.BlockComponent
    ])])

    // onCompositionStart(() => {
    //   console.log('onCompositionStart')
    // })

    // onCompositionEnd(() => {
    //   console.log('onCompositionEnd')
    // })
    onContentInsert(ev => {
      // console.log('onContentInsert', ev)
      // console.log(renderer.getVNodeBySlot(ev.target))
      // console.log(renderer.getNativeNodeByVNode(renderer.getVNodeByComponent(ev.target.parent!)))
      // console.log(ev.data.content)
      // console.log(ev.data.content.length)
      // console.log(ev.data.content === '    ')
      // console.log(ev.target.isEmpty)
      // console.log(ev.target === slots.last)
      // && ev.target === slots.last && ev.target.isEmpty
      if(ev.data.content === '    ' && selection.isCollapsed && selection.startOffset === 0) {
        // console.log('onContentInsert2')
        ev.preventDefault()
        // console.log('onContentInserted')
        const index = OLTypeList.indexOf(state.type)
        if(index === -1) return
        const nextType = OLTypeList[index + 1]
        if(!nextType) return
        const nextComponent = listDevComponent.createInstance(injector, {
          state: {
            tag: state.tag,
            type: nextType as OLType,
            start: 1
          }
        })
        const slotIndex = slots.indexOf(ev.target)
        if(slotIndex === -1) return
        const newSlot = new Slot([
          ContentType.Text,
          ContentType.InlineComponent,
          ContentType.BlockComponent
        ])
        nextComponent.slots.insert(ev.target)
        nextComponent.slots.remove(nextComponent.slots.get(0)!)
        newSlot.insert(nextComponent)
        slots.insertByIndex(newSlot, slotIndex)
      }
    })
    // onContentInserted(ev => {
    //   console.log('onContentInserted', ev)
    // })


    onBreak(ev => {
      console.log('onBreak', ev)
      if(ev.target.isEmpty) {
        if(ev.target.parent?.parentComponent?.name === 'ListDevComponent') {
          if (ev.target === slots.last) {
            console.log('onBreak2 属于列表中最后一个插槽的情况')
            const parentComponent = ev.target.parent.parentComponent // 所属组件的父组件
            const parentSlot = ev.target.parent.parent // 组件所属的插槽
            if(parentSlot && parentComponent) parentComponent.slots.insertAfter(ev.target, parentSlot)
            ev.preventDefault()
            return
          } else {
            console.log('onBreak3 属于列表中非最后一个插槽的情况')
            // const parentComponent = ev.target.parent.parentComponent
            // const parentSlot = ev.target.parent.parent
            // const currentComponent = ev.target.parent 
            // if(parentSlot && parentComponent) {
            //   const index = parentComponent?.slots.indexOf(parentSlot)
            //   const latter = currentComponent.slots.cut(index + 2, currentComponent.slots.length)
            //   // console.log('index', index)
            //   // console.log('latter', latter)
            //   const nextComponent = listDevComponent.createInstance(injector, {
            //     state: {
            //       tag: currentComponent.state.tag,
            //       type: currentComponent.state.type,
            //       start: 1
            //     }
            //   })
            //   nextComponent.slots.clean()
            //   latter.forEach(item => nextComponent.slots.push(item))
            //   const newSlot = new Slot([
            //     ContentType.Text,
            //     ContentType.InlineComponent,
            //     ContentType.BlockComponent
            //   ])
            //   newSlot.insert(nextComponent)
            //   parentComponent.slots.insertAfter(newSlot, parentSlot)
            //   parentComponent.slots.insertAfter(ev.target, parentSlot)
            //   ev.preventDefault()
            //   return
            // }
            ev.preventDefault()
            return
          }
        }

        if (ev.target === slots.last) {
          // console.log('onBreak4')
          const paragraph = paragraphComponent.createInstance(injector)
          const parentComponent = selection.commonAncestorComponent!
          const parentSlot = parentComponent.parent!
          const index = parentSlot.indexOf(parentComponent)
          parentSlot.retain(index + 1)
          if (slots.length > 1) {
            slots.remove(slots.last)
          }
          parentSlot.insert(paragraph)
          selection.setPosition(paragraph.slots.get(0)!, 0)
          ev.preventDefault()
          return
        } else {
          // console.log('onBreak5 父组件不是列表组件，属于列表中非最后一个插槽的情况')
          const parentComponent = ev.target.parent?.parentComponent
          const parentSlot = ev.target.parent?.parent
          const currentComponent = ev.target.parent
          const currentSlot = ev.target
          if(parentSlot && parentComponent && currentComponent) {
              const index = currentComponent?.slots.indexOf(currentSlot)
              const latter = currentComponent.slots.cut(index + 1, currentComponent.slots.length)
              // console.log('index', index)
              // console.log('latter', latter)
              const nextComponent = listDevComponent.createInstance(injector, {
                state: {
                  tag: currentComponent.state.tag,
                  type: currentComponent.state.type,
                  start: 1
                }
              })
              nextComponent.slots.clean()
              latter.forEach(item => nextComponent.slots.push(item))
              const paragraph = paragraphComponent.createInstance(injector)
              // console.log(parentComponent)
              // console.log(parentComponent.slots)
              const parentIndex = parentSlot.indexOf(currentComponent)
              parentSlot.retain(parentIndex + 1)
              parentSlot.insert(paragraph)
              parentSlot.insert(nextComponent)
              currentComponent.slots.remove(currentSlot)
              selection.setPosition(paragraph.slots.get(0)!, 0)
          }
          ev.preventDefault()
          return
        }
      }
      
      const nextLi = ev.target.cut(ev.data.index)
      slots.insertAfter(nextLi, ev.target)
      selection.setPosition(nextLi, 0)
      ev.preventDefault()
    })

    return {
      tag: state.tag,
      render(slotRender: SlotRender): VElement {
        if (state.tag === 'ol') {
          const type = state.type as OLType
          return (
            <ol class={type} start={state.start}>
              {
                slots.toArray().map(i => {
                  if(typeof i.sliceContent()[0] !== 'string') {
                    // console.log('i', i.sliceContent()[0])
                    return slotRender(i, children => {
                      // console.log('renderer ol', children)
                      return <div>{children}</div>
                    })
                  }
                  return slotRender(i, children => {
                    // console.log('renderer li', children)
                    return <li class="tb-list-item">{children}</li>
                  })
                })
              }
            </ol>
          )
        } else {
          const type = state.type as ULType
          return (
            <ul style={ 'list-style-type:' + type }>
              {
                slots.toArray().map(i => {
                  return slotRender(i, children => {
                    return <li class="tb-list-item">{children}</li>
                  })
                })
              }
            </ul>
          )
        }
      },
      split(startIndex: number, endIndex: number) {
        return {
          before: slots.slice(0, startIndex),
          middle: slots.slice(startIndex, endIndex),
          after: slots.slice(endIndex)
        }
      }
    }
  }
})

export const listDevComponentLoader: ComponentLoader = {
  resources: {
    editModeStyles: [
      `
      .decimal {
        list-style-type: decimal;
      }
      .lower-alpha {
        list-style-type: lower-alpha;
      }
      .upper-alpha {
        list-style-type: upper-alpha;
      }
      .lower-roman {
        list-style-type: lower-roman;
      }
      .upper-roman {
        list-style-type: upper-roman;
      }
      
      // .decimal li {}
      // .lower-alpha li {
      //   margin-left: 1em;
      // }
      // .upper-alpha li {
      //   margin-left: 2em;
      // }
      // .lower-roman li {
      //   margin-left: 3em;
      // }
      // .upper-roman li {
      //   margin-left: 4em;
      // }
      `
    ]
  },
  match(element: HTMLElement): boolean {
    return element.tagName === 'OL' || element.tagName === 'UL'
  },
  read(element: HTMLElement, injector: Injector, slotParser: SlotParser): ComponentInstance {
    // console.log('listDevcomponent loader')
    return addSlotTraverse(element, injector, slotParser)
  },
}


function addSlotTraverse(element: HTMLElement, injector: Injector, slotParser: SlotParser) {
  // console.log('addSlotTraverse', '递归')
  const slots: Slot[] = []
  const childNodes = Array.from(element.childNodes)
  while (childNodes.length) {
    const slot = new Slot([
      ContentType.Text,
      ContentType.InlineComponent,
      ContentType.BlockComponent
    ])
    let first = childNodes.shift()
    let newLi: HTMLElement | null = null
    while (first) {
      if (/^li$/i.test(first.nodeName)) {
        slots.push(slot)
        slotParser(slot, first as HTMLElement)
        break
      }
      // 可能需要递归
      console.log('first.nodeName', first.nodeName, /^div$/i.test(first.nodeName))
      if (/^div$/i.test(first.nodeName)) {
        const olSlot = new Slot([
          ContentType.Text,
          ContentType.InlineComponent,
          ContentType.BlockComponent
        ])
        const olComponent = addSlotTraverse(first.firstChild as HTMLElement, injector, slotParser)
        olSlot.insert(olComponent)
        slots.push(olSlot)
        break
      }
      if (!newLi) {
        if (first.nodeType === Node.TEXT_NODE && (/^\s+$/.test(first.textContent!) || first.textContent === '')) {
          break
        }
        newLi = document.createElement('li')
      }
      newLi.appendChild(first)
      first = childNodes.shift()
    }
    if (newLi) {
      slots.push(slot)
      slotParser(slot, newLi)
      newLi = null
    }
  }
  const tag = element.tagName.toLowerCase() as 'ol'| 'ul'
  const type = (tag === 'ol' ? element.className || 'decimal' : element.getAttribute('style')?.split(':')[1] || 'disc') as ULType | OLType
  const start = Number(element.getAttribute('start')) || 1
  return listDevComponent.createInstance(injector, {
    slots,
    state: {
      tag,
      type,
      start
    }
  })
}