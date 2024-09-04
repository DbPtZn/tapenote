<script lang="ts" setup>
import useStore from '@/store'
import { darkThemeOverrides, lightThemeOverrides } from './theme/_api'
import { GlobalNavView } from '@/views'
import { ref } from 'vue'
import router from '@/router';
import { RouteNameEnum, RoutePathEnum } from '@/enums';
const { settingStore } = useStore()
const widthVal = ref(0)

/** 判断设备 */
const userAgent = navigator.userAgent.toLowerCase()
// 常见的移动设备标识
const mobileDevices = /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i
settingStore.isMobile = mobileDevices.test(userAgent)
if(settingStore.isMobile) router.push({ name: RouteNameEnum.RECENT })
console.log('当前设备：', settingStore.isMobile ? '移动端' : 'PC端')
</script>
<template>
  <n-config-provider :theme="settingStore.theme" :theme-overrides="settingStore.theme ? darkThemeOverrides : lightThemeOverrides">
    <n-modal-provider>
      <n-dialog-provider>
        <n-message-provider>
          <n-notification-provider>
            <n-layout>
              <div ref="rootRef" class="root-page" :data-theme="[settingStore.theme ? 'dark-theme' : 'light-theme']">
                <GlobalNavView v-show="!settingStore.isMobile" @collapse="ev => (widthVal = ev)" />
                <div class="router-view" :style="{ width: `calc(100% - ${!settingStore.isMobile ? widthVal : 0}px)` }">
                  <router-view />
                </div>
              </div>
            </n-layout>
          </n-notification-provider>
        </n-message-provider>
      </n-dialog-provider>
    </n-modal-provider>
  </n-config-provider>
</template>

<style lang="scss" scoped>
.n-layout {
  height: 100%;
  width: 100%;
}
.n-config-provider {
  width: 100%;
  height: 100%;
}
.root-page {
  display: flex;
  flex-direction: row;
  overflow-y: auto;
  overflow-y: hidden;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  // .router-view {
  //   width: calc(100% - 64px);
  // }
}
</style>
