<script lang="ts" setup>
import useStore from '@/store'
import { useThemeVars } from 'naive-ui'
import { computed, onMounted } from 'vue'
import { FolderFilled, StickyNote2Outlined, AutoAwesomeMotionOutlined } from '@vicons/material'
import Header from './Header.vue'
import router from '@/router'
import dayjs from 'dayjs'
import { CoffeeMaker, Notebook, PlayLesson } from '@/components'
import { LibraryEnum, RoutePathEnum } from '@/enums'
import { Footer } from '../layout'
type Subfile = NonNullable<typeof folderStore.subfiles>[0]
type Subfolder = NonNullable<typeof folderStore.subfolders>[0]

const { folderTreeStore, userStore, folderStore } = useStore()
const themeVars = useThemeVars()
const id = computed(() => router.currentRoute.value.params.id as string)
onMounted(() => {
  console.log(`当前文件夹id：`, id.value)
  if(!id.value) return
  folderStore.fetchAndSet(id.value).then(resp => {
    // 获取文件夹后将文件夹 lib 以及 id 记录到 localStorage
    localStorage.setItem(`${folderStore.lib}-folder`, folderStore.id)
  })
})

function handleSubfolderClick(item: Subfolder) {
  router.push(`${RoutePathEnum.FOLDER}/${item.id}`)
}


// ----------------------------- Subfile ----------------------------------


function getCurrentLibIcon(lib: LibraryEnum | undefined) {
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

function handleSubfileClick(item: Subfile) {
  router.push(`${RoutePathEnum.PROJECT}/${item.id}`)
}


</script>

<template>
  <Header />
  <div class="folder">
    <!-- Folder -->
    <div class="folder-list">
      <div class="item" v-for="item in folderStore.subfolders" :key="item.id" @click="handleSubfolderClick(item)">
        <div class="wrapper">
          <div class="title">
            <n-icon :component="FolderFilled" :size="18" color="#F8D777"/>
            <span style="margin-left: 6px;margin-top: 1px;">{{ item.name }}</span>
          </div>
          <div class="meta">
            <div class="date">{{ dayjs(item.createAt).format('YY-MM-DD HH:mm:ss') }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- File -->
    <div class="list">
      <div class="item" v-for="item in folderStore.subfiles" :key="item.id" @click="handleSubfileClick(item)">
        <div class="wrapper">
          <div class="title">
            <n-icon class="title-icon" :component="getCurrentLibIcon(item.lib)" :size="18"/>
            <span style="margin-left: 6px;margin-top: 1px;"> {{ item.title }}</span>
          </div>
          <div class="content">{{ item.abbrev }}</div>
          <div class="meta">
            <div class="date">{{ dayjs(item.updateAt).format('YY-MM-DD HH:mm:ss') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style lang="scss" scoped>
.floatbtn {
  opacity: 0.7;
}
.folder {
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
}
.content {
  flex: 1;
  font-size: 12px;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.meta {
  margin-top: 4px;
  font-size: 10px;
  color: v-bind('themeVars.textColor3');
  opacity: 0.5;
}
</style>
