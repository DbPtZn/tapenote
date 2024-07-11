<script setup lang="ts">
import { useThemeVars } from 'naive-ui'
import type { ArticleListItem, ArticleType } from '~/types';

// const runtimeConfig = useRuntimeConfig()
// const appConfig = useAppConfig()
const router = useRouter()
// console.log(runtimeConfig)
// console.log(appConfig)
// console.log(appConfig.title)
const route = useRoute()
if(!route.params.uid) {
  // 本地测试：VC5b8uAp
  // console.log('route.params.uid' + route.params.uid)
  navigateTo('/')
}
/** 定义页面元数据 */
// definePageMeta({
//   middleware: (from) => {
//     if (from.path === '/') {
//       // return navigateTo(`/${validFeeds[0]}/1`)
//     }
//   }
// })
// console.log('uid'+ route.params.uid)
const articleList = ref<ArticleListItem[]>([])
useFetch<ArticleListItem[]>('/api/article/list/' + route.params.uid).then(res => {
  if(res.error.value) {
    navigateTo(`/`)
    return
  }
  if(res.data.value) articleList.value = res.data.value
  // console.log(articleList.value)
})
const themeVars = useThemeVars()
function handleClick(item: ArticleListItem) {
  router.push(`/article/${item._id}`)
}
</script>

<template>
  <div class="home">
    <ItemCard 
      v-for="item in articleList" 
      :key="item._id"
      :id="item._id"
      :cover="item.cover"
      :title="item.title"
      :abbrev="item.abbrev"
      :columnName="'专栏名'"
      :wordage="item.detail.wordage"
      :avatar="item.author.avatar"
      :penname="item.author.penname"
      :create-at="item.createAt"
      @click="handleClick(item)" 
    />
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

