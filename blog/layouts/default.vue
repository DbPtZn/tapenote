<template>
  <n-config-provider :theme="appConfig.theme.dark ? darkTheme : null">
    <n-dialog-provider>
      <n-message-provider>
        <n-layout content-style="display: flex; flex-direction: column;">
          <div class="header">
            <AppHeader />
          </div>
          <div class="content">
            <slot />
          </div>
          <div class="footer">
            <AppFooter />
          </div>
        </n-layout>
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

<style lang="scss" scoped>
.n-config-provider {
  height: 100%;
}
.n-layout {
  height: 100vh;
}
.layout-container {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.header {
  position: sticky;
  top: 0;
  height: 64px;
}
.content {
  flex: 1;
}
.footer {
  // height: 64px;
}

#default {
  background-color: v-bind('themeVars.bodyColor');
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
