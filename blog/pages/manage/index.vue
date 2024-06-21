<template>
  <div>manage</div>
  <nuxt-link to="/">index</nuxt-link>
</template>

<script setup lang="ts">
import Cookies from 'js-cookie'
const router = useRouter()
// console.log(localStorage)
// const token = localStorage?.getItem('accessToken')
const token = Cookies.get('accessToken')
// console.log(token)
if (!token) {
  router.push('/auth/login')
}

</script>
