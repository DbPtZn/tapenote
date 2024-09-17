import {
  Component,
  CompositionStartEventData,
  ComponentStateLiteral,
  ContentType,
  Event,
  onCompositionStart,
  Slot,
  Subject,
  Textbus,
  Registry,
  Subscription,
  fromEvent,
} from '@textbus/core'
import { ComponentLoader, SlotParser } from '@textbus/platform-browser'
import { createDynamicRef, onUpdated } from '@viewfly/core'
import { ViewComponentProps } from '@textbus/adapter-viewfly'

import './root.component.scss'
import { deltaToBlock, ParagraphComponent } from '../paragraph/paragraph.component'
import { useBlockContent } from '../../hooks/use-block-content'
import { useReadonly } from '../../hooks/use-readonly'
import { useOutput } from '../../hooks/use-output'
import { ListComponent } from '../list/list.component'
import { TodolistComponent } from '../todolist/todolist.component'
import { SlotRender } from '../SlotRender'

export interface RootComponentState {
  content: Slot
}

// export class AnimeRootComponent extends Component<RootComponentState> {
//   static componentName = 'AnimeRootComponent'
//   static type = ContentType.BlockComponent

//   static fromJSON(textbus: Textbus, json: ComponentStateLiteral<RootComponentState>) {
//     const content = textbus.get(Registry).createSlot(json.content)
//     return new AnimeRootComponent(textbus, {
//       content
//     })
//   }

//   onCompositionStart = new Subject<Event<Slot, CompositionStartEventData>>()

//   override setup() {
//     useBlockContent((slot) => slot === this.state.content)

//     onCompositionStart(ev => {
//       this.onCompositionStart.next(ev)
//     })
//   }

//   afterCheck() {
//     const content = this.state.content
//     const lastContent = content.getContentAtIndex(content.length - 1)
//     if (lastContent instanceof ParagraphComponent ||
//       lastContent instanceof ListComponent ||
//       lastContent instanceof TodolistComponent) {
//       return
//     }

//     content.retain(content.length)
//     content.insert(new ParagraphComponent(this.textbus))
//   }
// }

export class RootComponent extends Component<RootComponentState> {
  static componentName = 'RootComponent'
  static type = ContentType.BlockComponent

  static fromJSON(textbus: Textbus, json: ComponentStateLiteral<RootComponentState>) {
    const content = textbus.get(Registry).createSlot(json.content)
    return new RootComponent(textbus, {
      content
    })
  }

  onCompositionStart = new Subject<Event<Slot, CompositionStartEventData>>()

  override setup() {
    useBlockContent((slot) => slot === this.state.content)

    onCompositionStart(ev => {
      this.onCompositionStart.next(ev)
    })
  }

  afterCheck() {
    const content = this.state.content
    const lastContent = content.getContentAtIndex(content.length - 1)
    if (lastContent instanceof ParagraphComponent ||
      lastContent instanceof ListComponent ||
      lastContent instanceof TodolistComponent) {
      return
    }

    content.retain(content.length)
    content.insert(new ParagraphComponent(this.textbus))
  }
}

export function AnimeRootView(props: ViewComponentProps<RootComponent>) {
  const { content } = props.component.state
  const ref = createDynamicRef<HTMLDivElement>(node => {
    const subscription = new Subscription()
    subscription.add(
      props.component.onCompositionStart.subscribe(() => {
        (node.children[0] as HTMLElement).dataset.placeholder = ''
      }),
      // fromEvent(node, 'mousemove').subscribe(ev => {
      //   let nativeNode = ev.target as HTMLElement
      //     while (nativeNode) {
      //       const componentInstance = renderer.getComponentByNativeNode(nativeNode)
      //       if (componentInstance) {
      //         addAnimeService.updateActiveComponent(componentInstance === self ? null : componentInstance)
      //         break
      //       }
      //       nativeNode = nativeNode.parentNode as HTMLElement
      //     }
      // })
    )

    return () => {
      subscription.unsubscribe()
    }
  })

  onUpdated(() => {
    props.component.afterCheck()
  })

  const readonly = useReadonly()
  const output = useOutput()
  return () => {
    const { rootRef } = props

    return (
      <div class="xnote-root" dir='auto' ref={[rootRef, ref]} data-component={props.component.name}>
        <SlotRender
          slot={content}
          tag='div'
          data-color="#000000"
          class="xnote-content"
          data-placeholder={content.isEmpty ? '请输入内容' : ''}
          renderEnv={readonly() || output()}
        />
      </div>
    )
  }
}

export function RootView(props: ViewComponentProps<RootComponent>) {
  const { content } = props.component.state
  const ref = createDynamicRef<HTMLDivElement>(node => {
    const sub = props.component.onCompositionStart.subscribe(() => {
      (node.children[0] as HTMLElement).dataset.placeholder = ''
    })
    return () => {
      sub.unsubscribe()
    }
  })

  onUpdated(() => {
    props.component.afterCheck()
  })

  const readonly = useReadonly()
  const output = useOutput()
  return () => {
    const { rootRef } = props

    return (
      <div class="xnote-root" dir='auto' ref={[rootRef, ref]} data-component={props.component.name}>
        <SlotRender
          slot={content}
          tag='div'
          data-color="#000000"
          class="xnote-content"
          data-placeholder={content.isEmpty ? '请输入内容' : ''}
          renderEnv={readonly() || output()}
        />
      </div>
    )
  }
}

export const rootComponentLoader: ComponentLoader = {
  match(): boolean {
    return true
  },
  read(element: HTMLElement, textbus: Textbus, slotParser: SlotParser): Component | Slot {
    const delta = slotParser(new Slot([
      ContentType.BlockComponent,
      ContentType.InlineComponent,
      ContentType.Text
    ]), element).toDelta()
    const slot = new Slot([
      ContentType.BlockComponent
    ])

    deltaToBlock(delta, textbus).forEach(i => {
      slot.insert(i)
    })
    return slot
  }
}
