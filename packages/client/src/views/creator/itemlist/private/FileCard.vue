<script lang="ts" setup>
import { NButton, useThemeVars } from 'naive-ui'
import { Icon } from '@iconify/vue'
// import { MoreVertRound } from '@vicons/material'

import { useI18n } from 'vue-i18n'
const themeVars = useThemeVars()
const { t } = useI18n()
const props = defineProps({
  /** 笔记 id */
  id: {
    type: String,
    require: false
  },
  /** 笔记 title */
  title: {
    type: String,
    default: ''
  },
  /** 笔记缩略 */
  abbrev: {
    type: String,
    default: ''
  },
  /** 笔记最近更新时间 */
  date: {
    type: [String, Number],
    default: ''
  },
  isRecently: {
    type: Boolean,
    default: false
  },
  showFolderName: {
    type: Boolean,
    default: false
  },
  folderId: {
    type: String,
    require: false
  },
  folderName: {
    type: String,
    require: false
  },
  /** 卡片聚焦状态  */
  active: {
    type: Boolean,
    defalut: false
  }
})
const emits = defineEmits<{
  onMoreAction: [ ev: MouseEvent ]
  toFolder: [ folderId: string ]
}>()
function handleMoreAction(ev) {
  emits('onMoreAction', ev)
}
function getFolderName(name: string) {
  switch (name) {
    case 'NOTE ROOT DIR':
      return t('itemlist.note_root_dir')
    case 'COURSE ROOT DIR':
      return t('itemlist.course_root_dir')
    case 'PROCEDURE ROOT DIR':
      return t('itemlist.procedure_root_dir')
    default:
      return name
  }
}
</script>

<template>
  <!-- 注意：这里不可以再裹一层 div，会破坏 css 的选择器逻辑 -->
  <n-card :class="['file-card', props.active && 'active']" size="small" :bordered="false">
    <template #header>
      <n-text class="header-title" :depth="2"> {{ title }} </n-text>
    </template>
    <template #header-extra>
      <n-button text class="header-icon" @click.prevent.stop="handleMoreAction">
        <!-- <NIcon :component="MoreVertRound" size="22" /> -->
        <Icon icon="mdi:dots-vertical" height="22" />
      </n-button>
    </template>
    <template #default>
      <n-text class="content" :depth="3"> {{ abbrev }} </n-text>
    </template>
    <template #footer>
      <n-text 
        :class="['footer', showFolderName || (active && folderName) ? 'folder' : '']" 
        :depth="3"
        @click="emits('toFolder', folderId || '')"
      >
        {{ showFolderName || (active && folderName) ? getFolderName(folderName || '') : date }}
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
.active + .file-card {
  border-top: 1px solid #ffffff00;
}
.folder {
  cursor: pointer;
  &:hover {
    color: v-bind('themeVars.textColor2');
  }
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
