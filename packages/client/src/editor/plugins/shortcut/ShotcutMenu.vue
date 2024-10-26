<script lang="ts" setup>
import { inject, onMounted, onUnmounted, reactive, ref, useTemplateRef } from 'vue'
import { DropdownOption, useDialog, useMessage, useThemeVars } from 'naive-ui'
import { Layout, textAlignFormatter } from '@textbus/editor'
import { ComponentInstance, Selection, Injector, Renderer, fromEvent, Commander, Keyboard } from '@textbus/core'
import _ from 'lodash'
import { Input, VIEW_CONTAINER, VIEW_DOCUMENT } from '@textbus/platform-browser'
import { Structurer } from '@/editor'
import { stat } from 'fs'
import { Icon } from '@iconify/vue'
import TipBtn from './TipBtn.vue'
import { isTargetKey } from './key'

const injector = inject('injector') as Injector
const themeVars = useThemeVars()
const dialog = useDialog()
const message = useMessage()

const structurer = injector.get(Structurer)
const input = injector.get(Input)
const layout = injector.get(Layout)
const renderer = injector.get(Renderer)
const commander = injector.get(Commander)
const selection = injector.get(Selection)
const keyboard = injector.get(Keyboard)
const viewContainer = injector.get(VIEW_DOCUMENT)

const menuEl = useTemplateRef<HTMLElement>('menuEl')

const state = reactive({
  left: 0,
  top: 0,
  show: true
})

const pointer = ref(1)

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
  const max = 12
  const keyEvents = [
    keyboard.addShortcut({
      keymap: { key: 'ArrowUp' },
      action: function (): boolean {
        if ([7, 8, 9, 10, 11, 12].includes(pointer.value)) {
          pointer.value = pointer.value - 6
          return true
        }
        pointer.value = _.clamp(pointer.value - 1, 1, max)
        return true
      }
    }),
    keyboard.addShortcut({
      keymap: { key: 'ArrowDown' },
      action: function (): boolean {
        if ([1, 2, 3, 4, 5, 6].includes(pointer.value)) {
          pointer.value = pointer.value + 6
          return true
        }
        pointer.value = _.clamp(pointer.value + 1, 1, max)
        return true
      }
    }),
    keyboard.addShortcut({
      keymap: { key: 'ArrowLeft' },
      action: function (): boolean {
        console.log('left')
        pointer.value = _.clamp(pointer.value - 1, 1, max)
        return true
      }
    }),
    keyboard.addShortcut({
      keymap: { key: 'ArrowRight' },
      action: function (): boolean {
        console.log('right')
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

function onClickoutside() {}
function handleSelect() {}
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
        <span class="title">组件</span>
        <div class="options">
          <div v-for="item in 12" :key="item" class="option">
            <div class="prefix">
              <Icon class="icon" :icon="'ic:baseline-format-quote'" height="24" />
            </div>
            <div class="label">
              <span>{{ item }}</span>
            </div>
            <div class="suffix">k</div>
          </div>
        </div>
      </div>
    </n-flex>
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
  overflow: overlay;
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
    box-sizing: border-box;
    border-radius: 4px;
    // background-color: aliceblue;
    // border-bottom: 1px solid #eeeeee18;
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

    .selected {
      background-color: v-bind('themeVars.buttonColor2Pressed');
    }
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
</style>
