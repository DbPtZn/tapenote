<script lang="ts" setup>
import { Keymap } from '@textbus/core'
import UIIcon from './UIIcon.vue'
import { VNodeChild, computed, h, provide, reactive, ref } from 'vue'
import { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'
import { useThemeVars } from 'naive-ui'
import * as UUID  from 'uuid'
import { ToolType } from '..'
provide('useClose', handleClose)
interface DropdownOption {
  type: ToolType
  label: string | (() => VNodeChild)
  render: () => VNodeChild
  onClick?: () => void
  children?: []
}
const props = defineProps<{
  /** 快捷键配置 */
  keymap?: Keymap
  /** 给当前控件添加一组 css class */
  classes?: string[]
  /** 给当前控件添加一组 icon css class */
  iconClasses?: string[]
  /** 当鼠标放在控件上的提示文字 */
  tooltip?: string
  /** 设置控件显示的文字 */
  label?: string
  /** 弹出的内容 */
  options?: DropdownOption[],
  highlight?: () => boolean
  disabled?: () => boolean
}>()
const state = reactive({
  highlight: computed(() => props.highlight?.()),
  disabled: computed(() => props.disabled?.())
})
const themeVars = useThemeVars()
const isShow = ref(false)
const btnRef = ref<HTMLElement>()
  const renderIcon = (icon: string) => {
  return () => {
    return h('span', { class: icon })
  }
}
function handleClose() {
  isShow.value = false
}
const dropdownOptions: DropdownMixedOption[] | undefined = props.options?.map((item) => {
  if(item.type === ToolType.Render) {
    return {
      key: UUID.v4(),
      label: item.label,
      children: [
        {
          key: UUID.v4(),
          type: item.type,
          render: () => h(item.render, {
            onSelectEnd: () => {
              isShow.value = false
            }
          })
        }
      ]
    }
  }
  if (item.type === ToolType.Select) {
    return {
      key: UUID.v4(),
      label: item.label,
      children: item.children?.map((item: any) => {
        return {
          key: UUID.v4(),
          label: item.label,
          // icon: renderIcon(item.classes),
          props: item.props
        }
      })
    }
  }
  if (item.type === ToolType.Dialog) {
    return {
      key: UUID.v4(),
      label: item.label,
      props: {
        onClick: item.onClick
      }
    }
  }
  return {
    key: UUID.v4(),
    label: item.label,
    props: {
      onClick: item.onClick
    }
  }
})
</script>

<template>
  <div class="dropdown-tool">
    <n-dropdown v-model:show="isShow" trigger="click" placement="bottom-start" :to="false" :disabled="state.disabled" :options="dropdownOptions">
      <n-button text class="trigger" :title="tooltip" :disabled="state.disabled">
        <UIIcon class="dropdown-icon" v-if="iconClasses" :icon="iconClasses ? iconClasses[0] : ''" :size="16" />
        <span v-if="label">{{ label }}  </span>
        <UIIcon :class="['dropdown-caret', isShow ? 'active' :'']" icon="textbus-dropdown-caret" />
      </n-button>
    </n-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.trigger {
  min-height: 34px;
}
.dropdown-tool {
  display: flex;
}
.dropdown-icon {
    margin-right: 4px;
  }
.dropdown-caret {
  transition: all 0.15s ease-in-out;
}

:deep(.n-button) {
  --n-text-color-hover: none !important;
  --n-text-color-pressed: none !important;
  --n-text-color-focus: none !important;
}

</style>
..