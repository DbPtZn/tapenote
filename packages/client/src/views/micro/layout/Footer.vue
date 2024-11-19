<script lang="ts" setup>
import { useThemeVars } from 'naive-ui'
// import {
//   CreateFilled,
//   HomeFilled,
//   MapFilled,
//   FolderFilled,
//   AccountCircleFilled,
//   EmergencyShareFilled,
//   CreateOutlined,
//   HomeOutlined,
//   MapOutlined,
//   FolderOutlined,
//   AccountCircleOutlined,
//   EmergencyShareOutlined
// } from '@vicons/material'
import { Icon } from '@iconify/vue'
import { onMounted, ref } from 'vue'
import useStore from '@/store'
import router from '@/router';
import { LibraryEnum, RouteNameEnum, RoutePathEnum } from '@/enums'
const { microStore, userStore } = useStore()
const themeVars = useThemeVars()

onMounted(() => {
  // console.log(router.currentRoute.value.name)
  microStore.tab = router.currentRoute.value.name as RouteNameEnum
})
function handleClick(tab: RouteNameEnum) {
  microStore.tab = tab
  // Folder 特别处理
  if(tab === RouteNameEnum.FOLDER) {
    const currentLib = localStorage.getItem('currentFolderLib') as LibraryEnum || LibraryEnum.NOTE
    const id = localStorage.getItem(`${currentLib}-folder`)
    if(!id) {
      // 默认打开根目录
      const rootId = userStore.getDirByLib(currentLib)
      return router.push(`${RoutePathEnum.FOLDER}?id=${rootId}`)
    } else {
      return router.push(`${RoutePathEnum.FOLDER}?id=${id}`)
    }
  }
  router.push({ name: tab })
}
</script>

<template>
  <div class="footer">
    <div class="footer-item" @click="handleClick(RouteNameEnum.RECENT)">
      <!-- <n-icon :component="microStore.tab === RouteNameEnum.RECENT ? CreateFilled : CreateOutlined" :size="24" /> -->
      <Icon :icon="microStore.tab === RouteNameEnum.RECENT ? 'material-symbols:book-4' : 'material-symbols:book-4-outline'" :height="24" />
    </div>
    <div class="footer-item" @click="handleClick(RouteNameEnum.FOLDER)">
      <!-- <n-icon :component="microStore.tab === RouteNameEnum.FOLDER ? FolderFilled : FolderOutlined" :size="24" /> -->
      <Icon :icon="microStore.tab === RouteNameEnum.FOLDER ? 'material-symbols:folder-rounded': 'material-symbols:folder-outline'" :height="24" />
    </div>
    <div class="footer-item" @click="handleClick(RouteNameEnum.SHARE)">
      <!-- <n-icon :component="microStore.tab === RouteNameEnum.SHARE ? EmergencyShareFilled : EmergencyShareOutlined" :size="24" /> -->
      <Icon :icon="microStore.tab === RouteNameEnum.SHARE ?  'material-symbols:emergency-share' : 'material-symbols:emergency-share-outline-rounded'" :height="24" />
      
    </div>
    <div class="footer-item" @click="handleClick(RouteNameEnum.ADMIN)">
      <!-- <n-icon :component="microStore.tab === RouteNameEnum.ADMIN ? AccountCircleFilled : AccountCircleOutlined" :size="24" /> -->
      <Icon :icon="microStore.tab === RouteNameEnum.ADMIN ? 'material-symbols:account-circle' : 'material-symbols:account-circle-outline'" :height="24" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  
  height: 63px;
  min-height: 63px;
  background-color: v-bind('themeVars.cardColor');
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
</style>
