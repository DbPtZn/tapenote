<script setup lang="ts">
import Cookies from 'js-cookie'
definePageMeta({
  layout: 'manage'
})
const router = useRouter()
const token = Cookies.get('accessToken')
if (!token) {
  router.push('/auth/login')
}
</script>

<template>
  <div class="manage-container">
    <div class="sidebar-wrapper">
      <MSidebar />
    </div>
    <div class="itemlist-wrapper">
      <MItemlist />
    </div>
    <div class="workbench-wrapper">
      <!-- <MWorkbench /> -->
      <NuxtPage />
    </div>
  </div>
</template>

<style scoped lang="scss">
.manage-container {
  height: 100%;
  display: flex;
  flex-direction: row;
}
.sidebar-wrapper {
  width: 100%;
  // height: 100%;
  max-width: 240px;
}
.itemlist-wrapper {
  width: 100%;
  max-width: 260px;
}
.workbench-wrapper {
  flex: 1;
}
</style>
