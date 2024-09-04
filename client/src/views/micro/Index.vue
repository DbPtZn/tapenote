<script lang="ts" setup>
import Home from "./home/Home.vue"
import { MicroFooter } from './layout'
</script>

<template>
  <div class="micro">
    <!-- <MicroHeader /> -->
    <router-view />
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
