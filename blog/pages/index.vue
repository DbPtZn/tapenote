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
function handleClick() {
  console.log('click')
}
</script>

<template>
  <div class="home">
    <ItemCard v-for="item in 10" :key="10" @click="handleClick" />
  </div>
</template>
<style scoped lang="postcss">
.home {
  width: 100%;
  margin: 0 auto;
  background-color: v-bind('themeVars.bodyColor');
}
@media (min-width: 1024px) {
  .home {
    max-width: 1024px;
  }
}
@include Desktop {
  .home {
    max-width: 1024px;
  }
}
@include Mobile {
  
}
</style>

