<script setup lang="ts">
import useStore from '@/store'
import { useThemeVars } from 'naive-ui'
import dayjs from 'dayjs'
import { Icon } from '@iconify/vue'
import { LibraryEnum } from '@/enums';
type ParentProject = NonNullable<ReturnType<typeof useStore>['projectStore']['data'][0]['parentProjects']>[0]
const props = defineProps<{
  data: ParentProject
}>()
const emits = defineEmits<{
  create: []
  skip: []
  toFolder: []
}>()
const themeVars = useThemeVars()
function handleSkip() {
  emits('skip')
}
function handleToFolder() {
  emits('toFolder')
}
function getIcon(lib: LibraryEnum) {
  switch (lib) {
    case LibraryEnum.NOTE:
      return 'fluent:notebook-24-regular'
    case LibraryEnum.COURSE:
      return 'material-symbols:play-lesson-outline'
    case LibraryEnum.PROCEDURE:
      return 'material-symbols:coffee-maker-outline'
    default:
      return ''
  }
}
</script>

<template>
  <n-card class="card" size="small" :bordered="false">
    <template #header>
      <div class="header-title">
        <Icon :icon="getIcon(data.lib)"  height="18"/>
        <n-text class="title" :depth="2"> {{ data.title }} </n-text>
      </div>
    </template>
    <template #header-extra>
      <!-- @click.prevent.stop=";" -->
      <div class="header-action">
        <n-button :size="'tiny'" class="btn" @click="handleSkip">
          跳转
        </n-button>
      </div>
    </template>
    <template #default>
      <n-text class="content" :depth="3"> {{ data.abbrev }} </n-text>
    </template>
    <template #footer>
      <div class="footer">
        <n-text :class="['date']" :depth="3">{{ dayjs(data.createAt).format('YY-MM-DD HH:mm:ss') }}</n-text>
        <n-text :class="['foldername']" :depth="3" @click="handleToFolder">{{ data.folder.name }}</n-text>
      </div>
    </template>
  </n-card>
</template>

<style scoped lang="scss">
.card {
  display: flex;
  flex-direction: column;
  margin-top: 1px;
  user-select: none;
  background-color: unset;
  border-radius: 0;
  border-top: 1px solid #ffffff00 !important;
  border-bottom: 1px solid #ffffff00 !important;
  transition: unset;
  // cursor: pointer;
  .btn {
    cursor: pointer;
    transition: opacity 0.1s ease-in-out;
    opacity: 0;
  }
  .button {
    color: v-bind('themeVars.textColor2');
  }
  &:hover {
    border-radius: v-bind('themeVars.borderRadius');
    background-color: v-bind('themeVars.cardColor');
    border-top: 1px solid #ffffff00;
    .btn {
      opacity: 1;
    }

    &:last-child {
      border-bottom: 1px solid #ffffff00;
    }
  }
  &:first-child {
    border-top: 1px solid #bd272700;
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
  display: flex;
  flex-direction: row;
  align-items: center;
  .title {
  margin-left: 3px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
}
.header-action {
  .btn {
    margin-left: 2px;
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
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .date {
    font-size: 12px;
  }
  .foldername {
    font-size: 12px;
    cursor: pointer;
    &:hover {
      color: v-bind('themeVars.textColor2');
    }
  }
}

</style>
