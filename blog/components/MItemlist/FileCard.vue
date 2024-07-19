<script lang="ts" setup>
import { NButton, useThemeVars } from 'naive-ui'
import { MoreVertRound, PublicFilled, BookOutlined, PlayLessonOutlined } from '@vicons/material'
const themeVars = useThemeVars()
const props = defineProps<{
  id: string,
  type?: 'note' | 'course' | 'other'
  /** title */
  title: string,
  /** 缩略 */
  abbrev: string,
  /** 最近更新时间 */
  date: string | number,
  isPublish: boolean,
  /** 卡片聚焦状态  */
  active: boolean
}>()
const emits = defineEmits<{
  onMoreAction: [ ev: MouseEvent ]
}>()
function handleMoreAction(ev) {
  emits('onMoreAction', ev)
}
</script>

<template>
  <!-- 注意：这里不可以再裹一层 div，会破坏 css 的选择器逻辑 -->
  <n-card :class="['file-card', props.active && 'active']" size="small" :bordered="false">
    <template #header>
      <div class="header">
        <n-icon :style="{ marginRight: '4px' }" :component="type === 'note' ? BookOutlined : PlayLessonOutlined" size="22" />
        <n-text class="header-title" :depth="2"> {{ title }} </n-text>
      </div>
    </template>
    <template #header-extra>
      <n-button text class="header-icon" @click.prevent.stop="handleMoreAction">
        <n-icon :component="MoreVertRound" size="22" />
      </n-button>
    </template>
    <template #default>
      <n-text class="content" :depth="3"> {{ abbrev }} </n-text>
    </template>
    <template #footer>
      <div class="footer">
        <n-text class="footer" :depth="3">{{ date }}</n-text>
        <div class="publish">
          <n-icon v-if="isPublish" :component="PublicFilled" size="18" />
          <!-- <n-text class="footer" :depth="3">{{ isPublish ? '已发布' : '' }}</n-text> -->
        </div>
      </div>
    </template>
  </n-card>
</template>

<style lang="scss" scoped>
.active {
  background-color: v-bind('themeVars.buttonColor2') !important;
  border-radius: v-bind('themeVars.borderRadius') !important;
  border-top: 1px solid #ffffff00 !important;
  border-bottom: 1px solid #ffffff00 !important;
}
.active + .file-card {
  border-top: 1px solid #ffffff00;
}
.file-card {
  margin-top: 1px;
  cursor: default;
  user-select: none;
  background-color: unset;
  border-radius: 0;
  border-top: 1px solid v-bind('themeVars.dividerColor');
  border-bottom: 1px solid #ffffff00 !important;
  transition: unset;
  .header-icon {
    cursor: pointer;
    transition: opacity 0.1s ease-in-out;
    opacity: 0;
  }
  &:hover {
    border-radius: v-bind('themeVars.borderRadius');
    background-color: v-bind('themeVars.cardColor');
    border-top: 1px solid #ffffff00;
    .header-icon {
      opacity: 1;
    }
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
  &:hover + .file-card {
    border-top: 1px solid #ffffff00;
  }
  &:hover + div {
    border-top: 1px solid #ffffff00;
  }
}

.header {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.header-title {
  margin-right: 6px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 12px;
  .publish {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 6px;
    opacity: 0.8;
  }
}
</style>
