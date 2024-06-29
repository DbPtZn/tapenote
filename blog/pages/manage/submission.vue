<script setup lang="ts">
// import { useThemeVars } from 'naive-ui'
// import useStore from '~/store'
// const themeVars = useThemeVars()
// const { submissionStore } = useStore()
// onMounted(() => {
//   // submissionStore.fetch()
// })
/**
 * 1. 首次载入 submission 页面的时候，自动加载未解析的文章列表
 * 2. 用户可以通过按钮选项加载全部的文章列表
 * 3. 首次载入 submission 页面的时候，通过 authcode 自动生成侧边栏列表
 * 4. 选择具体的 authcode 获取对应授权下的文章列表（有必要吗？直接通过列表筛选可否？）
 */
</script>

<template>
  <div class="submission">
    <MSubmission />
  </div>
</template>
<style scoped lang="postcss">
</style>

