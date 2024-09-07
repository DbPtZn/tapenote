<script lang="ts" setup>
import router from '@/router'

/** 添加 meta ,阻止浏览器自动缩放窗口 */
// 创建一个新的meta元素
const meta = document.createElement('meta')
// 设置meta标签的属性
meta.name = 'viewport'
meta.content = 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no'
// 将meta元素添加到head部分
document.getElementsByTagName('head')[0].appendChild(meta)
</script>

<template>
  <div class="micro">
    <router-view :key="router.currentRoute.value.fullPath" />
  </div>
</template>

<style lang="scss" scoped>
.micro {
  overflow-x: hidden;
  box-sizing: border-box;
  padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS<11.2/ */
  padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS>11.2/ */
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  // background-color: antiquewhite;
}
// .micro-footer {
//   position: fixed;
//   bottom: 0;
// }
</style>
