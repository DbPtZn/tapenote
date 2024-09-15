<template>
  <n-config-provider :theme="appConfig.theme.dark ? darkTheme : null">
    <n-dialog-provider>
      <n-message-provider>
        <div class="layout">
          <div class="header">
            <ManageHeader />
          </div>
          <div class="content">
            <slot />
          </div>
          <!-- <div class="footer">
            <ManageFooter />
          </div> -->
        </div>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme } from 'naive-ui'
import { useThemeVars } from 'naive-ui'
const themeVars = useThemeVars()
const appConfig = useAppConfig()
</script>

<style scoped lang="scss">
.n-config-provider {
  height: 100vh;
}
// .n-layout {
//   height: 100vh;
// }
// :deep(.n-layout-scroll-container) {
//   overflow-y: hidden;
// }
.layout {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: v-bind('themeVars.bodyColor');
}
.layout-container {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.header {
  position: sticky;
  top: 0;
  height: 64px;
  box-sizing: border-box;
}
.content {
  flex: 1;
  height: calc(100vh - 64px);
  box-sizing: border-box;
}
.footer {
  height: 64px;
  box-sizing: border-box;
}

/** 定制滚动条 */
/* 定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸 */
::-webkit-scrollbar {
  width: 4px;
  height: 16px;
  background-color: unset;
}

/* 定义滚动条轨道 内阴影+圆角 */
::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: unset;
}

/* 定义滑块 内阴影+圆角 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: unset;
  /* background-color: unset; */
  background-color: v-bind('themeVars.scrollbarColor');
}
</style>
