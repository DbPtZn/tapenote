import {
  Commander,
  Component,
  ComponentStateLiteral,
  ContentType,
  onContentDeleted,
  Query,
  QueryStateType,
  Registry,
  Slot,
  Textbus,
  useContext,
  Selection,
  useSelf,
} from '@textbus/core'
import { ComponentLoader, SlotParser } from '@textbus/platform-browser'
import { ViewComponentProps } from '@textbus/adapter-viewfly'

import { useReadonly } from '../../hooks/use-readonly'
import { useOutput } from '../../hooks/use-output'
import { SlotRender } from '../SlotRender'
import './anime.component.scss'

export interface AnimeComponentState {
  dataId: string
  dataEffect: string
  dataSerial: string
  dataState: string
  dataTitle: string
  slot: Slot
}

export class AnimeComponent extends Component<AnimeComponentState> {
  static componentName = 'AnimeComponent'
  static type = ContentType.BlockComponent

  static fromJSON(textbus: Textbus, json: ComponentStateLiteral<AnimeComponentState>) {
    // const slot = textbus.get(Registry).createSlot(json.slot)
    return new AnimeComponent(textbus, {
      dataId: json.dataId,
      dataEffect: json.dataEffect,
      dataSerial: json.dataSerial,
      dataState: json.dataState,
      dataTitle: json.dataTitle,
      slot: textbus.get(Registry).createSlot(json.slot)
    })
  }

  constructor(textbus: Textbus, state: AnimeComponentState = {
    dataId: '',
    dataEffect: '',
    dataSerial: '',
    dataState: 'inactive',
    dataTitle: '',
    slot: new Slot([ContentType.BlockComponent, ContentType.InlineComponent, ContentType.Text])
  }) {
   super(textbus, state)
  }

  override setup() {
    const commander = this.textbus.get(Commander)
    const componentInstance = useSelf()
    
    onContentDeleted((ev) => {
      /** 插槽中的组件删除后如果插槽为空，则移除动画组件 */
      if (ev.target.sliceContent()[0] === '\n') {
        // console.log('slot is empty, delete anime component')
        commander.removeComponent(componentInstance)
      }
    })
  }
}

export function toAnimeComponent(textbus: Textbus) {
  console.log('toAnimeComponent')
  const query = textbus.get(Query)
  const commander = textbus.get(Commander)
  const selection = textbus.get(Selection)

  const state = query.queryComponent(AnimeComponent)
  if (state.state === QueryStateType.Enabled) {
    const current = state.value!
    const parent = current.parent!

    const index = parent.indexOf(current)

    parent.retain(index)

    commander.removeComponent(current)

    current.__slots__.get(0)!.sliceContent().forEach(i => {
      parent.insert(i)
    })
  } else {
    const block = new AnimeComponent(textbus)
    const slot = block.state.slot
    if (selection.startSlot === selection.endSlot) {
      const parentComponent = selection.startSlot!.parent!
      const parentSlot = parentComponent.parent!
      const position = parentSlot.indexOf(parentComponent)
      slot.insert(parentComponent)
      parentSlot.retain(position)
      parentSlot.insert(block)
    } else {
      const commonAncestorSlot = selection.commonAncestorSlot!
      const scope = selection.getCommonAncestorSlotScope()!
      commonAncestorSlot.cut(scope.startOffset, scope.endOffset).sliceContent().forEach(i => {
        slot.insert(i)
      })
      commonAncestorSlot.retain(scope.startOffset)
      commonAncestorSlot.insert(block)
    }
  }
}

export function AnimeView(props: ViewComponentProps<AnimeComponent>) {
  const readonly = useReadonly()
  const output = useOutput()
  return () => {
    const state = props.component.state
    const slot = state.slot
    return (
      <anime-component 
        class="anime-component" 
        ref={props.rootRef} 
        data-component={props.component.name}
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
          data-state={state.dataState}
          onMouseenter={(ev) => {
            const target = ev.target as HTMLElement
            target.parentElement?.classList.add('anime-component-evoke')
          }}
          onMouseleave={(ev) => {
            const target = ev.target as HTMLElement
            target.parentElement?.classList.remove('anime-component-evoke')
          }}
        />
        <SlotRender tag='div' class='anime-component-content' slot={slot} renderEnv={readonly() || output()} />
      </anime-component>
    )
  }
}

export const animeComponentLoader: ComponentLoader = {
  match(element: HTMLElement): boolean {
    return element.tagName.toLowerCase() === 'anime-component'
  },
  read(element: HTMLElement, textbus: Textbus, slotParser: SlotParser): Component {
    const slot = slotParser(new Slot([
      ContentType.BlockComponent,
      ContentType.InlineComponent,
      ContentType.Text
    ]), element)

    return new AnimeComponent(textbus, {
      dataId: element.getAttribute('data-id') || '',
      dataEffect: element.getAttribute('data-effect') || '',
      dataSerial: element.getAttribute('data-serial') || '',
      dataState: element.getAttribute('data-state') || '',
      dataTitle: element.getAttribute('data-title') || '',
      slot
    })
  },
}