<script lang="ts" setup>
import { h, inject, nextTick, onMounted, onUnmounted, reactive, ref, useTemplateRef } from 'vue'
import { DropdownOption, useDialog, useMessage, useThemeVars } from 'naive-ui'
import { Layout, textAlignFormatter } from '@textbus/editor'
import { ComponentInstance, Selection, Injector, Renderer, fromEvent, Commander, Keyboard, Subscription } from '@textbus/core'
import _ from 'lodash'
import { Input, VIEW_CONTAINER, VIEW_DOCUMENT } from '@textbus/platform-browser'
import { ColorProvider, Structurer } from '../../providers'
import { stat } from 'fs'
import { Icon } from '@iconify/vue'
import TipBtn from './TipBtn.vue'
import { isTargetKey } from './key'
import { useCommonOptions } from './commonOptions'
import { useBaseOptions } from './baseOptions'
import { watch } from 'vue'

const injector = inject('injector') as Injector
const themeVars = useThemeVars()
const dialog = useDialog()
const message = useMessage()

const structurer = injector.get(Structurer)
const colorProvider = injector.get(ColorProvider)
const renderer = injector.get(Renderer)
const viewContainer = injector.get(VIEW_DOCUMENT)
const input = injector.get(Input)
const layout = injector.get(Layout)
const commander = injector.get(Commander)
const selection = injector.get(Selection)
const keyboard = injector.get(Keyboard)

const scrollerEl = structurer.scrollerRef!
const menuEl = useTemplateRef<HTMLElement>('menuEl')
const dropdownEl = useTemplateRef<HTMLElement>('dropdownEl')
const popoverEl = useTemplateRef<HTMLElement>('popoverEl')

const state = reactive({
  height: 500,
  left: 0,
  top: 0,
  show: false
})

const pointer = ref(1)

let subs: Subscription[] = []

onMounted(() => {
  // console.log('shotcut menu mounted')
  // openArrowKey()
  keyboard.addZenCodingInterceptor({
    match: function (content: string): boolean {
      return content === ''
    },
    try: function (key, agent): boolean {
      // console.log(key, agent)
      return key === '/' || isTargetKey(agent)
    },
    action: function (content: string): boolean {
      // console.log('zen coding', content)
      if (selection.isCollapsed) {
        state.height = 500
        state.show = true
        const caretRect = input.caret.rect
        const middleRect = layout.middle.getBoundingClientRect()
        const scrollerRect = scrollerEl.getBoundingClientRect() // 滚动容器高度是固定的，只受窗口高度影响
        // 获取视口的高度
        // const windowHeight = window.innerHeight
        // 到（编辑器）底部的距离 (菜单顶部到滚动区域底部)
        const distanceToBottom = scrollerRect.bottom - (caretRect.top + caretRect.height)
        // 到(编辑器)顶部的距离 （光标顶部到滚动区域顶部）
        const distanceToTop = caretRect.top - scrollerRect.top
        // 菜单高度
        // const menuHeight = state.height

        state.left = caretRect.left - middleRect.left - caretRect.width
        state.top = caretRect.top - middleRect.top + caretRect.height
        // console.log('distanceToTop', distanceToTop, 'distanceToBottom', distanceToBottom, state.height)
        if (distanceToBottom < state.height) {
          // console.log('distanceToBottom < 0', distanceToBottom)
          // console.log('distanceToTop > state.height', distanceToTop, state.height)
          if (distanceToTop > state.height) {
            state.top = caretRect.top - middleRect.top - state.height
          } else {
            if (distanceToTop > distanceToBottom) {
              state.height = distanceToTop - 20
              state.top = caretRect.top - middleRect.top - state.height
            } else {
              state.height = distanceToBottom - 20
            }
          }
        }
        // console.log(caretRect)
        // console.log(menuEl.value?.getBoundingClientRect())
        // const scrollTop = structurer.scrollerRef!.scrollTop
        const arrowEvents = openArrowKey()

        subs = [
          fromEvent(document, 'click', true).subscribe(ev => {
            // console.log('mousedown', ev, ev.target instanceof HTMLElement)
            // TODO bug 不能使用 .contains(menuEl.value) ,因为所有包含 menuEl 的元素都算
            if (ev.target instanceof HTMLElement && !menuEl.value!.contains(ev.target)) {
              state.show = false
              subs.forEach(s => s.unsubscribe())
              arrowEvents.forEach(event => event.remove())
              pointer.value = 1
              menuEl.value!.scrollTop = 0
              secondaryPointer.value = 1
              dropdownState.show = false
              popoverState.show = false
            }
          })
        ]
      }
      return false
    }
  })
})

/** 滚动计算 */
function scrollerCalculate() {
  if (!menuEl.value) return
  const selectEl = menuEl.value.querySelector('.selected')
  if (!selectEl) return
  const menuRect = menuEl.value.getBoundingClientRect()
  const selectRect = selectEl.getBoundingClientRect()
  if (selectRect.bottom > menuRect.bottom - 50) {
    menuEl.value.scrollTo({ top: menuEl.value.scrollTop + 50, behavior: 'smooth' })
    return
  }
  if (selectRect.top < menuRect.top + 50) {
    menuEl.value.scrollTo({ top: menuEl.value.scrollTop - 50, behavior: 'smooth' })
    return
  }
}
watch(
  () => pointer.value,
  () => {
    scrollerCalculate()
  }
)

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
        // console.log('left', pointer.value)
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
          secondaryPointer.value = secondaryPointer.value > 1 ? secondaryPointer.value - 1 : popoverState.optionCount
          return true
        }
        pointer.value = _.clamp(pointer.value - 1, 1, max)
        return true
      }
    }),
    keyboard.addShortcut({
      keymap: { key: 'ArrowRight' },
      action: function (): boolean {
        // console.log('right')
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
        // commander.delete(true) // 向后删除一位，把 / 删除
        // console.log('pointer', pointer.value)
        if (pointer.value <= 12) {
          commonOptions[pointer.value - 1].onClick()
          close()
          return true
        }
        // Dropdown 的情况
        if ([14].includes(pointer.value)) {
          if (dropdownState.show) {
            dropdownOptions.value[secondaryPointer.value - 1].props.onClick()
            close()
            return true
          }
        }
        // Popover 的情况
        if ([15, 16, 17, 20].includes(pointer.value)) {
          if (popoverState.show) {
            popoverOptions.value[secondaryPointer.value - 1].props.onClick()
            close()
            return true
          }
        }
        close()
        return false
      }
    }),
    // 继续输入时退出快捷菜单
    keyboard.addZenCodingInterceptor({
      match(content) {
        return true
      },
      try(key, agent) {
        // console.log(!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(key))
        return !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(key)
      },
      action(content) {
        close()
        return false
      }
    })
  ]
  function close() {
    state.show = false
    keyEvents.forEach(s => s.remove())
    subs.forEach(s => s.unsubscribe())
    pointer.value = 1
    secondaryPointer.value = 1
    dropdownState.show = false
    popoverState.show = false
    menuEl.value!.scrollTop = 0
  }
  return keyEvents
}

const commonOptions = useCommonOptions(injector)

const { secondaryPointer, baseOptions, renderOption, dropdownOptions, popoverOptions, dropdownState, popoverState } = useBaseOptions(injector, menuEl, dropdownEl, popoverEl)

onMounted(() => {})
</script>

<template>
  <div
    ref="menuEl"
    class="shotcut-menu"
    :style="{ left: `${state.left}px`, top: `${state.top}px`, height: `${state.height}px`, visibility: state.show ? 'visible' : 'collapse' }"
  >
    <n-flex>
      <n-flex class="zone">
        <span class="title">常用</span>
        <div class="btns">
          <div v-for="(item, index) in commonOptions" :class="{ btn: 1, selected: index + 1 === pointer }" :key="item.key" @click="item.onClick">
            <TipBtn :tip="item.label">
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
  </div>
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
  </div>
</template>

<style lang="scss" scoped>
.shotcut-menu {
  z-index: 1;
  position: absolute;
  width: 300px;
  background-color: var(--tb-cardColor);
  box-shadow: v-bind('themeVars.boxShadow1');
  border-radius: 4px;
  box-sizing: border-box;
  padding: 24px 24px;
  overflow: hidden;
  overflow-y: auto;
  // cursor: pointer;
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
    .selected {
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
  z-index: 1;
  position: absolute;
  // margin-left: 2px;
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
  z-index: 1;
  position: absolute;
  // margin-left: 2px;
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
  width: 130px;
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
  width: 320px;
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
  width: 500px;
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
