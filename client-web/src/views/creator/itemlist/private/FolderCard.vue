<script lang="ts" setup>
import { NButton, useThemeVars } from 'naive-ui'
import { PropType, computed, ref } from 'vue'
import { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface';
import { FolderOutlined, MoreVertFilled } from '@vicons/material'
const themeVars = useThemeVars()
const props = defineProps({
  /** 文件夹 id */
  id: {
    type: String,
    require: false
  },
  /** 文件夹 title */
  title: {
    type: String,
    default: ''
  },
  /** 文件夹创建时间 */
  date: {
    type: [String, Number],
    default: ''
  },
  // dropdownOptions: {
  //   type: Array as PropType<DropdownMixedOption[]>,
  //   require: true,
  //   default: () => []
  // },
  /** 卡片聚焦状态  */
  active: Boolean
})
const emits = defineEmits<{
  onMoreAction: [ ev: MouseEvent ],
}>()
function handleMoreAction(ev) {
  emits('onMoreAction', ev)
}
const elementRef = ref<HTMLElement | null>(null)
</script>

<template>
  <!-- 注意：这里不可以再裹一层 div，会破坏 css 的选择器逻辑 -->
  <n-card class="folder-card" ref="elementRef" size="small" :bordered="false">
    <template #header>
      <div class="header-title">
        <n-icon :style="{ marginRight: '6px' }" :component="FolderOutlined" :size="18" />
        <n-text class="header-title-label" :depth="2">{{ title }}</n-text>
      </div>
    </template>
    <template #header-extra>
      <!-- <n-dropdown :options="dropdownOptions" :trigger="'click'" :show-arrow="true"> -->
        <n-button text class="header-icon" @click.prevent.stop="handleMoreAction">
          <!-- <DpzIcon :icon="`${MaterialTypeEnum.FILLED}more_vert`" size="18" /> -->
          <n-icon :component="MoreVertFilled" :size="24" />
        </n-button>
      <!-- </n-dropdown> -->
    </template>
    <template #footer>
      <n-text class="footer" :depth="3">{{ date }}</n-text> 
    </template>
  </n-card>
</template>

<style lang="scss" scoped>
.drag-enter {
  background-color: v-bind('themeVars.actionColor')!important;
}
.folder-card {
  margin-top: 1px;
  box-sizing: border-box;
  cursor: default;
  user-select: none;
  background-color: unset;
  border-radius: 0;
  border-top: 1px solid v-bind('themeVars.dividerColor');
  transition: unset;
  .header-icon {
    cursor: pointer;
    transition: opacity 0.1s ease-in-out;
    opacity: 0;
  }
  &:hover {
    border-radius: v-bind('themeVars.borderRadius');
    .header-icon {
      opacity: 1;
    }
    background-color: v-bind('themeVars.cardColor');
    border-top: 1px solid #ffffff00;
    &:last-child {
      border-bottom: 1px solid #ffffff00;
    }
  }
  &:first-child {
    border-top: 1px solid #ffffff00;
  }
  &:last-child {
    border-bottom: 1px solid v-bind('themeVars.dividerColor');
  }
  &:hover + .folder-card {
    border-top: 1px solid #ffffff00;
  }
  &:hover + div {
    border-top: 1px solid #ffffff00;
  }
}
.header-title {
  margin-right: 6px;
  display: flex;
  align-items: center;

  .header-title-label {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.content {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 12px;
}

.footer {
  font-size: 12px;
}
</style>
