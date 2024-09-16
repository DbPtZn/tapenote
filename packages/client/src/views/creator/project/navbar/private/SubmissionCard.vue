<script setup lang="ts">
import useStore from '@/store'
import { useThemeVars } from 'naive-ui'
// import { MoreVertRound } from '@vicons/material'
type SubmissionHistory = ReturnType<typeof useStore>['projectStore']['data'][0]['submissionHistory'][0]
defineProps<{
  data: SubmissionHistory
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
      <n-button :size="'tiny'" class="icon">
        <!-- <NIcon :component="MoreVertRound" size="22" /> -->
        <a class="button" :href="data.address" target="_blank" rel="noopener noreferrer">访问</a>
      </n-button>
    </template>
    <template #default>
      <n-text class="content" :depth="3"> {{ data.address }} </n-text>
    </template>
    <template #footer>
      <n-text :class="['footer']" :depth="3">{{ data.date }}</n-text>
    </template>
  </n-card>
</template>

<style scoped lang="scss">
.card {
  display: flex;
  flex-direction: column;
  margin-top: 1px;
  cursor: default;
  user-select: none;
  background-color: unset;
  border-radius: 0;
  border-top: 1px solid v-bind('themeVars.dividerColor');
  border-bottom: 1px solid #ffffff00 !important;
  transition: unset;
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
  font-size: 12px;
}
</style>
