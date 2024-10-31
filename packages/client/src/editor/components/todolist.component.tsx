import {
  Commander,
  ComponentInitData,
  ComponentInstance,
  ContentType,
  defineComponent,
  Injector,
  onBreak,
  onDestroy,
  Selection,
  Slot,
  useContext,
  useSelf,
  useSlots,
  useState,
  VElement
} from '@textbus/core'
import { ComponentLoader, SlotParser } from '@textbus/platform-browser'
import { paragraphComponent } from './paragraph.component'


export interface TodoListSlotState {
  active: boolean
  disabled: boolean
}

interface State {
  dataAnime: boolean
  dataId: string
  dataEffect: string
  dataSerial: string
  dataActive: boolean
  dataTitle: string
  dataRange: boolean
}


export const todolistComponent = defineComponent({
  type: ContentType.BlockComponent,
  name: 'TodolistComponent',
  separable: true,
  zenCoding: {
    match: /^-\s\[(x|\s)?\\]$/,
    key: ' ',
    generateInitData(content: string): ComponentInitData<State, TodoListSlotState> {
      const isChecked = content.charAt(3) === 'x'
      return {
        slots: [
          new Slot<TodoListSlotState>([
            ContentType.Text,
            ContentType.InlineComponent
          ], {
            active: isChecked,
            disabled: false
          })
        ],
        state: {
          dataAnime: false,
          dataId: '',
          dataEffect: '',
          dataSerial: '',
          dataActive: isChecked,
          dataTitle: '',
          dataRange: false
        }
      }
    }
  },
  setup(initData: ComponentInitData<State, TodoListSlotState>) {
    let state = initData?.state || {
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
      state = v
    })
    onDestroy(() => {
      sub.unsubscribe()
    })

    const { Text, InlineComponent } = ContentType
    const slots = useSlots<TodoListSlotState>(initData.slots || [
      new Slot<TodoListSlotState>([Text, InlineComponent])
    ])
    if (slots.length === 0) {
      slots.push(new Slot<TodoListSlotState>([Text, InlineComponent]))
    }
    const injector = useContext()
    const self = useSelf()
    const selection = injector.get(Selection)
    const commander = injector.get(Commander)

    onBreak(ev => {
      const slot = ev.target
      const index = ev.data.index
      ev.preventDefault()
      if (slot.isEmpty && index === 0 && slots.length > 1 && slot === slots.last) {
        const p = paragraphComponent.createInstance(injector)
        commander.insertAfter(p, self)
        slots.remove(slot)
        const firstSlot = p.slots.get(0)!
        selection.setPosition(firstSlot, 0)
      } else {
        const nextSlot = slot.cut(index)
        slots.insertAfter(nextSlot, slot)
        selection.setPosition(nextSlot, 0)
      }
    })
    const stateCollection = [{
      active: false,
      disabled: false
    }, {
      active: true,
      disabled: false
    }, {
      active: false,
      disabled: true
    }, {
      active: true,
      disabled: true
    }]

    function getStateIndex(active: boolean, disabled: boolean) {
      for (let i = 0; i < 4; i++) {
        const item = stateCollection[i]
        if (item.active === active && item.disabled === disabled) {
          return i
        }
      }
      return -1
    }

    return {
      render(slotRender): VElement {
        const { dataAnime, dataId, dataEffect, dataSerial, dataActive, dataTitle, dataRange } = state
        return (
          <tb-todolist
            data-anime={`${dataAnime}` || 'false'}
            data-id={dataId || ''}
            data-effect={dataEffect || ''}
            data-serial={dataSerial || ''}
            data-active={`${dataActive}` || 'false'}
            data-title={dataTitle || ''}
            data-range={`${dataRange}` || 'false'}
            >
            {
              slots.toArray().map(slot => {
                const state = slot.state!
                const classes = ['tb-todolist-state']

                if (state.active) {
                  classes.push('tb-todolist-state-active')
                }
                if (state.disabled) {
                  classes.push('tb-todolist-state-disabled')
                }
                return (
                  <div class="tb-todolist-item">
                    <div class="tb-todolist-btn">
                      <div class={classes.join(' ')} onClick={() => {
                        const i = (getStateIndex(state.active, state.disabled) + 1) % 4
                        const newState = stateCollection[i]
                        slot.updateState(draft => {
                          draft.active = newState.active
                          draft.disabled = newState.disabled
                        })
                      }}/>
                    </div>
                    {
                      slotRender(slot, children => {
                        return <div class="tb-todolist-content">{children}</div>
                      })
                    }
                  </div>
                )
              })
            }
            <span class="anime-component-tab" data-serial={dataSerial} title={dataTitle} />
          </tb-todolist>
        )
      }
    }
  }
})

export const todolistComponentLoader: ComponentLoader = {
  match(element: HTMLElement): boolean {
    return element.nodeName.toLowerCase() === 'tb-todolist'
  },
  read(element: HTMLElement, context: Injector, slotParser: SlotParser): ComponentInstance {
    const listConfig = Array.from(element.children).filter(child => !child.classList.contains('anime-component-tab')).map(child => {
      const stateElement = child.querySelector('.tb-todolist-state')
      return {
        childSlot: child.querySelector('.tb-todolist-content') as HTMLElement,
        slot: new Slot<TodoListSlotState>([
          ContentType.Text,
          ContentType.InlineComponent
        ], {
          active: !!stateElement?.classList.contains('tb-todolist-state-active'),
          disabled: !!stateElement?.classList.contains('tb-todolist-state-disabled')
        })
      }
    })

    return todolistComponent.createInstance(context, {
      slots: listConfig.map(i => {
        return slotParser(i.slot, i.childSlot)
      }),
      state: {
        dataAnime: element.dataset.anime === 'true',
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
