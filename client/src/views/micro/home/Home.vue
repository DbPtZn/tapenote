<script lang="ts" setup>
import { LibraryEnum } from '@/enums';
import useStore from '@/store'
import { DropdownOption, useThemeVars } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import Header from './Header.vue'
import dayjs from 'dayjs'
const { folderTreeStore, folderStore } = useStore()
const themeVars = useThemeVars()
const scrollerRef = ref<HTMLElement>()
onMounted(() => {
  folderStore.fetchRecentlyAndSet({
    lib: LibraryEnum.NOTE,
    skip: 0,
    take: 20
  })
})
const data = computed(() => folderStore.getSubfilesSortByCreateAt)


</script>

<template>
  <Header />
  <div ref="scrollerRef" class="home">
    <div class="list">
      <div class="item" v-for="item in data" :key="item.id">
        <div class="wrapper">
          <div class="title">{{ item.title }}</div>
          <div class="content">{{ item.abbrev }}</div>
          <div class="meta">
            <div class="createAt">{{ dayjs(item.updateAt).format('YY-MM-DD HH:mm:ss') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  height: 100%;
  width: 100%;
  overflow-y: auto;
}
.item {
  padding: 5px 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  .wrapper {
    width: 100%;
    height: 100%;
    padding: 6px 12px;
    box-sizing: border-box;
    border-radius: 4px;
    background-color: v-bind('themeVars.cardColor');
    display: flex;
    flex-direction: column;
  }
}
.title {
  font-size: 14px;
  color: v-bind('themeVars.textColor1');
}
.content {
  flex: 1;
  font-size: 12px;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: v-bind('themeVars.textColor2');
  opacity: 0.7;
}
.meta {
  margin-top: 4px;
  font-size: 10px;
  color: v-bind('themeVars.textColor3');
  opacity: 0.5;
}
</style>
