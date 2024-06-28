<script lang="ts" setup>
import { Injector, Keyboard, Keymap } from '@textbus/core'
import UIIcon from './UIIcon.vue'
import { Ref, computed, inject, reactive, ref } from 'vue'
import { useThemeVars } from 'naive-ui'
const injector = inject<Injector>('injector')!
const keyboard = injector?.get(Keyboard)
const themeVars = useThemeVars()
const props = defineProps<{
  iconClasses?: string[]
  keymap?: Keymap
  /** 当鼠标放在控件上的提示文字 */
  tooltip?: string
  options: string[]
  onSelected: (value: any) => void
  currentValue: Ref<string>
  highlight?: () => boolean
  disabled?: () => boolean
}>()
const state = reactive({
  highlight: computed(() => props.highlight?.()),
  disabled: computed(() => props.disabled?.())
})
const isShow = ref(false)
const btnRef = ref<HTMLElement>()
const currentColor = ref<string>(props.options[0])
function handleSelect(value: string) {
  isShow.value = false
  currentColor.value = value
  props.onSelected(value)
}
function handleLeftBtnClick() {
  props.onSelected(currentColor.value)
}
function handleClickoutside(ev: MouseEvent) {
  if (btnRef.value === ev.target) {
    return
  }
  isShow.value = false
}

if (props.keymap) {
  keyboard?.addShortcut({
    keymap: props.keymap,
    action: () => {
      if (!state.disabled && currentColor.value) {
        props.onSelected(currentColor.value)
      }
    }
  })
}
// onMounted(() => {
//   console.log('onMounted')
// })
// onUnmounted(() => {
//   console.log('onUnmounted')
// })
</script>

<template>
  <div class="segment-dropdown-tool">
    <n-popover trigger="click" placement="bottom-start" :to="false" :show-arrow="false" :show="isShow" :disabled="state.disabled" @clickoutside="handleClickoutside">
      <template #trigger>
        <div :class="['trigger', state.disabled ? 'disabled' : '']" :title="tooltip">
          <div class="selector-left-btn" :data-color="currentColor" :style="{ color: currentColor }" @click="handleLeftBtnClick">
            <UIIcon class="selector-icon" v-if="iconClasses" :icon="iconClasses ? iconClasses[0] : ''" :size="16" />
          </div>
          <div ref="btnRef" class="selector-right-btn" @click="isShow = !isShow">
            <UIIcon :class="['selector-caret', isShow ? 'active' : '']" icon="textbus-dropdown-caret" />
          </div>
        </div>
      </template>
      <div class="wrapper">
        <n-button class="default-color" size="small" block secondary @click="handleSelect(options[0])" :disabled="state.disabled">
          <div class="clear-icon"></div>
          <!-- <UIIcon class="clear-icon" :icon="`${MaterialTypeEnum.FILLED}clear`" /> -->
          默认颜色
        </n-button>
        <div class="list">
          <div
            v-for="item in options"
            :key="item"
            :data-bgcolor="item"
            :class="['color-block', currentValue.value === item ? 'using' : '']"
            :style="{ backgroundColor: item }"
            @click="handleSelect(item)"
          ></div>
        </div>
      </div>
    </n-popover>
  </div>
</template>

<style lang="scss" scoped>

.disabled {
  opacity: var(--tb-opacityDisabled)!important;
  cursor: not-allowed!important;
}
.trigger {
  display: flex;
  flex-direction: row;
  min-height: 34px;
  box-sizing: border-box;
  // padding: 0 2px;
  &:hover {
    .selector-left-btn {
      background-color: v-bind('themeVars.buttonColor2');
    }
    .selector-right-btn {
      background-color: v-bind('themeVars.buttonColor2');
    }
  }
  .selector-left-btn {
    display: flex;
    align-items: center;
    user-select: none;
    cursor: pointer;
    padding: 2px 4px;
    box-sizing: border-box;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    &:hover {
      background-color: v-bind('themeVars.buttonColor2Hover');
    }
  }
  .selector-right-btn {
    display: flex;
    align-items: center;
    user-select: none;
    cursor: pointer;
    padding: 2px;
    box-sizing: border-box;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    &:hover {
      background-color: v-bind('themeVars.buttonColor2Hover');
    }
  }
  .selector-caret {
    pointer-events: none;
    transition: all 0.15s ease-in-out;
  }
  .active {
    transform: rotate(180deg);
  }
}
.wrapper {
  width: 215px;
  // height: 225px;
  .default-color {
    display: flex;
    justify-content: start;
    box-sizing: border-box;
    padding: 3px;
    margin: 0 0 6px 0;
    .clear-icon {
      margin-left: 6px;
      margin-right: 6px;
      height: 14px;
      width: 14px;
      border: 1px solid #e8e8e8ad;
      &:after {
        content: '';
        position: absolute;
        top: 13px;
        left: 7px;
        width: 20px;
        height: 1px;
        // background-color: currentColor;
        background-color: #e8e8e8ad;
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
      }
    }
  }
  .list {
    box-sizing: border-box;
    padding: 6px;
  }
  .color-block {
    display: inline-block;
    height: 17px;
    width: 17px;
    margin: 3px;
    border-radius: 3px 3px;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
    border: 1px solid #e8e8e8ad;
    cursor: pointer;
    transition: transform 0.1s;
    &:hover {
      transform: scale(1.1);
    }
    /** popover 弹出的内容接收不到 themeVars */
    // border: 1px solid v-bind('themeVars.borderColor');
    // border-color: v-bind('themeVars.cardColor');
  }
  .using {
    border: 1px solid #000000;
  }
}
.segment-dropdown-tool {
  display: flex;
  align-items: center;
  justify-content: center;
  // width: 42px;
  // box-sizing: border-box;
  // padding: 0 4px;
  // background-color: v-bind('themeVars.buttonColor2Hover');
  // border: 1px solid v-bind('themeVars.borderColor');
  :deep(.n-button) {
    --n-text-color-hover: none !important;
    --n-text-color-pressed: none !important;
    --n-text-color-focus: none !important;
  }
}
// .btn {
//   display: flex;
//   align-items: center;
//   height: 100%;
//   user-select: none;
//   cursor: pointer;
// }
</style>
