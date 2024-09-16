<script lang="ts" setup>
import { NButton, useThemeVars } from 'naive-ui'
import { MoreVertRound, CloseRound } from '@vicons/material'
const themeVars = useThemeVars()
const props = defineProps<{
  id: string
  title: string
  abbrev: string
  date: string | number
  isRecently?: boolean
  showFolderName?: boolean
  folderId?: string
  folderName?: string
  active?: boolean
}>()
const emits = defineEmits<{
  onRemove: [ ev: MouseEvent ]
  // toFolder: [ folderId: string ]
}>()
function handleRemoveCache(ev) {
  emits('onRemove', ev)
}
</script>

<template>
  <!-- 注意：这里不可以再裹一层 div，会破坏 css 的选择器逻辑 -->
  <n-card :class="['cache-card', props.active && 'active']" size="small" :bordered="false">
    <template #header>
      <n-text class="header-title" :depth="2"> {{ title }} </n-text>
    </template>
    <template #header-extra>
      <n-button text class="header-icon" @click.prevent.stop="handleRemoveCache">
        <NIcon :component="CloseRound" size="18" />
      </n-button>
    </template>
    <template #default>
      <n-text class="content" :depth="3"> {{ abbrev }} </n-text>
    </template>
    <template #footer>
      <n-text 
        :class="['footer', showFolderName || (active && folderName) ? 'folder' : '']" 
        :depth="3"
      >
        {{ showFolderName || (active && folderName) ? folderName : date }}
      </n-text>
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
.active + .cache-card {
  border-top: 1px solid #ffffff00;
}
.folder {
  cursor: pointer;
  &:hover {
    color: v-bind('themeVars.textColor2');
  }
}
.cache-card {
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
    background-color: v-bind('themeVars.buttonColor2Hover');
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
  &:hover + .cache-card {
    border-top: 1px solid #ffffff00;
  }
  &:hover + div {
    border-top: 1px solid #ffffff00;
  }
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
  font-size: 12px;
}
</style>
