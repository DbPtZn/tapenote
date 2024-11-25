import { Structurer, ColorProvider, dividerComponent, codeComponent } from '../..'
import { Commander, ContentType, Injector, Keyboard, Renderer, Slot, Selection, TransformContext, Query, QueryStateType } from '@textbus/core'
import {
  Layout,
  blockquoteComponent,
  boldFormatter,
  codeFormatter,
  headingComponent,
  italicFormatter,
  paragraphComponent,
  strikeThroughFormatter,
  underlineFormatter
} from '@textbus/editor'
import { Input, VIEW_DOCUMENT } from '@textbus/platform-browser'

export function useCommonOptions(injector: Injector) {
  const structurer = injector.get(Structurer)
  const colorProvider = injector.get(ColorProvider)
  const input = injector.get(Input)
  const layout = injector.get(Layout)
  const renderer = injector.get(Renderer)
  const commander = injector.get(Commander)
  const selection = injector.get(Selection)
  const keyboard = injector.get(Keyboard)
  const viewContainer = injector.get(VIEW_DOCUMENT)
  const query = injector.get(Query)
  function handleClick() {
    commander.delete(true) // 向后删除一位，把 / 删除
  }

  function setHeading(value: string) {
    handleClick()
    const isHeading = /h[1-6]/.test(value)
    commander.transform({
      target: isHeading ? headingComponent : paragraphComponent,
      multipleSlot: false,
      slotFactory() {
        return new Slot([ContentType.Text, ContentType.InlineComponent])
      },
      stateFactory() {
        if (isHeading) {
          return value
        }
      }
    })
  }

  const commonOptions = [
    {
      key: 'title-1',
      label: '标题1',
      icon: 'ci:heading-h1',
      onClick: () => {
        // console.log('setHeading')
        setHeading('h1')
      }
    },
    {
      key: 'title-2',
      label: '标题2',
      icon: 'ci:heading-h2',
      onClick: () => {
        setHeading('h2')
      }
    },
    {
      key: 'title-3',
      label: '标题3',
      icon: 'ci:heading-h3',
      onClick: () => {
        setHeading('h3')
      }
    },
    {
      key: 'title-4',
      label: '标题4',
      icon: 'ci:heading-h4',
      onClick: () => {
        setHeading('h4')
      }
    },
    {
      key: 'title-5',
      label: '标题5',
      icon: 'ci:heading-h5',
      onClick: () => {
        setHeading('h5')
      }
    },
    {
      key: 'quote',
      label: '引用',
      icon: 'ic:round-format-quote',
      onClick: () => {
        handleClick()
        commander.transform({
          target: blockquoteComponent,
          multipleSlot: false,
          slotFactory: function (transformContext: TransformContext): Slot<unknown> {
            return new Slot([ContentType.Text, ContentType.InlineComponent, ContentType.BlockComponent])
          }
        })
        // const block = blockquoteComponent.createInstance(injector)
        // commander.write(block)
      }
    },
    {
      key: 'bold',
      label: '加粗',
      icon: 'ic:round-format-bold',
      onClick: () => {
        handleClick()
        commander.applyFormat(boldFormatter, '')
      }
    },
    {
      key: 'italic',
      label: '斜体',
      icon: 'ic:round-format-italic',
      onClick: () => {
        handleClick()
        commander.applyFormat(italicFormatter, true)
      }
    },
    {
      key: 'strikethrough',
      label: '删除线',
      icon: 'ic:round-format-strikethrough',
      onClick: () => {
        handleClick()
        commander.applyFormat(strikeThroughFormatter, true)
      }
    },
    {
      key: 'underline',
      label: '下划线',
      icon: 'ic:round-format-underlined',
      onClick: () => {
        handleClick()
        commander.applyFormat(underlineFormatter, true)
      }
    },
    {
      key: 'code',
      label: '行内代码块',
      icon: 'ic:round-code',
      onClick: () => {
        handleClick()
        const state = query.queryComponent(codeComponent)
        if (state.state === QueryStateType.Enabled) {
          const current = state.value!
          const parent = current.parent!

          const index = parent.indexOf(current)

          parent.retain(index)

          commander.removeComponent(current)

          current.slots
            .get(0)!
            .sliceContent()
            .forEach(i => {
              parent.insert(i)
            })
        } else {
          const commonAncestorSlot = selection.commonAncestorSlot!
          if (selection.startSlot === selection.endSlot) {
            if (selection.isCollapsed) {
              const slot = new Slot([ContentType.Text])
              slot.insert(' ') // 插入一个空字符占位 否则会默认插入一个 br 换行符
              const block = codeComponent.createInstance(injector, { slots: [slot] })
              commander.insert(block)
              selection.setPosition(slot, 0)
              return
            }
            const slot = selection.focusSlot?.cutTo(new Slot([ContentType.Text]), selection.startOffset!, selection.endOffset!)
            const block = codeComponent.createInstance(injector, { slots: [slot!] })
            commonAncestorSlot.insert(block)
          } else {
            return
          }
        }
      }
    },
    {
      key: 'divider',
      label: '分割线',
      icon: 'radix-icons:divider-horizontal',
      onClick: () => {
        handleClick()
        commander.transform({
          target: dividerComponent,
          multipleSlot: false,
          slotFactory: function (transformContext: TransformContext): Slot<unknown> {
            return new Slot([ContentType.Text])
          }
        })
        // const divider = dividerComponent.createInstance(injector)
        // commander.write(divider)
      }
    }
  ]

  return commonOptions
}
