<script lang="ts" setup>
import useStore from '@/store'
import { darkThemeOverrides, lightThemeOverrides } from './theme/_api'
import { GlobalNavView } from '@/views'
import { ref } from 'vue'
// import { computed, onMounted, provide, watch } from 'vue'
// import { useRouter } from 'vue-router'
const { settingStore } = useStore()
const widthVal = ref(0)
// const router = useRouter()
// const theme = computed(() => router.currentRoute.value.query.theme as string)
// provide('getTheme', {
//   getTheme: () => {
//     return settingStore.theme
//   }
// })
// watch(() => theme, () => {
//   switch (theme.value) {
//     case 'dark':
//       settingStore.useDark()
//       // console.log(theme.value)
//       break
//     case 'light':
//       settingStore.useLight()
//       // console.log(theme.value)
//       break
//     default:
//       settingStore.useDark()
//       // console.log(theme.value)
//       return
//   }
// }, { deep: true })

// onMounted(() => {
//   /**
//    * 这里 getInfo 在 Login 登录页面就会执行，如果无法获得用户信息会返回 401，强制跳转至登录页
//    * 但后续登录成功后不会再一次执行该代码，因此如果是上述情况，无法再通过此代码获取用户信息
//    * 因此在 sidebarview 中我们要再次调用 getInfo
//    */
//   // userStore.getInfo()
// })
</script>
<template>
  <n-config-provider :theme="settingStore.theme" :theme-overrides="settingStore.theme ? darkThemeOverrides : lightThemeOverrides">
    <n-modal-provider>
      <n-dialog-provider>
        <n-message-provider>
          <n-notification-provider>
            <n-layout>
              <div ref="rootRef" class="root-page" :data-theme="[settingStore.theme ? 'dark-theme' : 'light-theme']">
                <GlobalNavView @collapse="ev => (widthVal = ev)" />
                <div class="router-view" :style="{ width: `calc(100% - ${widthVal}px)` }">
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
