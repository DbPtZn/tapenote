<script lang="ts" setup>
import { useThemeVars } from 'naive-ui'
import { Icon } from '@iconify/vue'
// import { CloseRound } from '@vicons/material'
const props = defineProps<{
  title: string
  site: string
  code: string
  editionId: string
  date: string
}>()
const emits = defineEmits<{
  selected: []
  close: []
}>()
const themeVars = useThemeVars()
function handleSelected() {
  emits('selected')
}
function handleClose() {
  emits('close')
}
</script>

<template>
  <div class="history-card" @click="handleSelected">
    <!-- <n-avatar class="avatar" :src="imgurl" @error="handleError" /> -->
    <n-flex :style="{ paddingRight: '12px' }" :vertical="true">
      <n-text class="title">{{ title }}</n-text>
      <n-text class="site" :depth="3">{{ site }}</n-text>
      <n-flex :justify="'space-between'">
        <n-text class="code">{{ code }}</n-text>
        <n-text class="date">{{ date }}</n-text>
      </n-flex>
    </n-flex>
    <!-- <n-icon class="close" :component="CloseRound" @click.stop.prevent="handleClose" /> -->
    <Icon class="close" icon="mdi:close" height="24" @click.stop.prevent="handleClose" />
  </div>
</template>

<style lang="scss" scoped>
.history-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px;
  box-sizing: border-box;
  background-color: v-bind('themeVars.cardColor');
  cursor: default;
  border-bottom: 1px solid v-bind('themeVars.dividerColor');
  &:hover {
    opacity: 0.9;
  }
}
.wrapper {
  box-sizing: border-box;
  border-bottom: 1px solid v-bind('themeVars.dividerColor');
}
.title {
  max-width: 250px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.site {
  font-size: 12px;
}
.code {
  font-size: 10px;
}
.date {
  font-size: 10px;
}
.close {
  position: absolute;
  right: 6px;
  color: v-bind('themeVars.iconColor');
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
}
</style>
