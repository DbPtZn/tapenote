<script lang="ts" setup>
import router from '@/router'
</script>

<template>
  <div class="micro">
    <router-view :key="router.currentRoute.value.fullPath" />
  </div>
</template>

<style lang="scss" scoped>
.micro {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  // background-color: antiquewhite;
}
 
</style>
