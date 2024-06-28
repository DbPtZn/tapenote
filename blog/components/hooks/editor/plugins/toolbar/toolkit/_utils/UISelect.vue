<script lang="ts" setup>
import UIIcon from './UIIcon.vue'
import { Ref, computed, h, reactive, ref, watch } from 'vue'
import { SelectGroupOption, SelectMixedOption, SelectOption } from 'naive-ui/es/select/src/interface'
import { NText, useThemeVars } from 'naive-ui'
import { MaterialTypeEnum } from './MaterialTypeEnum'
import { Keymap } from '@textbus/core'
interface SelectOptionConfigExpand {
  value: string | number
  default?: boolean
  /** 给当前选项添加一组 css class 类 */
  classes?: string[]
  /** 给当前选项添加 icon css class 类 */
  iconClasses?: string[]
  /** 给选项添加前缀 */
  prefix?: string // 前缀
  /** 给选项添加后缀 */
  suffix?: string // 后缀

  keymap?: Keymap
}
export type SelectOptionConfig = SelectMixedOption & SelectOptionConfigExpand
const themeVars = useThemeVars()
const props = defineProps<{
  /** 当前值 */
  currentValue?: Ref<string | number | null>
  /** 给 Select 控件添加一组 css class */
  classes?: string[]
  /** 给 select 控件添加一组 icon css class 类 */
  iconClasses?: string[]
  /** 当鼠标放在控件上的提示文字 */
  tooltip?: string;
  /** 设置当前 Selector 是否根据内容扩展宽度 */
  mini?: boolean
  /** 选项配置 */
  options: SelectOptionConfig[]
  /** 选择完成事件回调 */
  onSelected: (value: any) => void
  highlight?: () => boolean
  disabled?: () => boolean
}>()
const emits = defineEmits<{
  select: [string | number]
}>()
const state = reactive({
  highlight: computed(() => props.highlight?.()),
  disabled: computed(() => props.disabled?.()),
})
/** 侦听当前值变化 */
watch(() => props.currentValue?.value, () => {
  val.value = props.currentValue?.value
})
const val = ref(props.currentValue?.value)
const isShow = ref(false)
function handleSelect() {
  props.onSelected && props.onSelected(val.value)
}
function renderLabel(option: SelectOption | SelectGroupOption | SelectOptionConfig) {
  return h('div', { style: { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } }, [
    h('div', {style: { display: 'flex', width: '100%', flexDirection: 'row', alignItems: 'center' } }, [
      option.prefix ? h(
        UIIcon,
        {
          icon: `${MaterialTypeEnum.FILLED}${option.prefix}`,
          style: {
            display: 'flex',
            alignItems: 'center',
            verticalAlign: '-0.15em',
            marginRight: '4px'
          },
          size: 16
        }
      ) : null,
      h('div', { class: option.classes, style: { minWidth: '50px', } }, { default: () => option.label }),
    ]),
    option.suffix ? h(NText, { depth: 3 }, { default: () => option.suffix }) : null,
  ])
}
</script>

<template>
  <div class="select-tool">
    <n-popselect
      :class="[classes]"
      trigger="click"
      v-model:show="isShow"
      v-model:value="val"
      :options="options"
      :consistent-menu-width="false"
      @update:value="handleSelect"
      :render-label="renderLabel"
      placement="bottom-start"
    >
      <n-button :class="['selector', mini ? '' : 'mini']" text :title="tooltip" :disabled="state.disabled">
        <UIIcon class="selector-icon" v-if="iconClasses" :icon="iconClasses ? iconClasses[0] : ''" :size="16" />
        <span class="selector-label">{{ options[options.findIndex(item => item.value === val)].label }}</span>
        <UIIcon :class="['selector-caret', isShow ? 'active' :'']" icon="textbus-dropdown-caret" />
      </n-button>
    </n-popselect>
  </div>
</template>

<style lang="scss" scoped>
.select-tool {
  display: flex;
  min-height: 34px;
}

.mini {
  :deep(.n-button__content) {
    width: 80px;
    max-width: 80px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
.selector {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 3px 0 6px;
  border-radius: 3px;
  &:hover {
    background-color: v-bind('themeVars.buttonColor2Hover');
  }

  .selector-icon {
    margin-right: 4px;
  }
  
  .selector-caret {
    transition: all 0.15s ease-in-out;
  }
  .active {
    transform: rotate(180deg);
  }

  :deep(.n-button) {
    --n-text-color-hover: none !important;
    --n-text-color-pressed: none !important;
    --n-text-color-focus: none !important;
  }

}
// :deep(.n-select > .n-base-selection) {
//   --n-border: none!important;
//   --n-border-active: none!important;
//   --n-border-focus: none!important;
//   --n-border-hover: none!important;
//   --n-border-radius: 0!important;
//   --n-box-shadow-active: none!important;
//   --n-box-shadow-focus: none!important;
//   user-select: none;
//   .n-base-selection-label {
//     background-color: unset;
//     &:hover {
//       background-color: v-bind('themeVars.buttonColor2Hover');
//     }
//   }
// }
// .active {
//   color: white;
//   background-color: red;
// }
</style>
