<template>
  <n-config-provider :theme="appConfig.theme.dark ? darkTheme : null">
    <n-layout>
      <n-layout-header>
        <AppHeader />
      </n-layout-header>
      <n-layout-content class="flex-auto" content-style="padding: 24px;">
        <slot />
      </n-layout-content>
      <n-layout-footer>
        <AppFooter />
      </n-layout-footer>
    </n-layout>
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme } from 'naive-ui'
import { useThemeVars } from 'naive-ui'
const themeVars = useThemeVars()
const appConfig = useAppConfig()
</script>


<style lang="scss">
.n-config-provider {
  height: 100%;
}
.n-layout {
  height: 100%;
}

#default {
  background-color: v-bind('themeVars.bodyColor');
}

a {
  text-decoration: none;
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
