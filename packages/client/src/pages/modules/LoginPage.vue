<script lang="ts" setup>
import { LoginView } from '@/views'
</script>

<template>
  <div class="login-page" draggable="false">
    <LoginView />
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  display: flex;
  height: 100%;
  width: 100%;
}
// .one {
//   height: 100%;
//   width: 100%;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   background-color: antiquewhite;
//   font-size: 48px;
//   // pointer-events: none;
// }
// .item {
//   display: flex;
//   flex-direction: column;
//   width: 100%;
//   height: 100px;
//   background-color: aqua;
//   // pointer-events: none;
// }
</style>
