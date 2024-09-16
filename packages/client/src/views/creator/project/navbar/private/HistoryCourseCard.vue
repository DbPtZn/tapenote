<script setup lang="ts">
import useStore from '@/store'
import { useThemeVars } from 'naive-ui'
import dayjs from 'dayjs'
type HistoryCourse = NonNullable<ReturnType<typeof useStore>['projectStore']['data'][0]['historyCourses']>[0]
defineProps<{
  data: HistoryCourse
}>()
const themeVars = useThemeVars()
</script>

<template>
  <n-card class="card" size="small" :bordered="false">
    <template #header>
      <n-text class="title" :depth="2"> {{ data.title }} </n-text>
    </template>
    <template #header-extra>
      <!-- @click.prevent.stop=";" -->
      <!-- <n-button :size="'tiny'" class="icon">
        <a class="button" :href="data.address" target="_blank" rel="noopener noreferrer">访问</a>
      </n-button> -->
    </template>
    <template #default>
      <n-text class="content" :depth="3"> {{ data.abbrev }} </n-text>
    </template>
    <template #footer>
      <div class="footer">
        <n-text :class="['date']" :depth="3">{{ dayjs(data.createAt).format('YY-MM-DD HH:mm:ss') }}</n-text>
        <n-text :class="['foldername']" :depth="3">{{ data.folder.name }}</n-text>
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
  border-top: 1px solid v-bind('themeVars.dividerColor');
  border-bottom: 1px solid #ffffff00 !important;
  transition: unset;
  cursor: pointer;
  .icon {
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
    .icon {
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

.title {
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
  .date {
    font-size: 12px;
  }
  .foldername {
    font-size: 12px;
  }
}

</style>
