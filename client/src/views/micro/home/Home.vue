<script lang="ts" setup>
import { LibraryEnum, RoutePathEnum } from '@/enums';
import useStore from '@/store'
import { CoffeeMaker, Notebook, PlayLesson } from '@/components'
import { DropdownOption, useMessage, useThemeVars } from 'naive-ui'
import { StickyNote2Outlined } from '@vicons/material'
import { computed, onMounted, ref } from 'vue'
import Header from './Header.vue'
import dayjs from 'dayjs'
import router from '@/router';
type RecentFile = typeof recentStore.data[0]
const { recentStore } = useStore()
const themeVars = useThemeVars()
const message = useMessage()
const scrollerRef = ref<HTMLElement>()
const data = computed(() => recentStore.get)
onMounted(() => {
  recentStore.fetchAndSet({
    lib: LibraryEnum.NOTE,
    skip: 0,
    take: 10
  }).catch(err => {
    console.log(err)
    message.error('获取最近项目失败')
  })
})

/** 滚动加载 */
function handleScroll(ev) {
  const scrollerRef = ev.target as HTMLElement
  if (scrollerRef.clientHeight + scrollerRef.scrollTop >= scrollerRef.scrollHeight) {
    recentStore.fetchAndSet({
      skip: data.value.length,
      take: 8,
      lib: recentStore.currentLib
    })
  }
}

function getCurrentLibIcon(lib: LibraryEnum) {
  switch (lib) {
    case LibraryEnum.NOTE:
      return Notebook
    case LibraryEnum.COURSE:
      return PlayLesson
    case LibraryEnum.PROCEDURE:
      return CoffeeMaker
    default:
      return StickyNote2Outlined 
  }
}

function handleClick(item: RecentFile) {
  router.push(`${RoutePathEnum.PROJECT}/${item.id}`)
}

</script>

<template>
  <Header />
  <div ref="scrollerRef" class="home" @scroll="handleScroll">
    <div class="list">
      <div class="item" v-for="item in data" :key="item.id" @click="handleClick(item)">
        <div class="wrapper">
          <div class="title">
            <n-icon class="title-icon" :component="getCurrentLibIcon(item.lib)" :size="18"/>
            <span style="margin-left: 6px;margin-top: 1px;"> {{ item.title }}</span>
          </div>
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
  display: flex;
  align-items: center;
  .title-icon {
    color:#7bebff;
  }
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
