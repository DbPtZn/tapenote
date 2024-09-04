<script lang="ts" setup>
import useStore from '@/store'
import { useThemeVars } from 'naive-ui'
import { computed, onMounted } from 'vue'
import { FolderFilled } from '@vicons/material'
import Header from './Header.vue'
import router from '@/router';
const { folderTreeStore, userStore } = useStore()
const themeVars = useThemeVars()
const id = computed(() => router.currentRoute.value.params.id as string)
onMounted(() => {
  console.log(id.value)
  // folderTreeStore.fetchFirstLevel(id.value ? id.value : userStore.getDirByLib(), )
})
</script>

<template>
  <Header />
  <div class="folder">
    <div class="list">
      <div class="item" v-for="item in 15" :key="item">
        <div class="wrapper">
          <div class="title">
            <n-icon :component="FolderFilled" :size="18" color="#F8D777"/>
            <span style="margin-left: 6px;margin-top: 1px;">标题</span>
          </div>
          <!-- <div class="content">内容内容内容内容内容内容内容内容内容内容内容</div> -->
          <div class="meta">
            <div class="createAt">2023-07-01 00:00:00</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
