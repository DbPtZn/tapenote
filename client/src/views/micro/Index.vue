<script lang="ts" setup>
import Home from "./home/Home.vue"
import router from '@/router'
import { MicroFooter } from './layout'
</script>

<template>
  <div class="micro">
    <!-- <MicroHeader /> -->
    <router-view :key="router.currentRoute.value.fullPath" />
    <MicroFooter />
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
