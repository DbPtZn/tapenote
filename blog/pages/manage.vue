<script setup lang="ts">
import Cookies from 'js-cookie'
definePageMeta({
  layout: 'manage'
})
const router = useRouter()
const token = Cookies.get('Authorization')
if (!token) {
  router.push('/auth/login')
}
const userinfo = Cookies.get('userinfo')
if (!userinfo) {
  const { data, error } = await useFetch('/api/user/info')
  // console.log(data)
  if(error.value?.statusCode === 401) {
    Cookies.remove('Authorization')
    router.push('/auth/login')
  } else {
    useLocalStorage('userInfo', JSON.stringify(data.value))
  }
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
