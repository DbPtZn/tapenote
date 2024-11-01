import { Structurer, ColorProvider, dividerComponent, colorFormatter, textBackgroundColorFormatter, listComponent, } from "../../"
import { Commander, ContentType, Injector, Keyboard, Renderer, Slot, Selection, fromEvent } from "@textbus/core"
import { Layout, blockquoteComponent, boldFormatter, codeFormatter, fontSizeFormatter, headingComponent, italicFormatter, paragraphComponent, strikeThroughFormatter, textAlignFormatter, underlineFormatter } from "@textbus/editor"
import { Input, VIEW_DOCUMENT } from "@textbus/platform-browser"
import { Ref, ShallowRef, h, nextTick, reactive, ref } from "vue"
import { emojis, createEmoji } from './emoji'
import { getComponents } from "./components"

export function useBaseOptions(injector: Injector,  menuEl: Readonly<ShallowRef<HTMLElement | null>>, dropdownEl: Readonly<ShallowRef<HTMLElement | null>>, popoverEl: Readonly<ShallowRef<HTMLElement | null>>) {
  const structurer = injector.get(Structurer)
  const colorProvider = injector.get(ColorProvider)
  const input = injector.get(Input)
  const layout = injector.get(Layout)
  const renderer = injector.get(Renderer)
  const commander = injector.get(Commander)
  const selection = injector.get(Selection)
  const keyboard = injector.get(Keyboard)
  const viewContainer = injector.get(VIEW_DOCUMENT)
  const colorOptions = colorProvider.getColorOptions()
  const scrollerEl = structurer.scrollerRef!
  // const scrollerRect = scrollerEl.getBoundingClientRect()
  // const middleRect = layout.middle.getBoundingClientRect()
  const secondaryPointer = ref(1)
  
  const dropdownState = reactive({
    xRef: 0,
    yRef: 0,
    show: false,
    optionCount: 0 // 选项个数
  })
  const dropdownOptions = ref<any[]>([])
  
  const popoverState = reactive({
    xRef: 0,
    yRef: 0,
    width: 0,
    show: false,
    optionCount: 0,
    row: 0, // 每列选项数量
    edge: [] as number[] // 边缘元素下标
  })
  const popoverOptions = ref<any[]>([])
  const renderOption = ref()

  function handleClick() {
    commander.delete(true) // 向后删除一位，把 / 删除
  }
  
  function onClickoutside() {
    const s = fromEvent(document, 'click', true).subscribe(ev => {
      dropdownState.show = false
      popoverState.show = false
      s.unsubscribe()
    })
  }
  
  const baseOptions = [
    {
      key: 'algin-center',
      label: '居中对齐',
      icon: 'material-symbols:align-horizontal-center-rounded',
      keymap: '',
      onClick: () => {
        handleClick()
        commander.applyAttribute(textAlignFormatter, 'center')
      }
    },
    {
      key: 'fontsize',
      label: '字体大小',
      icon: 'ant-design:font-size-outlined',
      deployable: true,
      keymap: '',
      onClick: (ev?: MouseEvent) => {
        const target = ev ? (ev.target as HTMLElement) : menuEl.value?.querySelector<HTMLElement>('.selected')
        if (!target) return
  
        dropdownOptions.value = [12, 13, 14, 15, 16, 18, 20, 24, 36, 48].map(size => {
          return {
            key: `${size}px`,
            label: `${size}px`,
            icon: '',
            props: {
              style: { fontSize: `${size}px` },
              onClick: () => {
                // console.log(`${size}px`)
                handleClick()
                commander.applyFormat(fontSizeFormatter, `${size}px`)
              }
            }
          }
        })
  
        const rect = target.getBoundingClientRect()
        // console.log(rect)
        nextTick().then(() => {
          dropdownState.show = true
          const menuRect = menuEl.value!.getBoundingClientRect()
          const caretRect = input.caret.rect
          const middleRect = layout.middle.getBoundingClientRect()
          dropdownState.xRef = menuRect.width + (caretRect.left - middleRect.left - 8) + 1
          dropdownState.yRef = rect.top + scrollerEl.scrollTop - middleRect.top 
          dropdownState.optionCount = dropdownOptions.value.length
          onClickoutside()
          nextTick().then(() => {
            const dropdownRect = dropdownEl.value!.getBoundingClientRect()
            const scrollerRect = scrollerEl.getBoundingClientRect()
            if(dropdownRect.bottom > scrollerRect.bottom) {
              dropdownState.yRef -= dropdownRect.bottom - scrollerRect.bottom
            }
          })
        })
      }
    },
    {
      key: 'color',
      label: '文字颜色',
      icon: 'ic:round-format-color-text',
      deployable: true,
      keymap: '',
      onClick: (ev?: MouseEvent) => {
        const target = ev ? (ev.target as HTMLElement) : menuEl.value?.querySelector<HTMLElement>('.selected')
        if (!target) return
        const rect = target.getBoundingClientRect()
  
        popoverOptions.value = colorOptions.map(color => {
          return {
            key: color,
            label: color,
            icon: '',
            props: {
              'data-bgcolor': color,
              style: {
                backgroundColor: color,
                height: '24px',
                width: '24px'
              },
              onClick: () => {
                handleClick()
                commander.applyFormat(colorFormatter, color)
              }
            }
          }
        })
  
        renderOption.value = () => {
          return h(
            'div',
            { class: 'color-options' },
            popoverOptions.value.map((item, index) => {
              return h('div', { class: { 'color-option': 1, 'color-option-selected': index + 1 === secondaryPointer.value }, ...item.props })
            })
          )
        }
  
        nextTick().then(() => {
          popoverState.show = true
          const menuRect = menuEl.value!.getBoundingClientRect()
          const caretRect = input.caret.rect
          const middleRect = layout.middle.getBoundingClientRect()
          popoverState.xRef = menuRect.width + (caretRect.left - middleRect.left - 8) + 1
          popoverState.yRef = rect.top + scrollerEl.scrollTop - middleRect.top 
          popoverState.optionCount = popoverOptions.value.length
          popoverState.row = 4
          popoverState.edge = []
          for (let i = popoverOptions.value.length + 1 - popoverState.row; i > 0; i = i - popoverState.row) {
            popoverState.edge.push(i)
          }
          onClickoutside()
          nextTick().then(() => {
            const popoverRect = popoverEl.value!.getBoundingClientRect()
            const scrollerRect = scrollerEl.getBoundingClientRect()
            if(popoverRect.bottom > scrollerRect.bottom) {
              popoverState.yRef -= popoverRect.bottom - scrollerRect.bottom
            }
          })
        })
      }
    },
    {
      key: 'bgcolor',
      label: '文字背景颜色',
      icon: 'proicons:text-highlight-color-accent',
      deployable: true,
      keymap: '',
      onClick: (ev?: MouseEvent) => {
        const target = ev ? (ev.target as HTMLElement) : menuEl.value?.querySelector<HTMLElement>('.selected')
        if (!target) return
        const rect = target.getBoundingClientRect()
  
        popoverOptions.value = colorOptions.map(color => {
          return {
            key: color,
            label: color,
            icon: '',
            props: {
              'data-bgcolor': color,
              style: {
                backgroundColor: color,
                height: '24px',
                width: '24px'
              },
              onClick: () => {
                handleClick()
                commander.applyFormat(textBackgroundColorFormatter, color)
              }
            }
          }
        })
  
        renderOption.value = () => {
          return h(
            'div',
            { class: 'color-options' },
            popoverOptions.value.map((item, index) => {
              return h('div', { class: { 'color-option': 1, 'color-option-selected': index + 1 === secondaryPointer.value }, ...item.props })
            })
          )
        }
  
        nextTick().then(() => {
          popoverState.show = true
          const menuRect = menuEl.value!.getBoundingClientRect()
          const caretRect = input.caret.rect
          const middleRect = layout.middle.getBoundingClientRect()
          popoverState.xRef = menuRect.width + (caretRect.left - middleRect.left - 8) + 1
          popoverState.yRef = rect.top + scrollerEl.scrollTop - middleRect.top 
          popoverState.optionCount = popoverOptions.value.length
          popoverState.row = 4
          popoverState.edge = []
          for (let i = popoverOptions.value.length + 1 - popoverState.row; i > 0; i = i - popoverState.row) {
            popoverState.edge.push(i)
          }
          onClickoutside()
          nextTick().then(() => {
            const popoverRect = popoverEl.value!.getBoundingClientRect()
            const scrollerRect = scrollerEl.getBoundingClientRect()
            if(popoverRect.bottom > scrollerRect.bottom) {
              popoverState.yRef -= popoverRect.bottom - scrollerRect.bottom
            }
          })
        })
      }
    },
    {
      key: 'emoji',
      label: '表情',
      icon: 'ic:round-emoji-emotions',
      keymap: '',
      deployable: true,
      onClick: (ev?: MouseEvent) => {
        const target = ev ? (ev.target as HTMLElement) : menuEl.value?.querySelector<HTMLElement>('.selected')
        if (!target) return
        const rect = target.getBoundingClientRect()
  
        popoverOptions.value = emojis.map(emoji => {
          return {
            key: emoji,
            label: emoji,
            icon: '',
  
            props: {
              innerHTML: createEmoji(emoji),
              style: {
                height: '24px',
                width: '24px'
              },
              onClick: () => {
                handleClick()
                const span = document.createElement('span')
                span.innerHTML = createEmoji(emoji)
                const value = span.innerHTML
                commander.insert(value)
                span.remove()
              }
            }
          }
        })
  
        renderOption.value = () => {
          return h(
            'div',
            { class: 'emoji-options' },
            popoverOptions.value.map((item, index) => {
              return h('div', { class: { 'emoji-option': 1, 'emoji-option-selected': index + 1 === secondaryPointer.value }, ...item.props })
            })
          )
        }
  
        nextTick().then(() => {
          popoverState.show = true
          const menuRect = menuEl.value!.getBoundingClientRect()
          const caretRect = input.caret.rect
          const middleRect = layout.middle.getBoundingClientRect()
          popoverState.xRef = menuRect.width + (caretRect.left - middleRect.left - 8) + 1
          popoverState.yRef = rect.top + scrollerEl.scrollTop - middleRect.top 
          popoverState.optionCount = popoverOptions.value.length
          popoverState.row = 10
          popoverState.edge = []
          for (let i = popoverOptions.value.length + 1 - popoverState.row; i > 0; i = i - popoverState.row) {
            popoverState.edge.push(i)
          }
          onClickoutside()
          nextTick().then(() => {
            const popoverRect = popoverEl.value!.getBoundingClientRect()
            const scrollerRect = scrollerEl.getBoundingClientRect()
            if(popoverRect.bottom > scrollerRect.bottom) {
              popoverState.yRef -= popoverRect.bottom - scrollerRect.bottom
            }
          })
        })
      }
    },
    {
      key: 'olist',
      label: '有序列表',
      icon: 'material-symbols:format-list-numbered',
      keymap: '',
      onClick: () => {
        handleClick()
        commander.transform({
          target: listComponent,
          multipleSlot: true,
          slotFactory(): Slot {
            return new Slot([
              ContentType.Text,
              ContentType.InlineComponent
            ])
          },
          stateFactory() {
            return 'ol'
          }
        })
      }
    },
    {
      key: 'ulist',
      label: '无序列表',
      icon: 'material-symbols:format-list-bulleted',
      keymap: '',
      onClick: () => {
        handleClick()
        commander.transform({
          target: listComponent,
          multipleSlot: true,
          slotFactory(): Slot {
            return new Slot([
              ContentType.Text,
              ContentType.InlineComponent
            ])
          },
          stateFactory() {
            return 'ul'
          }
        })
      }
    },
    {
      key: 'components',
      label: '组件',
      icon: 'icon-park-twotone:components',
      deployable: true,
      keymap: '',
      onClick: (ev?: MouseEvent) => {
        const target = ev ? (ev.target as HTMLElement) : menuEl.value?.querySelector<HTMLElement>('.selected')
        if (!target) return
        const rect = target.getBoundingClientRect()
  
        popoverOptions.value = getComponents(injector).map(component => {
          return {
            key: component.key,
            label: component.name,
            icon: '',
  
            props: {
              innerHTML: component.example,
              style: {
                // height: '24px',
                // width: '24px'
              },
              onClick: async () => {
                handleClick()
                const cmpt = await component.factory(injector)
                commander.insert(cmpt)
              }
            }
          }
        })
  
        renderOption.value = () => {
          return h(
            'div',
            { class: 'component-options' },
            popoverOptions.value.map((item, index) => {
              return h('div', { class: { 'component-option': 1, 'component-option-selected': index + 1 === secondaryPointer.value }, ...item.props })
            })
          )
        }
  
        nextTick().then(() => {
          popoverState.show = true
          const menuRect = menuEl.value!.getBoundingClientRect()
          const caretRect = input.caret.rect
          const middleRect = layout.middle.getBoundingClientRect()
          popoverState.xRef = menuRect.width + (caretRect.left - middleRect.left - 8) + 1
          popoverState.yRef = rect.top + scrollerEl.scrollTop - middleRect.top 
          popoverState.optionCount = popoverOptions.value.length
          popoverState.row = 4
          popoverState.edge = []
          for (let i = popoverOptions.value.length + 1 - popoverState.row; i > 0; i = i - popoverState.row) {
            popoverState.edge.push(i)
          }
          onClickoutside()
          nextTick().then(() => {
            const popoverRect = popoverEl.value!.getBoundingClientRect()
            const scrollerRect = scrollerEl.getBoundingClientRect()
            if(popoverRect.bottom > scrollerRect.bottom) {
              popoverState.yRef -= popoverRect.bottom - scrollerRect.bottom
            }
          })
        })
      }
    }
  ]
  
  return {
    secondaryPointer,
    baseOptions,
    renderOption,
    dropdownOptions,
    popoverOptions,
    dropdownState,
    popoverState
  }
}