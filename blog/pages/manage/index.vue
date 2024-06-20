<template>
  <div>manage</div>
  <nuxt-link to="/">index</nuxt-link>
</template>

<script setup lang="ts">
const router = useRouter()
console.log(localStorage)
const token = localStorage?.getItem('token')
console.log(router)
if (!token) {
  router.push('/auth/login')
}

</script>
