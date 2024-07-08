<script lang="ts" setup>
import {  useThemeVars } from 'naive-ui'
import { defineComponent, h, ref } from 'vue'
import { DragIndicatorFilled, MenuBookRound, BookRound, BookOutlined } from '@vicons/material'
import type useStore from '~/store'
// import { Icon } from '#components'
type Column = ReturnType<typeof useStore>['columnListStore']['data'][0]
defineProps<{
  item: Column
}>()
const themeVar = useThemeVars()
</script>
<template>
  <n-button class="column-item" quaternary>
    <div class="prefix move">
      <n-icon :component="DragIndicatorFilled" :size="24" />
    </div>
    <div class="icon">
      <n-icon :component="item.isPublish ? MenuBookRound : BookOutlined" :size="24" />
    </div>
    <div class="label">
      <div class="txt">{{ item.name }}</div>
    </div>
    <div class="menu">
      <n-button text type="tertiary" @click.stop.prevent=";">
        <Icon class="menu-icon" name="ic:round-more-horiz" size="24px" />
      </n-button>
    </div>
  </n-button>
</template>

<style lang="scss" scoped>
:deep(.n-button__content) {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.column-item {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 38px;
  align-items: unset;
  justify-content: unset;
  padding: 0;
  box-sizing: border-box;

  .prefix {
    height: 100%;
    display: flex;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    color: v-bind('themeVar.textColor3');
    &:hover {
      color: v-bind("themeVar.textColor1");
    }
  }
  .icon {
    height: 100%;
    display: flex;
    align-items: center;
  }
  .label {
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: 0 6px;
    .txt {
      margin-top: 2px;
      line-height: 38px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .menu {
    height: 100%;
    justify-self: end;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    color: v-bind('themeVar.textColor3');
    .menu-icon {
      color: v-bind("themeVar.textColor3");
      &:hover {
        color: v-bind("themeVar.textColor1");
      }
    }
  }
  &:hover {
    .prefix {
      opacity: 1;
    }
    .menu {
      opacity: 1;
    }
  }
}
</style>
