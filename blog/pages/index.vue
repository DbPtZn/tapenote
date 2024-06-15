<script setup lang="ts">
import { useThemeVars } from 'naive-ui'

const runtimeConfig = useRuntimeConfig()
const appConfig = useAppConfig()
// console.log(runtimeConfig)
// console.log(appConfig)
// console.log(appConfig.title)
/** 定义页面元数据 */
definePageMeta({
  middleware: (from) => {
    if (from.path === '/') {
      // return navigateTo(`/${validFeeds[0]}/1`)
    }
  }
})
const themeVars = useThemeVars()
</script>

<template>
  <div class="bg">
    123
  </div>
  <!-- <div>Index</div>
  <nuxt-link to="/test">test</nuxt-link>
  <div>
    <nuxt-link to="/micro/abc">to micro</nuxt-link>
  </div>
  <div>
    <h1>{{ $t('hello', { name: 'vue-i18n' }) }}</h1>
  </div> -->
</template>
<style scoped lang="postcss">
.bg {
  /* color: v-bind('themeVars.textColor1'); */
  background-color: v-bind('themeVars.bodyColor');
}
</style>

