<script setup lang="ts">
import { useThemeVars } from 'naive-ui'

const runtimeConfig = useRuntimeConfig()
const appConfig = useAppConfig()
// console.log(runtimeConfig)
// console.log(appConfig)
// console.log(appConfig.title)
console.log('index')
// const route = useRoute()
// if(!route.params.uid) {
//   navigateTo('/home')
// }
/** 定义页面元数据 */
// definePageMeta({
//   middleware: (from) => {
//     if (from.path === '/') {
//       // return navigateTo(`/${validFeeds[0]}/1`)
//     }
//   }
// })
// useFetch('/api/article/list').then(res => {

// })
const themeVars = useThemeVars()
function handleClick(id: number) {
  console.log('click')
  navigateTo(`/articles/${id}`)
}
</script>

<template>
  <div class="home">
    home
    <!-- <ItemCard v-for="item in 10" :key="10" @click="handleClick(item)" /> -->
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
</style>

