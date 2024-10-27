<script lang="ts" setup>
import { h, inject, nextTick, onMounted, onUnmounted, reactive, ref, useTemplateRef } from 'vue'
import { DropdownOption, useDialog, useMessage, useThemeVars } from 'naive-ui'
import { Layout, textAlignFormatter } from '@textbus/editor'
import { ComponentInstance, Selection, Injector, Renderer, fromEvent, Commander, Keyboard } from '@textbus/core'
import _ from 'lodash'
import { Input, VIEW_CONTAINER, VIEW_DOCUMENT } from '@textbus/platform-browser'
import { ColorProvider, Structurer } from '../../providers'
import { stat } from 'fs'
import { Icon } from '@iconify/vue'
import TipBtn from './TipBtn.vue'
import { isTargetKey } from './key'
import { emojis, createEmoji } from './emoji'
import { getComponents } from './components'

const injector = inject('injector') as Injector
const themeVars = useThemeVars()
const dialog = useDialog()
const message = useMessage()

const structurer = injector.get(Structurer)
const colorProvider = injector.get(ColorProvider)
const input = injector.get(Input)
const layout = injector.get(Layout)
const renderer = injector.get(Renderer)
const commander = injector.get(Commander)
const selection = injector.get(Selection)
const keyboard = injector.get(Keyboard)
const viewContainer = injector.get(VIEW_DOCUMENT)

const menuEl = useTemplateRef<HTMLElement>('menuEl')
const dropdownEl = useTemplateRef<HTMLElement>('dropdownEl')
const colorOptions = colorProvider.getColorOptions()

const state = reactive({
  left: 0,
  top: 0,
  show: true
})

const pointer = ref(1)
const secondaryPointer = ref(1)
const popoverPointer = ref(1)

onMounted(() => {
  console.log('shotcut menu mounted')
  openArrowKey()
  keyboard.addZenCodingInterceptor({
    match: function (content: string): boolean {
      // console.log(content)
      return content === ''
    },
    try: function (key, agent): boolean {
      console.log(key, agent)
      return key === '/' || isTargetKey(agent)
    },
    action: function (content: string): boolean {
      // console.log('zen coding', content)
      if (selection.isCollapsed) {
        const rect = input.caret.rect
        // console.log(structurer.scrollerRef!.offsetTop)
        const editorRect = layout.middle.getBoundingClientRect()
        // console.log(rect)
        // const scrollTop = structurer.scrollerRef!.scrollTop
        state.left = rect.left - editorRect.left - rect.width
        state.top = rect.top - editorRect.top + rect.height
        state.show = true

        const arrowEvents = openArrowKey()

        const subs = [
          fromEvent(document, 'click', true).subscribe(ev => {
            console.log('mousedown', ev, ev.target instanceof HTMLElement)
            // TODO bug 不能使用 .contains(menuEl.value) ,因为所有包含 menuEl 的元素都算
            if (ev.target instanceof HTMLElement && !ev.target.contains(menuEl.value)) {
              state.show = false
              subs.forEach(s => s.unsubscribe())
              arrowEvents.forEach(event => event.remove())
            }
          })
        ]
      }
      return false
    }
  })
})

function openArrowKey() {
  const max = commonOptions.length + baseOptions.length
  let jumpIndex = 0
  const keyEvents = [
    keyboard.addShortcut({
      keymap: { key: 'ArrowUp' },
      action: function (): boolean {
        if (dropdownState.show) {
          secondaryPointer.value = secondaryPointer.value > 1 ? secondaryPointer.value - 1 : dropdownState.optionCount
          return true
        }
        if (popoverState.show) {
          secondaryPointer.value =
            secondaryPointer.value - popoverState.row >= 1
              ? secondaryPointer.value - popoverState.row
              : secondaryPointer.value - popoverState.row + popoverState.optionCount
          return true
        }
        if ([7, 8, 9, 10, 11, 12].includes(pointer.value)) {
          pointer.value = pointer.value - 6
          return true
        }
        // 跳到上一个分组
        if ([13].includes(pointer.value)) {
          pointer.value = jumpIndex ? jumpIndex : 7
          return true
        }
        pointer.value = _.clamp(pointer.value - 1, 1, max)
        return true
      }
    }),
    keyboard.addShortcut({
      keymap: { key: 'ArrowDown' },
      action: function (): boolean {
        if (dropdownState.show) {
          secondaryPointer.value = secondaryPointer.value < dropdownState.optionCount ? secondaryPointer.value + 1 : 1
          return true
        }
        if (popoverState.show) {
          secondaryPointer.value =
            secondaryPointer.value + popoverState.row <= popoverState.optionCount
              ? secondaryPointer.value + popoverState.row
              : secondaryPointer.value + popoverState.row - popoverState.optionCount
          return true
        }
        if ([1, 2, 3, 4, 5, 6].includes(pointer.value)) {
          pointer.value = pointer.value + 6
          return true
        }
        // 跳到下一个分组
        if ([7, 8, 9, 10, 11, 12].includes(pointer.value)) {
          jumpIndex = pointer.value
          pointer.value = 13
          return true
        }
        pointer.value = _.clamp(pointer.value + 1, 1, max)
        return true
      }
    }),
    keyboard.addShortcut({
      keymap: { key: 'ArrowLeft' },
      action: function (): boolean {
        console.log('left', pointer.value)
        if (dropdownState.show) {
          dropdownState.show = false
          dropdownState.optionCount = 0
          secondaryPointer.value = 1
          return true
        }
        if (popoverState.show) {
          if (popoverState.edge.includes(secondaryPointer.value)) {
            popoverState.show = false
            popoverState.optionCount = 0
            secondaryPointer.value = 1
            return true
          }
          secondaryPointer.value = secondaryPointer.value > 1 ? secondaryPointer.value - 1 : popoverOptions.length
          return true
        }
        pointer.value = _.clamp(pointer.value - 1, 1, max)
        return true
      }
    }),
    keyboard.addShortcut({
      keymap: { key: 'ArrowRight' },
      action: function (): boolean {
        console.log('right')
        if (dropdownState.show) {
          secondaryPointer.value = secondaryPointer.value < dropdownState.optionCount ? secondaryPointer.value + 1 : 1
          return true
        }
        if (popoverState.show) {
          secondaryPointer.value = secondaryPointer.value < popoverState.optionCount ? secondaryPointer.value + 1 : 1
          return true
        }
        // 可展开项
        if ([14, 15, 16, 17, 20].includes(pointer.value)) {
          baseOptions[pointer.value - 13].onClick()
          return true
        }
        pointer.value = _.clamp(pointer.value + 1, 1, max)
        return true
      }
    }),
    keyboard.addShortcut({
      keymap: { key: ' ' },
      action: function (): boolean {
        keyEvents.forEach(event => event.remove())
        return false
      }
    }),
    keyboard.addShortcut({
      keymap: { key: 'Enter' },
      action: function (): boolean {
        if (pointer.value < 12) {
          commonOptions[pointer.value - 1].onClick()
        }
        // else {
        //   baseOptions[pointer.value - 13].onClick()
        // }
        return false
      }
    })
  ]
  return keyEvents
}

const commonOptions = [
  {
    key: 'title-1',
    label: '标题1',
    icon: 'ci:heading-h1',
    onClick: () => {}
  },
  {
    key: 'title-2',
    label: '标题2',
    icon: 'ci:heading-h2',
    onClick: () => {}
  },
  {
    key: 'title-3',
    label: '标题3',
    icon: 'ci:heading-h3',
    onClick: () => {}
  },
  {
    key: 'title-4',
    label: '标题4',
    icon: 'ci:heading-h4',
    onClick: () => {}
  },
  {
    key: 'title-5',
    label: '标题5',
    icon: 'ci:heading-h5',
    onClick: () => {}
  },
  {
    key: 'quote',
    label: '引用',
    icon: 'ic:round-format-quote',
    onClick: () => {}
  },
  {
    key: 'bold',
    label: '加粗',
    icon: 'ic:round-format-bold',
    onClick: () => {}
  },
  {
    key: 'italic',
    label: '斜体',
    icon: 'ic:round-format-italic',
    onClick: () => {}
  },
  {
    key: 'strikethrough',
    label: '删除线',
    icon: 'ic:round-format-strikethrough',
    onClick: () => {}
  },
  {
    key: 'underline',
    label: '下划线',
    icon: 'ic:round-format-underlined',
    onClick: () => {}
  },
  {
    key: 'code',
    label: '行内代码块',
    icon: 'ic:round-code',
    onClick: () => {}
  },
  {
    key: 'divider',
    label: '分割线',
    icon: 'radix-icons:divider-horizontal',
    onClick: () => {}
  }
]

const baseOptions = [
  {
    key: 'algin-center',
    label: '居中对齐',
    icon: 'material-symbols:align-horizontal-center-rounded',
    keymap: '',
    onClick: () => {
      
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

      dropdownOptions = [12, 13, 14, 15, 16, 18, 20, 24, 36, 48].map(size => {
        return {
          key: `${size}px`,
          label: `${size}px`,
          icon: '',
          props: {
            style: { fontSize: `${size}px` },
            onClick: () => {
              console.log(`${size}px`)
            }
          }
        }
      })

      const rect = target.getBoundingClientRect()
      console.log(rect)
      nextTick().then(() => {
        dropdownState.show = true
        dropdownState.xRef = rect.x + menuEl.value!.offsetWidth - 24
        dropdownState.yRef = rect.y
        dropdownState.optionCount = dropdownOptions.length
        onClickoutside()
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

      popoverOptions = colorOptions.map(color => {
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
              console.log(color)
            }
          }
        }
      })

      renderOption = () => {
        return h(
          'div',
          { class: 'color-options' },
          popoverOptions.map((item, index) => {
            return h('div', { class: { 'color-option': 1, 'color-option-selected': index + 1 === secondaryPointer.value }, ...item.props })
          })
        )
      }

      nextTick().then(() => {
        popoverState.show = true
        popoverState.xRef = rect.x + menuEl.value!.offsetWidth - 24
        popoverState.yRef = rect.y
        popoverState.optionCount = popoverOptions.length
        popoverState.row = 4
        popoverState.edge = []
        for (let i = popoverOptions.length + 1 - popoverState.row; i > 0; i = i - popoverState.row) {
          popoverState.edge.push(i)
        }
        console.log(popoverState.edge)
        onClickoutside()
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

      popoverOptions = colorOptions.map(color => {
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
              console.log(color)
            }
          }
        }
      })

      renderOption = () => {
        return h(
          'div',
          { class: 'color-options' },
          popoverOptions.map((item, index) => {
            return h('div', { class: { 'color-option': 1, 'color-option-selected': index + 1 === secondaryPointer.value }, ...item.props })
          })
        )
      }

      nextTick().then(() => {
        popoverState.show = true
        popoverState.xRef = rect.x + menuEl.value!.offsetWidth - 24
        popoverState.yRef = rect.y
        popoverState.optionCount = popoverOptions.length
        popoverState.row = 4
        popoverState.edge = []
        for (let i = popoverOptions.length + 1 - popoverState.row; i > 0; i = i - popoverState.row) {
          popoverState.edge.push(i)
        }
        console.log(popoverState.edge)
        onClickoutside()
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

      popoverOptions = emojis.map(emoji => {
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
              console.log(emoji)
            }
          }
        }
      })

      renderOption = () => {
        return h(
          'div',
          { class: 'emoji-options' },
          popoverOptions.map((item, index) => {
            return h('div', { class: { 'emoji-option': 1, 'emoji-option-selected': index + 1 === secondaryPointer.value }, ...item.props })
          })
        )
      }

      nextTick().then(() => {
        popoverState.show = true
        popoverState.xRef = rect.x + menuEl.value!.offsetWidth - 24
        popoverState.yRef = rect.y
        popoverState.optionCount = popoverOptions.length
        popoverState.row = 10
        popoverState.edge = []
        for (let i = popoverOptions.length + 1 - popoverState.row; i > 0; i = i - popoverState.row) {
          popoverState.edge.push(i)
        }
        onClickoutside()
      })
    }
  },
  {
    key: 'olist',
    label: '有序列表',
    icon: 'material-symbols:format-list-numbered',
    keymap: '',
    onClick: () => {}
  },
  {
    key: 'ulist',
    label: '无序列表',
    icon: 'material-symbols:format-list-bulleted',
    keymap: '',
    onClick: () => {}
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

      popoverOptions = getComponents(injector).map(component => {
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
            onClick: () => {
              //
            }
          }
        }
      })

      renderOption = () => {
        return h(
          'div',
          { class: 'component-options' },
          popoverOptions.map((item, index) => {
            return h('div', { class: { 'component-option': 1, 'component-option-selected': index + 1 === secondaryPointer.value }, ...item.props })
          })
        )
      }

      nextTick().then(() => {
        popoverState.show = true
        popoverState.xRef = rect.x + menuEl.value!.offsetWidth - 24
        popoverState.yRef = rect.y
        popoverState.optionCount = popoverOptions.length
        popoverState.row = 4
        popoverState.edge = []
        for (let i = popoverOptions.length + 1 - popoverState.row; i > 0; i = i - popoverState.row) {
          popoverState.edge.push(i)
        }
        onClickoutside()
      })
    }
  }
]

const dropdownState = reactive({
  xRef: 0,
  yRef: 0,
  show: false,
  optionCount: 0 // 选项个数
})
let dropdownOptions: any[] = []

function onClickoutside() {
  const s = fromEvent(document, 'click', true).subscribe(ev => {
    dropdownState.show = false
    popoverState.show = false
    s.unsubscribe()
  })
}
function handleSelect() {}

const popoverState = reactive({
  xRef: 0,
  yRef: 0,
  show: false,
  optionCount: 0,
  row: 0, // 每列选项数量
  edge: [] as number[] // 边缘元素下标
})
let popoverOptions: any[] = []

let renderOption: any

onMounted(() => {})
</script>

<template>
  <div ref="menuEl" v-show="state.show" class="shotcut-menu" :style="{ left: `${state.left}px`, top: `${state.top}px` }">
    <n-flex>
      <n-flex class="zone">
        <span class="title">常用</span>
        <div class="btns">
          <div v-for="(item, index) in commonOptions" :class="{ btn: 1, active: index + 1 === pointer }" :key="item.key">
            <TipBtn :tip="item.label" @click="item.onClick">
              <Icon :icon="item.icon" height="24" />
            </TipBtn>
          </div>
        </div>
      </n-flex>
      <div class="zone">
        <span class="title">基础</span>
        <div class="options">
          <div
            v-for="(item, index) in baseOptions"
            :key="item.key"
            :class="{ option: 1, selected: index + 13 === pointer }"
            @click.self="item.onClick"
          >
            <div class="prefix">
              <Icon class="icon" :icon="item.icon" height="24" />
            </div>
            <div class="label">
              <span>{{ item.label }}</span>
            </div>
            <div class="suffix">
              {{ item.keymap }}
              <Icon v-if="item.deployable" icon="ic:round-keyboard-arrow-right" height="24" />
            </div>
          </div>
        </div>
      </div>
    </n-flex>
    <div ref="dropdownEl" class="dropdown" v-show="dropdownState.show" :style="{ left: `${dropdownState.xRef}px`, top: `${dropdownState.yRef}px` }">
      <div class="dropdown-options">
        <div
          :class="{ 'dropdown-option': 1, 'dropdown-option-selected': index + 1 === secondaryPointer }"
          v-for="(item, index) in dropdownOptions"
          :key="item.key"
          v-bind="item.props"
        >
          <div class="prefix" v-if="!!item.icon">
            <Icon class="icon" :icon="item.icon" height="24" />
          </div>
          <div class="label">
            <span>{{ item.label }}</span>
          </div>
          <div class="suffix">
            {{ item.keymap }}
          </div>
        </div>
      </div>
    </div>
    <div ref="popoverEl" class="popover" v-show="popoverState.show" :style="{ left: `${popoverState.xRef}px`, top: `${popoverState.yRef}px` }">
      <component :is="renderOption" />
      <!-- <div class="popover-content">
        <component :is="renderOption" v-for="(item, index) in popoverOptions" :key="item.key" v-bind="item.props" @click="item.onClick" />
      </div> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.shotcut-menu {
  position: absolute;
  width: 300px;
  height: 500px;
  background-color: var(--tb-cardColor);
  box-shadow: v-bind('themeVars.boxShadow1');
  border-radius: 4px;
  box-sizing: border-box;
  padding: 24px 24px;
  overflow: hidden;
  overflow-y: auto;
  // overflow: overlay;
}
.zone {
  width: 100%;
  .title {
    font-size: 14px;
    color: v-bind('themeVars.textColor3');
  }
  .btns {
    display: flex;
    // flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      width: 28px;
      padding: 6px;
      border-radius: 3px;
      cursor: pointer;
      &:hover {
        background-color: v-bind('themeVars.buttonColor2Hover');
      }
    }
    .active {
      background-color: v-bind('themeVars.buttonColor2Pressed');
    }
  }
}

.options {
  display: flex;
  flex-direction: column;
  width: 100%;
  .option {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 36px;
    padding: 6px 8px;
    margin-top: 2px;
    box-sizing: border-box;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: v-bind('themeVars.buttonColor2Hover');
    }

    .prefix {
      width: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }
    .label {
      flex: 1;
      display: flex;
      align-items: center;
      margin: 0 12px;
      pointer-events: none;
    }
    .suffix {
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }
  }
  .selected {
    background-color: v-bind('themeVars.buttonColor2Pressed');
  }
}

.shotcut-menu {
  &::-webkit-scrollbar {
    width: 4px;
    background-color: var(--tb-cardColor) !important;
  }
  &::-webkit-scrollbar-track {
    border-radius: 10px;
    width: 4px;
    background-color: var(--tb-cardColor) !important;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: var(--tb-scrollbarColor) !important;
    background-color: unset !important;
  }
  &::-webkit-scrollbar-track-piece {
    background-color: unset !important;
  }
}

.dropdown {
  position: fixed;
  margin-left: 2px;
  min-width: 240px;
  border-radius: 4px;
  padding: 6px;
  background-color: var(--tb-cardColor);
  .dropdown-options {
    display: flex;
    flex-direction: column;
    .dropdown-option {
      display: flex;
      flex-direction: row;
      align-items: center;
      min-height: 36px;
      padding: 6px 8px;
      box-sizing: border-box;
      border-radius: 4px;
      cursor: pointer;
      &:hover {
        background-color: v-bind('themeVars.buttonColor2Hover');
      }

      .prefix {
        width: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .label {
        flex: 1;
        display: flex;
        align-items: center;
        margin: 0 12px;
      }
      .suffix {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .dropdown-option-selected {
      background-color: v-bind('themeVars.buttonColor2Pressed');
    }
  }
}

.popover {
  position: fixed;
  margin-left: 2px;
  border-radius: 4px;
  padding: 6px;
  background-color: var(--tb-cardColor);
  .popover-content {
    display: flex;
    flex-wrap: wrap;
  }
  .popover-option-selected {
    background-color: v-bind('themeVars.buttonColor2Pressed');
  }
}

:deep(.color-options) {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 6px;
  max-width: 130px;
  .color-option {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    margin: 4px;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      border: 2px solid #eee;
      scale: 1.1;
    }
  }
  .color-option-selected {
    border: 2px solid #eee;
    scale: 1.1;
  }
}

:deep(.emoji-options) {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 6px;
  max-width: 320px;
  .emoji-option {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    margin: 4px;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      border: 2px solid #eee;
      scale: 1.1;
    }
  }
  .emoji-option-selected {
    border: 2px solid #eee;
    scale: 1.1;
  }
}

:deep(.component-options) {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 6px;
  max-width: 500px;
  .component-option {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    margin: 12px;
    height: 70px;
    width: 100px;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      border: 2px solid #eee;
      scale: 1.1;
    }
  }
  .component-option-selected {
    border: 2px solid #eee;
    scale: 1.1;
  }
}
</style>
