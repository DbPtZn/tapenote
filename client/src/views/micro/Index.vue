<script lang="ts" setup>
import router from '@/router'
</script>

<template>
  <div class="micro">
    <router-view :key="router.currentRoute.value.fullPath" />
    <!-- <div class="micro-footer"> 123 </div> -->
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
