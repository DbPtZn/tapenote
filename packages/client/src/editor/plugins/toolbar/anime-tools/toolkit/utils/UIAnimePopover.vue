<script lang="ts" setup>
import { Injector, Keyboard, Keymap } from '@textbus/core'
import { AnimeProvider, UIIcon } from '../../../../..'
import { computed, inject, reactive, ref } from 'vue'
import { MaterialTypeEnum } from '../../../../..'
type AnimeOption = ReturnType<AnimeProvider['getOptions']>[0]
const injector = inject<Injector>('injector')
const keyboard = injector?.get(Keyboard)
const props = defineProps<{
  iconClasses?: string[]
  keymap?: Keymap
  /** 当鼠标放在控件上的提示文字 */
  tooltip?: string;
  options: AnimeOption[]
  onSelected: (args: { value: string, label: string }) => void
  currentValue: () => any
  highlight: () => boolean
  disabled: () => boolean
}>()
const state = reactive({
  currentValue: computed(() => {
    if (props.currentValue()) return props.currentValue().dataEffect || ''
    return ''
  }),
  // highlight: computed(() => props.highlight()),
  disabled: computed(() => props.disabled())
})
const isShow = ref(false)
const isLock = ref(false)
const btnRef = ref<HTMLElement>()
// const currentVal = computed(() => props.currentValue)
const currentOption = ref<AnimeOption>(props.options[0])
function handleSelect(option: AnimeOption) {
  console.log(option)
  currentOption.value = option
  props.onSelected({ value: option.value, label: option.label })
  if (isLock.value) return
  isShow.value = false
}
/** 左侧按钮点击事件 */
function handleLeftBtnClick() {
  props.onSelected({ value: currentOption.value.value, label: currentOption.value.label })
}
/** 外部点击事件 */
function handleClickoutside(ev: MouseEvent) {
  if (btnRef.value === ev.target || isLock.value) return
  isShow.value = false
}
/** 配置快捷键： 应用当前动画效果 */
if (props.keymap) {
  keyboard?.addShortcut({
    keymap: props.keymap,
    action: () => {
      if (!state.disabled && currentOption.value) {
        props.onSelected(currentOption.value)
      }
    }
  })
}
</script>

<template>
  <div class="segment-popover-tool">
    <!-- :to="false" 弹窗在 container 内会导致点击弹窗时触发 inline-toolbar 行内工具条的选区变化导致工具条立即消失 -->
    <!-- 在 inline-toolbar 中通过对 container 容器监听事件事务进行 5ms 的延迟发射，确保选择选项优先于容器点击事件 -->
    <!-- 该问题暂时解决，在此保留问题记录 -->
    <n-popover trigger="click" placement="bottom-start" :to="false" :show-arrow="false" :show="isShow" :disabled="state.disabled" @clickoutside="handleClickoutside">
      <template #trigger>
        <div :class="['trigger', state.disabled ? 'disabled' : '']" :title="tooltip">
          <!-- 按钮 -->
          <div class="selector-left-btn" @click="handleLeftBtnClick">
            <span>{{ currentOption.label }}</span>
          </div>
          <!-- 箭头 -->
          <div ref="btnRef" class="selector-right-btn" @click="isShow = !isShow">
            <UIIcon :class="['selector-caret', isShow ? 'active' : '']" icon="textbus-dropdown-caret" />
          </div>
        </div>
      </template>
      <!-- 内容 -->
      <div class="content">
        <div class="list">
          <div 
            v-for="option in options"
            :key="option.value"
            :class="[
              'option', 
              state.currentValue === option.value ? 'using' : '',
            ]"
            @click="handleSelect(option)"
            @mouseenter.self="option.applyEffect(($event.target as HTMLElement).firstChild as HTMLElement)"
          >
            <div class="option-label">
              {{ option.label }}
            </div>
          </div>
        </div>
        <div class="lock" @click="isLock =!isLock">
          <UIIcon :icon="isLock ? `${MaterialTypeEnum.FILLED}lock` : `${MaterialTypeEnum.FILLED}lock_open`" />
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
.segment-popover-tool {
  display: flex;
  align-items: center;
  justify-content: center;
}
.trigger {
  display: flex;
  flex-direction: row;
  color: var(--tb-textColor1);
  min-height: 34px;
  box-sizing: border-box;
  &:hover {
    .selector-left-btn {
      background-color: var(--tb-buttonColor2);
    }
    .selector-right-btn {
      background-color: var(--tb-buttonColor2);
    }
  }
  .selector-left-btn {
    display: flex;
    align-items: center;
    user-select: none;
    padding: 2px 4px;
    box-sizing: border-box;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    word-break: keep-all;
    cursor: pointer;
    &:hover {
      background-color: var(--tb-buttonColor2Hover)
    }
  }
  .selector-right-btn {
    display: flex;
    align-items: center;
    // height: 100%;
    user-select: none;
    padding: 2px 4px;
    box-sizing: border-box;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    cursor: pointer;
    &:hover {
      background-color: var(--tb-buttonColor2Hover)
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
.content {
  width: 345px;
  .list {
    box-sizing: border-box;
    padding: 6px;
  }
  .option {
    display: inline-block;
    margin: 3px;
    padding: 3px;
    border-radius: 3px 3px;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
    border: 1px solid #e8e8e8ad;
    cursor: pointer;
    transition: transform 0.1s;
    &:hover {
      transform: scale(1.1);
    }
  }
  .using {
    background-color: var(--tb-buttonColor2Hover);
  }
  .lock {
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 8px;
    cursor: pointer;
  }
}
</style>
