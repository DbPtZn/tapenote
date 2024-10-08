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
  onBreak,
  Adapter,
} from '@textbus/core'
import { ComponentLoader, SlotParser } from '@textbus/platform-browser'
import { ViewComponentProps } from '@textbus/adapter-viewfly'

import { useReadonly } from '../../hooks/use-readonly'
import { useOutput } from '../../hooks/use-output'
import { SlotRender } from '../SlotRender'
import './anime.component.scss'
import { AnimeProvider } from '../../../providers/_api'
import { headingAttr } from '../../../textbus/attributes/_api'
import { BlockquoteComponent, HighlightBoxComponent, ParagraphComponent } from '../_api'

type AnimeState = 'active' | 'inactive'

export interface AnimeComponentState {
  dataId: string
  dataEffect: string
  dataSerial: string
  dataState: AnimeState
  dataTitle: string
  dataRange: boolean
  slot: Slot
}

export class AnimeComponent extends Component<AnimeComponentState> {
  override getSlots(): Slot[] {
    return [this.state.slot]
  }
  static componentName = 'AnimeComponent'
  static type = ContentType.BlockComponent

  static fromJSON(textbus: Textbus, json: ComponentStateLiteral<AnimeComponentState>) {
    return new AnimeComponent(textbus, {
      dataId: json.dataId,
      dataEffect: json.dataEffect,
      dataSerial: json.dataSerial,
      dataState: json.dataState,
      dataTitle: json.dataTitle,
      dataRange: json.dataRange,
      slot: textbus.get(Registry).createSlot(json.slot)
    })
  }

  constructor(textbus: Textbus, state: AnimeComponentState = {
    dataId: '',
    dataEffect: '',
    dataSerial: '',
    dataState: 'inactive',
    dataTitle: '',
    dataRange: false,
    slot: new Slot([ContentType.BlockComponent, ContentType.InlineComponent, ContentType.Text])
  }) {
   super(textbus, state)
   this.textbus = textbus
  }

  static createAnimeComponent(textbus: Textbus, effect: string, title: string, range = true) {
    const animeProvider = textbus.get(AnimeProvider)
    const id = animeProvider.generateAnimeId()
    const serial = animeProvider.generateAnimeSerial().toString()
    const component = new AnimeComponent(textbus, {
      dataId: id,
      dataEffect: effect,
      dataSerial: serial.toString(),
      dataState: 'inactive',
      dataTitle: title,
      dataRange: range,
      slot: new Slot([ContentType.BlockComponent])
    })
    return component
  }

  /** 添加动画 */
  static addAnime(componentInstance: Component | null, textbus: Textbus, effect: string, title: string) {
    if (!componentInstance) return
    const animeProvider = textbus.get(AnimeProvider)
    const commander = textbus.get(Commander)
    const id = animeProvider.generateAnimeId()
    const serial = animeProvider.generateAnimeSerial().toString()
    try {
      if(['ListComponent'].includes(componentInstance.name)) {
        componentInstance.state.dataAnime = true
        componentInstance.state.dataId = id
        componentInstance.state.dataSerial = serial
        componentInstance.state.dataState = 'inactive'
        componentInstance.state.dataEffect = effect
        componentInstance.state.dataTitle = title
        return
      }
      const slot = new Slot([ContentType.BlockComponent])
      const anime = new AnimeComponent(textbus, {
        dataId: id,
        dataEffect: effect,
        dataSerial: serial.toString(),
        dataState: 'inactive',
        dataTitle: title,
        dataRange: false,
        slot
      })
      commander.replaceComponent(componentInstance, anime)
      // 可以在插入组件后再把内容插入插槽
      slot.insert(componentInstance)
    } catch (error) {
      console.log(error)
    }
  }

  /** 移除动画组件 */
  static removeAnime(componentInstance: Component | null, textbus: Textbus) {
    if (!componentInstance) return
    if (componentInstance instanceof AnimeComponent) {
      const commander = textbus.get(Commander)
    
      const parent = componentInstance.parent!

      const index = parent.indexOf(componentInstance)

      parent.retain(index)

      commander.removeComponent(componentInstance)

      componentInstance.slots.at(0)!.sliceContent().forEach(i => {
        parent.insert(i)
      })

      return
    }
    if (componentInstance.state.dataAnime) {
      componentInstance.state.dataAnime = false
      componentInstance.state.dataId = ''
      componentInstance.state.dataEffect = ''
      componentInstance.state.dataSerial = ''
      componentInstance.state.dataState = ''
      componentInstance.state.dataTitle = ''
      componentInstance.state.dataRange = false
    }
  }

  override setup() {
    const commander = this.textbus.get(Commander)
    const selection = this.textbus.get(Selection)
    const componentInstance = useSelf()
    
    onContentDeleted((ev) => {
      /** 插槽中的组件删除后如果插槽为空，则移除动画组件 */
      if (ev.target.sliceContent()[0] === '\n') {
        // console.log('slot is empty, delete anime component')
        commander.removeComponent(componentInstance)
      }
    })
    
    onBreak(ev => {
      const isEmpty = this.state.slot.isEmpty
      const afterSlot = ev.target.cut(ev.data.index)
      afterSlot.removeAttribute(headingAttr)
      const nextParagraph = new ParagraphComponent(this.textbus, {
        slot: afterSlot
      })

      if (isEmpty && (
        this.parentComponent instanceof BlockquoteComponent ||
        this.parentComponent instanceof HighlightBoxComponent
      )) {
        commander.insertAfter(nextParagraph, this.parentComponent)
        commander.removeComponent(this)
      } else {
        commander.insertAfter(nextParagraph, this)
      }
      selection.setPosition(afterSlot, 0)
      ev.preventDefault()
    })
  }
}

export function toAnimeComponent(textbus: Textbus, effect: string, title: string) {
  const selection = textbus.get(Selection)
  const animeProvider = textbus.get(AnimeProvider)
  const id = animeProvider.generateAnimeId()
  const serial = animeProvider.generateAnimeSerial().toString()
  
  const block = new AnimeComponent(textbus, {
    dataId: id,
    dataEffect: effect,
    dataSerial: serial.toString(),
    dataState: 'inactive',
    dataTitle: title,
    dataRange: true,
    slot: new Slot([ContentType.BlockComponent])
  })
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

export function AnimeView(props: ViewComponentProps<AnimeComponent>) {
  const readonly = useReadonly()
  const output = useOutput()
  return () => {
    const state = props.component.state
    const slot = state.slot
    return (
      <anime-component 
        class={{ 'anime-component': true, 'anime-range': state.dataRange }} 
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
      dataState: element.getAttribute('data-state') as AnimeState || 'inactive',
      dataTitle: element.getAttribute('data-title') || '',
      dataRange: element.getAttribute('data-range') === 'true',
      slot
    })
  },
}