<script setup lang="ts">
import Cookies from 'js-cookie'
import useStore from '~/store'
definePageMeta({
  layout: 'manage'
})
const { userStore, columnStore } = useStore()
const router = useRouter()
const token = Cookies.get('Authorization')
if (!token) {
  router.push('/auth/login')
}
onMounted(async () => {
  const id = userStore._id
  if (!id) {
    try {
      await userStore.fetch()
    } catch (error: any) {
      if(error.status === 401) {
        Cookies.remove('Authorization')
        router.push('/auth/login')
      }
    }
  }
})
</script>

<template>
  <div class="manage-container">
    <div class="sidebar-wrapper">
      <MSidebar />
    </div>
    <div v-if="columnStore._id" class="itemlist-wrapper">
      <MItemlist />
    </div>
    <div class="workbench-wrapper">
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
