import {
  ComponentInitData,
  ComponentInstance,
  ContentType,
  Injector,
  Slot,
  SlotRender,
  VElement,
  defineComponent,
  onBreak,
  useContext,
  useSlots,
  Selection,
  onContentInsert
} from '@textbus/core'
import { ComponentLoader, SlotParser } from '@textbus/platform-browser'
import { paragraphComponent } from './paragraph.component'

// TODO 折叠功能： 可以将该组件的高度设置为0px, 具体参考UI组件中的折叠组件。

export const animeIgnoreComponent = defineComponent({
  type: ContentType.BlockComponent,
  name: 'AnimeIgnoreComponent',
  setup(initData?: ComponentInitData<any, any>) {
    const injector = useContext()
    const selection = injector.get(Selection)
    // let state = initData?.state || {
    //   collapse: false
    // }
    // const self = useSelf()
    // const controller = useState(state)
    // controller.onChange.subscribe((newData) => {
    //   state = newData
    // })
    // 插入段落而不是文本
    onContentInsert(ev => {
      if (typeof ev.data.content === 'string' || ev.data.content.type !== ContentType.BlockComponent) {
        const p = paragraphComponent.createInstance(injector)
        const slot = p.slots.get(0)!
        slot.insert(ev.data.content)
        ev.target.insert(p)
        selection.setPosition(slot, slot.index)
        ev.preventDefault()
      }
    })
    onBreak((ev) => {
      const p = paragraphComponent.createInstance(injector)
      const slot = slots.get(0)!
      slot.insert(p)
      selection.setPosition(p.slots.get(0)!, 0)
      ev.preventDefault()
    })
    /** 插槽 */
    const slots = useSlots(initData?.slots || [new Slot([ContentType.Text, ContentType.InlineComponent, ContentType.BlockComponent])])
    const slot = slots.get(0)

    return {
      render(slotRender: SlotRender): VElement {
        return (
          <anime-ignore>
            <span
              class={'anime-ignore-btn'}
              onClick={(ev) => {
                const target = ev.target as HTMLElement
                if (target.parentElement?.classList.contains('anime-ignore-collapse')) {
                  target.parentElement?.classList.remove('anime-ignore-collapse')
                  // target.parentElement?.classList.add('anime-ignore-expand')
                } else {
                  target.parentElement?.classList.add('anime-ignore-collapse')
                }
                // else if (target.parentElement?.classList.contains('anime-ignore-expand')) {
                //   target.parentElement?.classList.remove('anime-ignore-expand')
                //   target.parentElement?.classList.add('anime-ignore-collapse')
                // }
                // self.updateState(draft => {
                //   draft.collapse = !draft.collapse
                // })
              }}
            />
            {slotRender(slot!, children => {
              return <div class={'anime-ignore-container'}>{children}</div>
            })}
          </anime-ignore>
        )
      }
    }
  }
})

export const animeIgnoreComponentLoader: ComponentLoader = {
  resources: {
    styles: [`
      anime-ignore {
        display: block;
        position: relative;
        padding: 8px 8px;
        outline: 3px dotted #aaaaaa30;
      }
      anime-ignore:hover .anime-ignore-btn {
        opacity: 1;
      }
      .anime-ignore-container {
        overflow: hidden;
      }
      .anime-ignore-btn {
        opacity: 0;
        position: absolute;
        left: -38px;
        top: -3px;
        cursor: pointer;
        user-select: none;
        padding: 3px;
        border-radius: var(--tb-borderRadius);
        margin: 3px;
        width: 24px;
        height: 24px;
      }
      .anime-ignore-btn:before {
        content: "";
        position: absolute;
        top: 3px;
        right: 8px;
        border-width: 0 10px 10px 0;
        border-style: solid;
        border-color: transparent rgb(218, 218, 218) transparent transparent;
        transform: rotate(135deg);
        transition: all 0.1s ease-in-out;
      }
      .anime-ignore-collapse .anime-ignore-btn:before {
        transform: rotate(45deg);
      }
      .anime-ignore-expand .anime-ignore-btn:before {}
      .anime-ignore-collapse .anime-ignore-container {
        max-height: 0;
      }
    `]
  },
  match(element: HTMLElement): boolean {
    // return element.classList.contains('anime-ignore')
    return element.tagName.toLocaleLowerCase() === 'anime-ignore'
  },
  read(element: HTMLElement, context: Injector, slotParser: SlotParser): ComponentInstance {
    const slot = new Slot([ContentType.Text, ContentType.BlockComponent, ContentType.InlineComponent])
    slotParser(slot, element)
    return animeIgnoreComponent.createInstance(context, {
      state: null,
      slots: [slot]
    })
  }
}
