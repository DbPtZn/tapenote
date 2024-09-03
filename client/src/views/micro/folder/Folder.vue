<script lang="ts" setup>
import useStore from '@/store'
import { useThemeVars } from 'naive-ui'
import { onMounted } from 'vue'
const { folderTreeStore } = useStore()
const themeVars = useThemeVars()
onMounted(() => {
  // folderTreeStore.getFolderTree()
})
</script>

<template>
  <div class="home">
    <div class="list">
      <div class="item" v-for="item in 20" :key="item">
        <div class="wrapper">
          <div class="title">标题</div>
          <div class="content">内容内容内容内容内容内容内容内容内容内容内容</div>
          <div class="meta">
            <div class="createAt">2023-07-01 00:00:00</div>
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
}
</style>
